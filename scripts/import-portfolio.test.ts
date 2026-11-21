// @vitest-environment node

import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";

type PromotionOptions = {
  portfolioRoot: string;
  stagingPages: string;
  destination: string;
  backupPath: string;
  renamePath?: typeof rename;
};

type ImportPortfolioLibrary = {
  promoteStagedPages(options: PromotionOptions): Promise<void>;
  acquireImportLock?: (
    portfolioRoot: string,
    ownerToken: string,
  ) => Promise<{ lockPath: string; release: () => Promise<void> }>;
  validateRenderedPng?: (pngPath: string) => Promise<void>;
  runCommand?: (
    command: string,
    args: readonly string[],
    options?: { timeoutMs?: number },
  ) => string;
  assertFileSha256?: (
    filePath: string,
    expectedHash: string,
  ) => Promise<string>;
};

const libraryPath = path.join(
  process.cwd(),
  "scripts",
  "import-portfolio-lib.mjs",
);
const temporaryRoots: string[] = [];

async function loadLibrary(): Promise<ImportPortfolioLibrary> {
  expect(existsSync(libraryPath), libraryPath).toBe(true);
  return import(/* @vite-ignore */ pathToFileURL(libraryPath).href) as Promise<ImportPortfolioLibrary>;
}

async function createTemporaryPortfolio() {
  const portfolioRoot = await mkdtemp(
    path.join(os.tmpdir(), "portfolio-import-test-"),
  );
  temporaryRoots.push(portfolioRoot);

  const stagingRoot = path.join(portfolioRoot, ".portfolio-import-stage-test");
  const stagingPages = path.join(stagingRoot, "pages");
  const destination = path.join(portfolioRoot, "pages");
  const backupPath = path.join(
    portfolioRoot,
    ".portfolio-pages-backup-test",
  );
  await mkdir(stagingPages, { recursive: true });

  return { portfolioRoot, stagingPages, destination, backupPath };
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) =>
      rm(root, { recursive: true, force: true }),
    ),
  );
});

describe("transação de assets do portfólio", () => {
  it("promove o staging e remove apenas o backup que criou", async () => {
    const library = await loadLibrary();
    const paths = await createTemporaryPortfolio();
    await mkdir(paths.destination, { recursive: true });
    await writeFile(path.join(paths.destination, "old.txt"), "old");
    await writeFile(path.join(paths.stagingPages, "new.txt"), "new");

    await library.promoteStagedPages(paths);

    await expect(
      readFile(path.join(paths.destination, "new.txt"), "utf8"),
    ).resolves.toBe("new");
    expect(existsSync(paths.backupPath)).toBe(false);
    expect(existsSync(paths.stagingPages)).toBe(false);
  });

  it("restaura o destino anterior quando a promoção falha", async () => {
    const library = await loadLibrary();
    const paths = await createTemporaryPortfolio();
    await mkdir(paths.destination, { recursive: true });
    await writeFile(path.join(paths.destination, "old.txt"), "old");
    await writeFile(path.join(paths.stagingPages, "new.txt"), "new");

    let renameCalls = 0;
    const renamePath: typeof rename = async (source, destination) => {
      renameCalls += 1;
      if (renameCalls === 2) {
        throw new Error("falha simulada na promoção");
      }
      await rename(source, destination);
    };

    await expect(
      library.promoteStagedPages({ ...paths, renamePath }),
    ).rejects.toThrow("falha simulada na promoção");

    await expect(
      readFile(path.join(paths.destination, "old.txt"), "utf8"),
    ).resolves.toBe("old");
    await expect(
      readFile(path.join(paths.stagingPages, "new.txt"), "utf8"),
    ).resolves.toBe("new");
    expect(existsSync(paths.backupPath)).toBe(false);
  });

  it("preserva o backup próprio quando a restauração também falha", async () => {
    const library = await loadLibrary();
    const paths = await createTemporaryPortfolio();
    await mkdir(paths.destination, { recursive: true });
    await writeFile(path.join(paths.destination, "old.txt"), "old");
    await writeFile(path.join(paths.stagingPages, "new.txt"), "new");

    let renameCalls = 0;
    const renamePath: typeof rename = async (source, destination) => {
      renameCalls += 1;
      if (renameCalls === 2) {
        throw new Error("falha simulada na promoção");
      }
      if (renameCalls === 3) {
        throw new Error("falha simulada na restauração");
      }
      await rename(source, destination);
    };

    let caught: unknown;
    try {
      await library.promoteStagedPages({ ...paths, renamePath });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AggregateError);
    expect((caught as AggregateError).errors).toHaveLength(2);
    expect((caught as Error).message).toContain("backup preservado");
    expect(existsSync(paths.destination)).toBe(false);
    await expect(
      readFile(path.join(paths.backupPath, "old.txt"), "utf8"),
    ).resolves.toBe("old");
    await expect(
      readFile(path.join(paths.stagingPages, "new.txt"), "utf8"),
    ).resolves.toBe("new");
  });

  it("rejeita qualquer path transacional fora do portfolioRoot", async () => {
    const library = await loadLibrary();
    const paths = await createTemporaryPortfolio();
    const outsideRoot = await mkdtemp(
      path.join(os.tmpdir(), "portfolio-import-outside-test-"),
    );
    temporaryRoots.push(outsideRoot);
    const unsafeBackupPath = path.join(outsideRoot, "backup");

    await mkdir(paths.destination, { recursive: true });
    await writeFile(path.join(paths.destination, "old.txt"), "old");
    await writeFile(path.join(paths.stagingPages, "new.txt"), "new");

    await expect(
      library.promoteStagedPages({
        ...paths,
        backupPath: unsafeBackupPath,
      }),
    ).rejects.toThrow("Caminho fora do diretório permitido");

    await expect(
      readFile(path.join(paths.destination, "old.txt"), "utf8"),
    ).resolves.toBe("old");
    await expect(
      readFile(path.join(paths.stagingPages, "new.txt"), "utf8"),
    ).resolves.toBe("new");
    expect(existsSync(unsafeBackupPath)).toBe(false);
  });

  it("impede duas importações concorrentes com lock exclusivo", async () => {
    const library = await loadLibrary();
    const { portfolioRoot } = await createTemporaryPortfolio();
    expect(typeof library.acquireImportLock).toBe("function");

    const firstLock = await library.acquireImportLock!(
      portfolioRoot,
      "owner-one",
    );
    expect(existsSync(firstLock.lockPath)).toBe(true);

    await expect(
      library.acquireImportLock!(portfolioRoot, "owner-two"),
    ).rejects.toThrow("importação do portfólio já está em andamento");
    expect(existsSync(firstLock.lockPath)).toBe(true);

    await firstLock.release();
    expect(existsSync(firstLock.lockPath)).toBe(false);

    const nextLock = await library.acquireImportLock!(
      portfolioRoot,
      "owner-three",
    );
    await nextLock.release();
  });

  it("preserva um lock que deixou de pertencer à execução", async () => {
    const library = await loadLibrary();
    const { portfolioRoot } = await createTemporaryPortfolio();
    const lock = await library.acquireImportLock!(
      portfolioRoot,
      "owner-original",
    );
    await writeFile(
      lock.lockPath,
      `${JSON.stringify({ ownerToken: "owner-substituto" })}\n`,
    );

    await expect(lock.release()).rejects.toThrow(
      "pertence a outra execução e foi preservado",
    );
    expect(existsSync(lock.lockPath)).toBe(true);
  });
});

describe("validação do render intermediário", () => {
  it("aceita apenas PNG 1600 × 900 sem rotação implícita", async () => {
    const library = await loadLibrary();
    const { portfolioRoot } = await createTemporaryPortfolio();
    expect(typeof library.validateRenderedPng).toBe("function");

    const validPng = path.join(portfolioRoot, "valid.png");
    const wrongSizePng = path.join(portfolioRoot, "wrong-size.png");
    const orientedPng = path.join(portfolioRoot, "oriented.png");
    const jpegWithPngName = path.join(portfolioRoot, "not-really.png");
    const input = {
      create: {
        width: 1600,
        height: 900,
        channels: 3 as const,
        background: "white",
      },
    };

    await sharp(input).png().toFile(validPng);
    await sharp({
      create: { ...input.create, width: 900, height: 1600 },
    }).png().toFile(wrongSizePng);
    await sharp(input).withMetadata({ orientation: 6 }).png().toFile(orientedPng);
    await sharp(input).jpeg().toFile(jpegWithPngName);

    await expect(library.validateRenderedPng!(validPng)).resolves.toBeUndefined();
    await expect(library.validateRenderedPng!(wrongSizePng)).rejects.toThrow(
      "1600 × 900",
    );
    await expect(library.validateRenderedPng!(orientedPng)).rejects.toThrow(
      "rotação implícita",
    );
    await expect(library.validateRenderedPng!(jpegWithPngName)).rejects.toThrow(
      "formato PNG",
    );
  });
});

describe("execução das ferramentas externas", () => {
  it("interrompe subprocessos que ultrapassam o timeout declarado", async () => {
    const library = await loadLibrary();
    expect(typeof library.runCommand).toBe("function");

    expect(() =>
      library.runCommand!(
        process.execPath,
        ["-e", "setTimeout(() => {}, 10_000)"],
        { timeoutMs: 50 },
      ),
    ).toThrow("excedeu o timeout de 50 ms");
  });
});

describe("identidade do PDF curado", () => {
  it("rejeita fonte cujo SHA-256 não corresponde ao manifesto", async () => {
    const library = await loadLibrary();
    const { portfolioRoot } = await createTemporaryPortfolio();
    expect(typeof library.assertFileSha256).toBe("function");

    const source = path.join(portfolioRoot, "portfolio.pdf");
    const contents = "canonical portfolio fixture";
    const expectedHash = createHash("sha256").update(contents).digest("hex");
    await writeFile(source, contents);

    await expect(
      library.assertFileSha256!(source, expectedHash),
    ).resolves.toBe(expectedHash);
    await expect(
      library.assertFileSha256!(source, "0".repeat(64)),
    ).rejects.toThrow("atualize o checksum e o manifesto juntos");
  });
});
