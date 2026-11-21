import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  acquireImportLock,
  assertFileSha256,
  assertInside,
  promoteStagedPages,
  runCommand,
  validateRenderedPng,
} from "./import-portfolio-lib.mjs";

sharp.cache({ files: 0 });

const sourcePdf = process.argv[2] ? path.resolve(process.argv[2]) : undefined;
if (
  !sourcePdf ||
  path.extname(sourcePdf).toLowerCase() !== ".pdf" ||
  !existsSync(sourcePdf)
) {
  throw new Error('Uso: npm run import:portfolio -- "caminho/Portfolio.pdf"');
}

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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
const canonicalPdfSha256 =
  "b461ef7635a3c2e64e613b9c9f159013cb7243da7faba8b79f3c98576f3b08ff";
const pdfInfoTimeoutMs = 30_000;
const renderTimeoutMs = 120_000;
const maxBytes = { "960": 250 * 1024, "1600": 400 * 1024 };

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

async function cleanupRunArtifacts(stagingRoot) {
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

  await mkdir(portfolioRoot, { recursive: true });

  const ownerToken = randomUUID();
  let importLock;
  let stagingRoot;
  let operationError;

  try {
    importLock = await acquireImportLock(portfolioRoot, ownerToken);
    await assertFileSha256(sourcePdf, canonicalPdfSha256);
    assertPdf(
      runCommand("pdfinfo", [sourcePdf], { timeoutMs: pdfInfoTimeoutMs }),
    );

    stagingRoot = await mkdtemp(path.join(portfolioRoot, stagingPrefix));
    assertDirectChild(stagingRoot, portfolioRoot, stagingPrefix);

    const runToken = path.basename(stagingRoot).slice(stagingPrefix.length);
    const stagingPages = assertInside(stagingRoot, path.join(stagingRoot, "pages"));
    const renderRoot = assertInside(stagingRoot, path.join(stagingRoot, "render"));
    const backupPath = path.join(portfolioRoot, `${backupPrefix}${runToken}`);
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

      runCommand(
        "pdftoppm",
        [
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
        ],
        { timeoutMs: renderTimeoutMs },
      );

      await validateRenderedPng(pngPath);
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
    await promoteStagedPages({
      portfolioRoot,
      stagingPages,
      destination,
      backupPath,
    });
  } catch (error) {
    operationError = error;
  }

  let cleanupError;
  try {
    await cleanupRunArtifacts(stagingRoot);
  } catch (error) {
    cleanupError = error;
  }

  let lockReleaseError;
  try {
    await importLock?.release();
  } catch (error) {
    lockReleaseError = error;
  }

  const errors = [operationError, cleanupError, lockReleaseError].filter(Boolean);
  if (errors.length > 1) {
    throw new AggregateError(
      errors,
      "Falha na importação ou na limpeza dos recursos desta execução.",
    );
  }
  if (errors.length === 1) {
    throw errors[0];
  }

  console.log("Geradas 70 páginas do portfólio em 140 WebPs validados.");
}

await main();
