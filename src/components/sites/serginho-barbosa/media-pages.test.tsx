import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { GalleryPage, getAlbum } from "./media-pages";

function requiredAlbum(slug: string, id: string) {
  const album = getAlbum(slug, id);
  if (!album) throw new Error("Álbum ausente: " + slug);
  return album;
}

function imageSource(image: HTMLElement) {
  const src = image.getAttribute("src");
  if (!src) throw new Error("Imagem sem src");
  const url = new URL(src, window.location.origin);
  return url.searchParams.get("url") ?? url.pathname;
}

it("usa a hero horizontal dedicada nos álbuns sem foto em paisagem", () => {
  const dvd = requiredAlbum("dvd-vander-lima-2025", "15");
  const { rerender } = render(<GalleryPage album={dvd} />);
  expect(imageSource(screen.getByRole("img", {
    name: "Foto de destaque do álbum DVD Vander LIma - 2025",
  }))).toContain("gallery-albums/banners/dvd-vander-lima-2025.webp");

  const feat = requiredAlbum("feat-venezuela-cuba-argentina", "16");
  rerender(<GalleryPage album={feat} />);
  expect(imageSource(screen.getByRole("img", {
    name: "Foto de destaque do álbum Feat - Venezuela, Cuba, Argentina",
  }))).toContain("gallery-albums/banners/feat-venezuela-cuba-argentina.webp");
});

it("mantém a primeira foto horizontal como fallback dos outros álbuns", () => {
  const carnaval = requiredAlbum("carnaval-2026", "13");
  const expected = carnaval.photos.find(({ width, height }) => width >= height);
  if (!expected) throw new Error("Carnaval 2026 precisa de foto horizontal");

  render(<GalleryPage album={carnaval} />);
  expect(imageSource(screen.getByRole("img", {
    name: "Foto do álbum Carnaval 2026",
  }))).toContain(expected.src);
});
