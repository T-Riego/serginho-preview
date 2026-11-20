// @vitest-environment node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import data from "./media-pages-data.json";
import { getAlbum, getAlbumParams } from "./media-pages";
import { navigation } from "./site-content";

type BannerRecord = {
  src: string;
  position?: string;
  mobilePosition?: string;
};

type PhotoRecord = {
  src: string;
  thumbnail: string;
  caption?: string;
  width: number;
  height: number;
};

type AlbumRecord = {
  label: string;
  slug: string;
  id: string;
  banner?: BannerRecord;
  photos: PhotoRecord[];
};

type ExpectedAlbum = {
  label: string;
  slug: string;
  id: string;
  photoCount: number;
  banner?: string;
};

const expectedAlbums: readonly ExpectedAlbum[] = [
  { label: "Carnaval 2026", slug: "carnaval-2026", id: "13", photoCount: 6 },
  { label: "Conserto Natal 2025", slug: "conserto-natal-2025", id: "14", photoCount: 3 },
  {
    label: "DVD Vander LIma - 2025",
    slug: "dvd-vander-lima-2025",
    id: "15",
    photoCount: 2,
    banner: "gallery-albums/banners/dvd-vander-lima-2025.webp",
  },
  {
    label: "Feat - Venezuela, Cuba, Argentina",
    slug: "feat-venezuela-cuba-argentina",
    id: "16",
    photoCount: 3,
    banner: "gallery-albums/banners/feat-venezuela-cuba-argentina.webp",
  },
  {
    label: "Festival Gastronómico 2024",
    slug: "festival-gastronomico-2024",
    id: "17",
    photoCount: 7,
  },
  { label: "Julifet 2026", slug: "julifet-2026", id: "18", photoCount: 7 },
  {
    label: "Show Cenico Voz Companheira 2025",
    slug: "show-cenico-voz-companheira-2025",
    id: "19",
    photoCount: 15,
  },
];

const albums = data.albums as AlbumRecord[];
const assetRoot = path.join(process.cwd(), "public", "sites", "serginho-barbosa");
const assetPath = (relativePath: string) => path.join(assetRoot, ...relativePath.split("/"));

describe("atualização da galeria em novembro de 2026", () => {
  it("publica os sete álbuns e as 43 fotos únicas", () => {
    const imported = expectedAlbums.map((expected) => {
      const album = albums.find(({ slug, id }) => slug === expected.slug && id === expected.id);
      expect(album, expected.label).toBeDefined();
      expect(album?.label).toBe(expected.label);
      expect(album?.photos).toHaveLength(expected.photoCount);
      if (expected.banner) {
        expect(album?.banner?.src).toBe(expected.banner);
      } else {
        expect(album?.banner).toBeUndefined();
      }
      expect(getAlbum(expected.slug, expected.id)).toBe(album);
      return album as AlbumRecord;
    });

    const photos = imported.flatMap((album) => album.photos);
    const bannerPaths = imported.flatMap((album) => album.banner ? [album.banner.src] : []);
    const photoPaths = new Set(photos.flatMap(({ src, thumbnail }) => [src, thumbnail]));

    expect(photos).toHaveLength(43);
    expect(bannerPaths).toHaveLength(2);
    expect(new Set(bannerPaths).size).toBe(2);
    for (const bannerPath of bannerPaths) {
      expect(photoPaths.has(bannerPath), bannerPath).toBe(false);
    }
    expect(getAlbumParams()).toEqual(expect.arrayContaining(
      expectedAlbums.map(({ slug, id }) => ({ slug, id })),
    ));
  });

  it("mantém slugs, ids e caminhos de fotos únicos", () => {
    expect(new Set(albums.map(({ slug }) => slug)).size).toBe(albums.length);
    expect(new Set(albums.map(({ id }) => id)).size).toBe(albums.length);

    const photos = albums.flatMap(({ photos }) => photos);
    expect(new Set(photos.map(({ src }) => src)).size).toBe(photos.length);
    expect(new Set(photos.map(({ thumbnail }) => thumbnail)).size).toBe(photos.length);
  });

  it("referencia apenas WebPs existentes e leves", () => {
    const imported = albums.filter(({ id }) => Number(id) >= 13 && Number(id) <= 19);
    const files = imported.flatMap((album) => [
      ...album.photos.flatMap(({ src, thumbnail, width, height }) => {
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
        expect(src).toMatch(/\.webp$/);
        expect(thumbnail).toMatch(/_400\.webp$/);
        return [
          { relativePath: src, maxBytes: 300 * 1024, isFull: true },
          { relativePath: thumbnail, maxBytes: 100 * 1024, isFull: false },
        ];
      }),
      ...(album.banner
        ? [{ relativePath: album.banner.src, maxBytes: 300 * 1024, isFull: false }]
        : []),
    ]);

    let totalBytes = 0;
    const fullHashes: string[] = [];
    for (const { relativePath, maxBytes, isFull } of files) {
      const absolutePath = assetPath(relativePath);
      expect(existsSync(absolutePath), relativePath).toBe(true);
      const contents = readFileSync(absolutePath);
      expect(contents.length, relativePath).toBeGreaterThanOrEqual(12);
      expect(contents.toString("ascii", 0, 4), relativePath).toBe("RIFF");
      expect(contents.toString("ascii", 8, 12), relativePath).toBe("WEBP");
      const bytes = statSync(absolutePath).size;
      expect(bytes, relativePath).toBeLessThanOrEqual(maxBytes);
      totalBytes += bytes;
      if (isFull) {
        fullHashes.push(createHash("sha256").update(contents).digest("hex"));
      }
    }
    expect(fullHashes).toHaveLength(43);
    expect(new Set(fullHashes).size).toBe(43);
    expect(totalBytes).toBeLessThanOrEqual(6 * 1024 * 1024);
  });

  it("mantém o recorte editorial do banner do DVD", () => {
    const banner = readFileSync(assetPath(
      "gallery-albums/banners/dvd-vander-lima-2025.webp",
    ));

    expect(createHash("sha256").update(banner).digest("hex")).toBe(
      "91e1909093face4d28eb173298fd3b30caea27e755e822e76c44a2bb0247107a",
    );
  });

  it("mantém o submenu global sincronizado com os dados", () => {
    const links = navigation.find(({ label }) => label === "Galeria de Fotos")?.children ?? [];
    for (const { label, slug, id } of expectedAlbums) {
      expect(links).toContainEqual([label, slug + "/" + id]);
    }
  });
});
