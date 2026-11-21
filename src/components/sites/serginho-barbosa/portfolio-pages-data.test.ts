// @vitest-environment node

import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

type PortfolioPageAsset = Readonly<{
  number: number;
  compactSrc: string;
  desktopSrc: string;
  alt: string;
}>;

const projectRoot = process.cwd();
const manifestPath = path.join(
  projectRoot,
  "src",
  "components",
  "sites",
  "serginho-barbosa",
  "portfolio-pages-data.ts",
);
const publicRoot = path.join(projectRoot, "public");
const pagesRoot = path.join(
  publicRoot,
  "sites",
  "serginho-barbosa",
  "portfolio",
  "pages",
);

async function loadPortfolioPages(): Promise<readonly PortfolioPageAsset[]> {
  expect(existsSync(manifestPath), manifestPath).toBe(true);

  const manifest = (await import(
    /* @vite-ignore */ pathToFileURL(manifestPath).href
  )) as { portfolioPages?: unknown };

  expect(Array.isArray(manifest.portfolioPages)).toBe(true);
  return manifest.portfolioPages as readonly PortfolioPageAsset[];
}

describe("assets do portfólio", () => {
  it("mantém o manifesto completo, significativo e ordenado", async () => {
    const portfolioPages = await loadPortfolioPages();

    expect(portfolioPages).toHaveLength(70);
    expect(portfolioPages.map(({ number }) => number)).toEqual(
      Array.from({ length: 70 }, (_, index) => index + 1),
    );

    const paths = portfolioPages.flatMap(({ compactSrc, desktopSrc }) => [
      compactSrc,
      desktopSrc,
    ]);
    expect(new Set(paths).size).toBe(140);

    for (const { number, compactSrc, desktopSrc, alt } of portfolioPages) {
      const padded = String(number).padStart(3, "0");
      expect(compactSrc).toBe(
        `/sites/serginho-barbosa/portfolio/pages/page-${padded}-960.webp`,
      );
      expect(desktopSrc).toBe(
        `/sites/serginho-barbosa/portfolio/pages/page-${padded}-1600.webp`,
      );
      expect(alt.trim().length).toBeGreaterThanOrEqual(12);
    }
  });

  it("mantém os 140 WebPs nas dimensões e pesos permitidos", async () => {
    const portfolioPages = await loadPortfolioPages();
    const expectedNames = portfolioPages.flatMap(({ number }) => {
      const padded = String(number).padStart(3, "0");
      return [`page-${padded}-960.webp`, `page-${padded}-1600.webp`];
    });

    expect(existsSync(pagesRoot), pagesRoot).toBe(true);
    const actualNames = readdirSync(pagesRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort();
    expect(actualNames).toEqual([...expectedNames].sort());

    for (const { number } of portfolioPages) {
      const padded = String(number).padStart(3, "0");
      for (const variant of [
        { suffix: "960", width: 960, height: 540, maxBytes: 250 * 1024 },
        { suffix: "1600", width: 1600, height: 900, maxBytes: 400 * 1024 },
      ] as const) {
        const file = path.join(
          pagesRoot,
          `page-${padded}-${variant.suffix}.webp`,
        );
        expect(existsSync(file), file).toBe(true);

        const metadata = await sharp(file).metadata();
        expect(metadata).toMatchObject({
          format: "webp",
          width: variant.width,
          height: variant.height,
        });
        expect(statSync(file).size, file).toBeLessThanOrEqual(variant.maxBytes);
      }
    }

    const publicFiles = readdirSync(publicRoot, { recursive: true });
    expect(
      publicFiles.some((file) => String(file).toLowerCase().endsWith(".pdf")),
    ).toBe(false);
  });
});
