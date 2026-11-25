import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import sharp from "sharp";

sharp.cache({ files: 0 });

const projectRoot = process.cwd();
const sourceRoot = process.env.GALLERY_SOURCE_ROOT
  ? path.resolve(process.env.GALLERY_SOURCE_ROOT)
  : path.join(
      projectRoot,
      "Atualizacoes",
      "drive-download-20261120T133846Z-1-001",
    );
const dataPath = path.join(
  projectRoot,
  "src",
  "components",
  "sites",
  "serginho-barbosa",
  "media-pages-data.json",
);
const publicRoot = path.join(projectRoot, "public", "sites", "serginho-barbosa");

const albumDefinitions = [
  {
    label: "Carnaval 2026",
    folder: "Carnaval 2026",
    slug: "carnaval-2026",
    id: "13",
  },
  {
    label: "Conserto Natal 2025",
    folder: "Conserto Natal 2025",
    slug: "conserto-natal-2025",
    id: "14",
  },
  {
    label: "DVD Vander LIma - 2025",
    folder: "DVD Vander LIma - 2025",
    slug: "dvd-vander-lima-2025",
    id: "15",
    bannerSource: "WhatsApp Image 2026-11-19 at 19.21.21.jpeg",
    bannerExtract: { left: 0, top: 400, width: 914, height: 514 },
  },
  {
    label: "Feat - Venezuela, Cuba, Argentina",
    folder: "Feat - Venezuela, Cuba, Argentina",
    slug: "feat-venezuela-cuba-argentina",
    id: "16",
    bannerSource: "WhatsApp Image 2026-11-19 at 19.51.12.jpeg",
  },
  {
    label: "Festival Gastronômico",
    folder: "Festival Gastronómico 2024",
    slug: "festival-gastronomico-2024",
    id: "17",
  },
  {
    label: "Julifet 2026",
    folder: "Julifet 2026",
    slug: "julifet-2026",
    id: "18",
  },
  {
    label: "Show Cenico Voz Companheira 2025",
    folder: "Show Cenico Voz Companheira 2025",
    slug: "show-cenico-voz-companheira-2025",
    id: "19",
  },
  {
    label: "Baile Brilho Novo - Maio 2024",
    folder: "Baile Brilho Novo - Maio 2024",
    slug: "baile-brilho-novo-maio-2024",
    id: "20",
  },
];

const collator = new Intl.Collator("pt-BR", {
  numeric: true,
  sensitivity: "base",
});
const acceptedExtensions = new Set([".jpg", ".jpeg", ".png"]);
const managedIds = new Set(albumDefinitions.map(({ id }) => id));
const stagingPrefix = ".gallery-import-stage-";
const retryableFileSystemCodes = new Set(["EBUSY", "EPERM"]);
const replaceableRenameCodes = new Set(["EBUSY", "EEXIST", "ENOTEMPTY", "EPERM"]);
const webpOptions = {
  effort: 6,
  smartSubsample: true,
};

function assertWebpMetadata(metadata, assetPath) {
  if (metadata.format !== "webp") {
    throw new Error(`Formato inesperado no asset gerado: ${assetPath}`);
  }

  if (!metadata.width || !metadata.height) {
    throw new Error(`Dimensões ausentes no WebP gerado: ${assetPath}`);
  }

  return { width: metadata.width, height: metadata.height };
}

function resolveInside(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(resolvedRoot, ...relativePath.split("/"));
  const relative = path.relative(resolvedRoot, resolvedPath);

  if (
    !relative ||
    path.isAbsolute(relative) ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Caminho fora do diretório permitido: ${resolvedPath}`);
  }

  return resolvedPath;
}

function assertDirectChild(targetPath, parentPath, namePrefix) {
  const resolvedParent = path.resolve(parentPath);
  const resolvedTarget = path.resolve(targetPath);

  if (
    path.dirname(resolvedTarget) !== resolvedParent ||
    !path.basename(resolvedTarget).startsWith(namePrefix)
  ) {
    throw new Error(`Recusa de limpar caminho inseguro: ${resolvedTarget}`);
  }
}

function getErrorCode(error) {
  return error && typeof error === "object" && "code" in error
    ? error.code
    : undefined;
}

async function retryFileOperation(operation) {
  const maxAttempts = 8;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (
        !retryableFileSystemCodes.has(getErrorCode(error)) ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      await delay(50 * attempt);
    }
  }
}

async function renameWithRetry(sourcePath, destinationPath) {
  await retryFileOperation(() => rename(sourcePath, destinationPath));
}

async function removeFileWithRetry(filePath) {
  await retryFileOperation(() => rm(filePath, { force: true }));
}

async function replaceFileSafely(sourcePath, destinationPath, backupPath) {
  try {
    await renameWithRetry(sourcePath, destinationPath);
    return;
  } catch (error) {
    if (!replaceableRenameCodes.has(getErrorCode(error))) {
      throw error;
    }

    await mkdir(path.dirname(backupPath), { recursive: true });

    try {
      await renameWithRetry(destinationPath, backupPath);
    } catch (backupError) {
      if (getErrorCode(backupError) === "ENOENT") {
        throw error;
      }

      throw backupError;
    }

    try {
      await renameWithRetry(sourcePath, destinationPath);
    } catch (replacementError) {
      try {
        await renameWithRetry(backupPath, destinationPath);
      } catch (restoreError) {
        throw new AggregateError(
          [replacementError, restoreError],
          `Falha ao substituir ${destinationPath}; backup preservado em ${backupPath}.`,
        );
      }

      throw replacementError;
    }

    await removeFileWithRetry(backupPath);
  }
}

async function readAlbumPlan(definition) {
  const folderPath = path.join(sourceRoot, definition.folder);
  const directoryEntries = await readdir(folderPath, { withFileTypes: true });
  const imageEntries = directoryEntries
    .filter(
      (entry) =>
        entry.isFile() && acceptedExtensions.has(path.extname(entry.name).toLowerCase()),
    )
    .sort((left, right) => collator.compare(left.name, right.name));

  const sources = [];
  for (const entry of imageEntries) {
    const sourcePath = path.join(folderPath, entry.name);
    const contents = await readFile(sourcePath);
    const hash = createHash("sha256").update(contents).digest("hex");
    sources.push({ name: entry.name, sourcePath, contents, hash });
  }

  const seenHashes = new Set();
  const uniqueSources = [];
  let duplicateCount = 0;

  for (const source of sources) {
    if (seenHashes.has(source.hash)) {
      duplicateCount += 1;
      continue;
    }

    seenHashes.add(source.hash);
    uniqueSources.push(source);
  }

  const bannerSource = definition.bannerSource
    ? sources.find(({ name }) => name === definition.bannerSource)
    : undefined;

  if (definition.bannerSource && !bannerSource) {
    throw new Error(
      `Fonte do banner não encontrada em ${definition.folder}: ${definition.bannerSource}`,
    );
  }

  return { definition, uniqueSources, duplicateCount, bannerSource };
}

async function writePhotoAssets(definition, source, index, outputRoot) {
  const number = String(index + 1).padStart(2, "0");
  const fullRelativePath = `gallery-albums/full/${definition.slug}-${number}.webp`;
  const thumbnailRelativePath =
    `gallery-albums/thumbs/${definition.slug}-${number}_400.webp`;
  const fullPath = resolveInside(outputRoot, fullRelativePath);
  const thumbnailPath = resolveInside(outputRoot, thumbnailRelativePath);

  await sharp(source.contents)
    .rotate()
    .resize({
      width: 1280,
      height: 1280,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 78, ...webpOptions })
    .toFile(fullPath);

  const fullDimensions = assertWebpMetadata(await sharp(fullPath).metadata(), fullPath);

  await sharp(source.contents)
    .rotate()
    .resize({
      width: 600,
      height: 600,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 72, ...webpOptions })
    .toFile(thumbnailPath);

  assertWebpMetadata(await sharp(thumbnailPath).metadata(), thumbnailPath);

  return {
    src: fullRelativePath,
    thumbnail: thumbnailRelativePath,
    ...fullDimensions,
  };
}

async function writeBannerAsset(definition, source, outputRoot) {
  const relativePath = `gallery-albums/banners/${definition.slug}.webp`;
  const bannerPath = resolveInside(outputRoot, relativePath);
  const bannerPipeline = sharp(source.contents).rotate();

  if (definition.bannerExtract) {
    bannerPipeline.extract(definition.bannerExtract);
  }

  await bannerPipeline
    .resize({
      width: 1280,
      height: 720,
      fit: "cover",
      position: sharp.strategy.attention,
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 78, ...webpOptions })
    .toFile(bannerPath);

  assertWebpMetadata(await sharp(bannerPath).metadata(), bannerPath);

  return { src: relativePath, position: "center" };
}

async function buildAlbum(plan, outputRoot) {
  const { definition, uniqueSources, bannerSource } = plan;
  const photos = [];

  for (const [index, source] of uniqueSources.entries()) {
    photos.push(await writePhotoAssets(definition, source, index, outputRoot));
  }

  const album = {
    label: definition.label,
    slug: definition.slug,
    id: definition.id,
  };

  if (bannerSource) {
    album.banner = await writeBannerAsset(definition, bannerSource, outputRoot);
  }

  album.photos = photos;
  return album;
}

async function validateStagedBatch(generatedAlbums, stagingAssetsRoot) {
  const fullPaths = generatedAlbums.flatMap(({ photos }) =>
    photos.map(({ src }) => src),
  );
  const thumbnailPaths = generatedAlbums.flatMap(({ photos }) =>
    photos.map(({ thumbnail }) => thumbnail),
  );
  const bannerPaths = generatedAlbums.flatMap(({ banner }) =>
    banner ? [banner.src] : [],
  );
  const assetPaths = [...fullPaths, ...thumbnailPaths, ...bannerPaths];

  if (
    fullPaths.length !== 60 ||
    thumbnailPaths.length !== 60 ||
    bannerPaths.length !== 2 ||
    assetPaths.length !== 122 ||
    new Set(assetPaths).size !== 122
  ) {
    throw new Error(
      `Lote incompleto: ${fullPaths.length} fulls, ${thumbnailPaths.length} thumbs e ` +
        `${bannerPaths.length} banners.`,
    );
  }

  let totalBytes = 0;
  const fullHashes = new Set();

  for (const relativePath of assetPaths) {
    const stagedPath = resolveInside(stagingAssetsRoot, relativePath);
    assertWebpMetadata(await sharp(stagedPath).metadata(), stagedPath);

    const contents = await readFile(stagedPath);
    const maxBytes = relativePath.includes("/thumbs/")
      ? 100 * 1024
      : 300 * 1024;

    if (contents.length > maxBytes) {
      throw new Error(`Asset acima do limite de bytes: ${relativePath}`);
    }

    totalBytes += contents.length;
    if (relativePath.includes("/full/")) {
      fullHashes.add(createHash("sha256").update(contents).digest("hex"));
    }
  }

  if (fullHashes.size !== 60) {
    throw new Error(`Fulls binariamente distintos: esperado 60, recebido ${fullHashes.size}.`);
  }

  if (totalBytes > 7 * 1024 * 1024) {
    throw new Error(`Lote acima de 7 MiB: ${totalBytes} bytes.`);
  }

  return assetPaths;
}

async function promoteAssets(assetPaths, stagingAssetsRoot, runToken) {
  for (const relativePath of assetPaths) {
    const stagedPath = resolveInside(stagingAssetsRoot, relativePath);
    const destinationPath = resolveInside(publicRoot, relativePath);
    const backupPath = path.join(
      path.dirname(destinationPath),
      `.${path.basename(destinationPath)}.${runToken}.bak`,
    );

    await mkdir(path.dirname(destinationPath), { recursive: true });
    await replaceFileSafely(stagedPath, destinationPath, backupPath);
  }
}

async function cleanupRunArtifacts(stagingRoot, jsonTempPath) {
  const cleanupErrors = [];

  if (jsonTempPath) {
    try {
      assertDirectChild(jsonTempPath, path.dirname(dataPath), `.${path.basename(dataPath)}-`);
      await removeFileWithRetry(jsonTempPath);
    } catch (error) {
      cleanupErrors.push(error);
    }
  }

  if (stagingRoot) {
    try {
      assertDirectChild(stagingRoot, publicRoot, stagingPrefix);
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
    throw new AggregateError(cleanupErrors, "Falha ao limpar temporários da importação.");
  }
}

async function main() {
  let stagingRoot;
  let jsonTempPath;
  let operationError;

  try {
    const plans = [];
    for (const definition of albumDefinitions) {
      plans.push(await readAlbumPlan(definition));
    }

    const plannedPhotoCount = plans.reduce(
      (total, { uniqueSources }) => total + uniqueSources.length,
      0,
    );
    const duplicateCount = plans.reduce(
      (total, plan) => total + plan.duplicateCount,
      0,
    );
    const plannedBannerCount = plans.filter(({ bannerSource }) => bannerSource).length;

    if (
      plans.length !== 8 ||
      plannedPhotoCount !== 60 ||
      plannedBannerCount !== 2 ||
      duplicateCount !== 9
    ) {
      throw new Error(
        `Contagens inesperadas: ${plans.length} álbuns, ${plannedPhotoCount} fotos, ` +
          `${plannedBannerCount} banners e ${duplicateCount} duplicatas.`,
      );
    }

    const data = JSON.parse(await readFile(dataPath, "utf8"));
    if (!Array.isArray(data.albums)) {
      throw new Error("media-pages-data.json não contém uma lista de álbuns válida.");
    }

    stagingRoot = await mkdtemp(path.join(publicRoot, stagingPrefix));
    assertDirectChild(stagingRoot, publicRoot, stagingPrefix);
    const runToken = path.basename(stagingRoot).slice(stagingPrefix.length);
    const stagingAssetsRoot = path.join(stagingRoot, "assets");

    await Promise.all([
      mkdir(path.join(stagingAssetsRoot, "gallery-albums", "full"), { recursive: true }),
      mkdir(path.join(stagingAssetsRoot, "gallery-albums", "thumbs"), { recursive: true }),
      mkdir(path.join(stagingAssetsRoot, "gallery-albums", "banners"), { recursive: true }),
    ]);

    const generatedAlbums = [];
    for (const plan of plans) {
      generatedAlbums.push(await buildAlbum(plan, stagingAssetsRoot));
    }

    const generatedPhotoCount = generatedAlbums.reduce(
      (total, album) => total + album.photos.length,
      0,
    );
    const generatedBannerCount = generatedAlbums.filter(({ banner }) => banner).length;

    if (
      generatedAlbums.length !== 8 ||
      generatedPhotoCount !== 60 ||
      generatedBannerCount !== 2 ||
      duplicateCount !== 9
    ) {
      throw new Error(
        `Geração inesperada: ${generatedAlbums.length} álbuns, ` +
          `${generatedPhotoCount} fotos, ${generatedBannerCount} banners e ` +
          `${duplicateCount} duplicatas.`,
      );
    }

    const assetPaths = await validateStagedBatch(generatedAlbums, stagingAssetsRoot);
    const historicalAlbums = data.albums.filter(
      ({ id }) => !managedIds.has(String(id)),
    );
    data.albums = [...historicalAlbums, ...generatedAlbums];

    jsonTempPath = path.join(
      path.dirname(dataPath),
      `.${path.basename(dataPath)}-${runToken}.tmp`,
    );
    const jsonBackupPath = path.join(
      path.dirname(dataPath),
      `.${path.basename(dataPath)}-${runToken}.bak`,
    );
    assertDirectChild(jsonTempPath, path.dirname(dataPath), `.${path.basename(dataPath)}-`);
    assertDirectChild(jsonBackupPath, path.dirname(dataPath), `.${path.basename(dataPath)}-`);

    await writeFile(jsonTempPath, `${JSON.stringify(data, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });

    await promoteAssets(assetPaths, stagingAssetsRoot, runToken);
    await replaceFileSafely(jsonTempPath, dataPath, jsonBackupPath);
  } catch (error) {
    operationError = error;
  }

  let cleanupError;
  try {
    await cleanupRunArtifacts(stagingRoot, jsonTempPath);
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

  console.log(
    "Gerados 8 álbuns, 60 fotos únicas e 2 banners; 9 duplicatas ignoradas.",
  );
}

await main();
