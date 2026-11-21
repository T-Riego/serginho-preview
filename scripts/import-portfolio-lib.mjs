import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { open, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const importLockName = ".portfolio-import.lock";

export function assertInside(root, targetPath) {
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

function getErrorCode(error) {
  return error && typeof error === "object" && "code" in error
    ? error.code
    : undefined;
}

export function runCommand(command, args, { timeoutMs = 120_000 } = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    timeout: timeoutMs,
    windowsHide: true,
  });

  if (getErrorCode(result.error) === "ETIMEDOUT") {
    throw new Error(`${command} excedeu o timeout de ${timeoutMs} ms.`);
  }
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `${command} falhou`);
  }

  return result.stdout;
}

export async function assertFileSha256(filePath, expectedHash) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }
  const actualHash = hash.digest("hex");

  if (actualHash !== expectedHash.toLowerCase()) {
    throw new Error(
      "O PDF não corresponde à fonte canônica; ao trocar o documento, " +
        "atualize o checksum e o manifesto juntos.",
    );
  }

  return actualHash;
}

export async function acquireImportLock(portfolioRoot, ownerToken) {
  if (!ownerToken) {
    throw new Error("O lock de importação exige um token de ownership.");
  }

  const lockPath = assertInside(
    portfolioRoot,
    path.join(portfolioRoot, importLockName),
  );
  let handle;

  try {
    handle = await open(lockPath, "wx");
  } catch (error) {
    if (getErrorCode(error) === "EEXIST") {
      throw new Error(
        "Uma importação do portfólio já está em andamento; remova o lock somente após confirmar que ela terminou.",
      );
    }
    throw error;
  }

  try {
    await handle.writeFile(
      `${JSON.stringify({ ownerToken, pid: process.pid, startedAt: new Date().toISOString() })}\n`,
      "utf8",
    );
  } catch (error) {
    await handle.close();
    await rm(lockPath, { force: true });
    throw error;
  }
  await handle.close();

  let released = false;
  return {
    lockPath,
    async release() {
      if (released) {
        return;
      }

      const lock = JSON.parse(await readFile(lockPath, "utf8"));
      if (lock.ownerToken !== ownerToken) {
        throw new Error("O lock atual pertence a outra execução e foi preservado.");
      }

      await rm(lockPath);
      released = true;
    },
  };
}

export async function validateRenderedPng(pngPath) {
  const metadata = await sharp(pngPath).metadata();

  if (metadata.format !== "png") {
    throw new Error(`O render intermediário deve estar no formato PNG: ${pngPath}`);
  }
  if (metadata.width !== 1600 || metadata.height !== 900) {
    throw new Error(`O render intermediário deve medir 1600 × 900 px: ${pngPath}`);
  }
  if (metadata.orientation && metadata.orientation !== 1) {
    throw new Error(`O render intermediário contém rotação implícita: ${pngPath}`);
  }
}

export async function promoteStagedPages({
  portfolioRoot,
  stagingPages,
  destination,
  backupPath,
  renamePath = rename,
  removePath = rm,
}) {
  assertInside(portfolioRoot, stagingPages);
  assertInside(portfolioRoot, destination);
  assertInside(portfolioRoot, backupPath);

  let ownsBackup = false;
  let promotionSucceeded = false;

  if (existsSync(destination)) {
    if (existsSync(backupPath)) {
      throw new Error("O caminho temporário de backup já existe.");
    }
    await renamePath(destination, backupPath);
    ownsBackup = true;
  }

  try {
    await renamePath(stagingPages, destination);
    promotionSucceeded = true;
  } catch (promotionError) {
    if (ownsBackup) {
      try {
        await renamePath(backupPath, destination);
        ownsBackup = false;
      } catch (restoreError) {
        throw new AggregateError(
          [promotionError, restoreError],
          `Falha ao promover o lote e restaurar o backup preservado em ${backupPath}.`,
        );
      }
    }

    throw promotionError;
  }

  if (ownsBackup && promotionSucceeded) {
    await removePath(backupPath, { recursive: true, force: true });
  }
}
