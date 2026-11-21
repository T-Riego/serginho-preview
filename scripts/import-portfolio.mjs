import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

sharp.cache({ files: 0 });

const sourcePdf = process.argv[2] ? path.resolve(process.argv[2]) : undefined;
if (
  !sourcePdf ||
  path.extname(sourcePdf).toLowerCase() !== ".pdf" ||
  !existsSync(sourcePdf)
) {
  throw new Error('Uso: npm run import:portfolio -- "caminho/Portfolio.pdf"');
}

const projectRoot = process.cwd();
const portfolioRoot = path.join(
  projectRoot,
  "public",
  "sites",
  "serginho-barbosa",
  "portfolio",
);
const destination = path.join(portfolioRoot, "pages");
const stagingPrefix = ".portfolio-import-stage-";
const backupPrefix = ".portfolio-pages-backup-";
const maxBytes = { "960": 250 * 1024, "1600": 400 * 1024 };

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `${command} falhou`);
  }

  return result.stdout;
}

function assertInside(root, targetPath) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(targetPath);
  const relative = path.relative(resolvedRoot, resolvedTarget);

  if (
    !relative ||
    path.isAbsolute(relative) ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Caminho fora do diretório permitido: ${resolvedTarget}`);
  }

  return resolvedTarget;
}

function assertDirectChild(targetPath, parentPath, requiredPrefix) {
  const resolvedParent = path.resolve(parentPath);
  const resolvedTarget = assertInside(resolvedParent, targetPath);

  if (
    path.dirname(resolvedTarget) !== resolvedParent ||
    !path.basename(resolvedTarget).startsWith(requiredPrefix)
  ) {
    throw new Error(`Recusa de limpar caminho inseguro: ${resolvedTarget}`);
  }

  return resolvedTarget;
}

function assertPdf(info) {
  if (
    !/^Pages:\s+70\s*$/m.test(info) ||
    !/^Page size:\s+1440(?:\.0+)? x 810(?:\.0+)? pts(?:\s.*)?$/m.test(info)
  ) {
    throw new Error("O PDF deve possuir 70 páginas de 1440 × 810 pt.");
  }
}

async function encode(source, destinationPath, width, height, quality) {
  await sharp(source)
    .resize({ width, height, fit: "fill", kernel: sharp.kernel.lanczos3 })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(destinationPath);
}

function expectedFileNames() {
  return Array.from({ length: 70 }, (_, index) => {
    const padded = String(index + 1).padStart(3, "0");
    return [`page-${padded}-960.webp`, `page-${padded}-1600.webp`];
  }).flat();
}

async function validateStagedBatch(stagingPages) {
  const expectedNames = expectedFileNames().sort();
  const entries = await readdir(stagingPages, { withFileTypes: true });
  const actualNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();

  if (
    entries.some((entry) => !entry.isFile()) ||
    JSON.stringify(actualNames) !== JSON.stringify(expectedNames)
  ) {
    throw new Error(
      `Lote incompleto: esperados 140 WebPs, encontrados ${actualNames.length}.`,
    );
  }

  const desktopHashes = new Set();

  for (let page = 1; page <= 70; page += 1) {
    const padded = String(page).padStart(3, "0");
    for (const variant of [
      { suffix: "960", width: 960, height: 540 },
      { suffix: "1600", width: 1600, height: 900 },
    ]) {
      const name = `page-${padded}-${variant.suffix}.webp`;
      const assetPath = assertInside(stagingPages, path.join(stagingPages, name));
      const [metadata, fileStats, contents] = await Promise.all([
        sharp(assetPath).metadata(),
        stat(assetPath),
        readFile(assetPath),
      ]);

      if (
        metadata.format !== "webp" ||
        metadata.width !== variant.width ||
        metadata.height !== variant.height
      ) {
        throw new Error(`Formato ou dimensões inválidos: ${name}`);
      }

      if (fileStats.size > maxBytes[variant.suffix]) {
        throw new Error(
          `Asset acima do limite: ${name} possui ${fileStats.size} bytes.`,
        );
      }

      if (variant.suffix === "1600") {
        desktopHashes.add(createHash("sha256").update(contents).digest("hex"));
      }
    }
  }

  if (desktopHashes.size !== 70) {
    throw new Error(
      `WebPs desktop distintos: esperados 70, encontrados ${desktopHashes.size}.`,
    );
  }
}

async function promoteStagedPages(stagingPages, backupPath) {
  const hadDestination = existsSync(destination);

  if (hadDestination) {
    if (existsSync(backupPath)) {
      throw new Error("O caminho temporário de backup já existe.");
    }
    await rename(destination, backupPath);
  }

  try {
    await rename(stagingPages, destination);
  } catch (replacementError) {
    if (!hadDestination) {
      throw replacementError;
    }

    try {
      await rename(backupPath, destination);
    } catch (restoreError) {
      throw new AggregateError(
        [replacementError, restoreError],
        "Falha ao promover o lote e restaurar o backup.",
      );
    }

    throw replacementError;
  }
}

async function cleanupRunArtifacts(stagingRoot, backupPath) {
  const cleanupErrors = [];

  if (stagingRoot && existsSync(stagingRoot)) {
    try {
      assertDirectChild(stagingRoot, portfolioRoot, stagingPrefix);
      await rm(stagingRoot, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 100,
      });
    } catch (error) {
      cleanupErrors.push(error);
    }
  }

  if (backupPath && existsSync(backupPath)) {
    try {
      assertDirectChild(backupPath, portfolioRoot, backupPrefix);
      if (!existsSync(destination)) {
        throw new Error(
          `Backup preservado porque o destino não existe: ${path.basename(backupPath)}`,
        );
      }
      await rm(backupPath, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 100,
      });
    } catch (error) {
      cleanupErrors.push(error);
    }
  }

  if (cleanupErrors.length > 0) {
    throw new AggregateError(
      cleanupErrors,
      "Falha ao limpar temporários da importação.",
    );
  }
}

async function main() {
  const sourceStats = await stat(sourcePdf);
  if (!sourceStats.isFile()) {
    throw new Error('Uso: npm run import:portfolio -- "caminho/Portfolio.pdf"');
  }

  assertPdf(run("pdfinfo", [sourcePdf]));
  await mkdir(portfolioRoot, { recursive: true });

  let stagingRoot;
  let backupPath;
  let operationError;

  try {
    stagingRoot = await mkdtemp(path.join(portfolioRoot, stagingPrefix));
    assertDirectChild(stagingRoot, portfolioRoot, stagingPrefix);

    const runToken = path.basename(stagingRoot).slice(stagingPrefix.length);
    const stagingPages = assertInside(stagingRoot, path.join(stagingRoot, "pages"));
    const renderRoot = assertInside(stagingRoot, path.join(stagingRoot, "render"));
    backupPath = path.join(portfolioRoot, `${backupPrefix}${runToken}`);
    assertDirectChild(backupPath, portfolioRoot, backupPrefix);

    await Promise.all([
      mkdir(stagingPages, { recursive: true }),
      mkdir(renderRoot, { recursive: true }),
    ]);

    for (let page = 1; page <= 70; page += 1) {
      const padded = String(page).padStart(3, "0");
      const pngPrefix = assertInside(
        renderRoot,
        path.join(renderRoot, `page-${padded}`),
      );
      const pngPath = `${pngPrefix}.png`;

      run("pdftoppm", [
        "-f",
        String(page),
        "-l",
        String(page),
        "-singlefile",
        "-png",
        "-r",
        "80",
        sourcePdf,
        pngPrefix,
      ]);

      await encode(
        pngPath,
        path.join(stagingPages, `page-${padded}-960.webp`),
        960,
        540,
        78,
      );
      await encode(
        pngPath,
        path.join(stagingPages, `page-${padded}-1600.webp`),
        1600,
        900,
        80,
      );

      assertInside(portfolioRoot, pngPath);
      await rm(pngPath, { force: true });
      if (page % 10 === 0 || page === 70) {
        console.log(`Página ${page}/70 processada.`);
      }
    }

    await validateStagedBatch(stagingPages);
    await promoteStagedPages(stagingPages, backupPath);
  } catch (error) {
    operationError = error;
  }

  let cleanupError;
  try {
    await cleanupRunArtifacts(stagingRoot, backupPath);
  } catch (error) {
    cleanupError = error;
  }

  if (operationError && cleanupError) {
    throw new AggregateError(
      [operationError, cleanupError],
      "Falha na importação e na limpeza de temporários.",
    );
  }
  if (operationError) {
    throw operationError;
  }
  if (cleanupError) {
    throw cleanupError;
  }

  console.log("Geradas 70 páginas do portfólio em 140 WebPs validados.");
}

await main();
