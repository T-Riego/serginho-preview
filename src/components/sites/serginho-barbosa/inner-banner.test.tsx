import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { InnerBanner } from "./inner-banner";

it("mostra o caminho local do álbum para o catálogo", () => {
  render(<InnerBanner title="Brilho Novo" page="discografias" />);

  const trail = within(screen.getByRole("navigation", { name: "Caminho da página" }));
  expect(trail.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
  expect(trail.getByRole("link", { name: "Discografias" })).toHaveAttribute("href", "/discografias");
  expect(trail.getByText("Brilho Novo")).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("heading", { level: 1, name: "Brilho Novo" })).toBeVisible();
});

it("usa imagens do acervo diferentes em Vídeos e Contatos", () => {
  const { rerender } = render(<InnerBanner title="Vídeos" page="videos" />);
  const video = screen.getByRole("img", { name: "Serginho Barbosa cantando no Julifest" });
  expect(video).toHaveAttribute("src", expect.stringContaining("20190206225542.webp"));

  rerender(<InnerBanner title="Contatos" page="contatos" />);
  expect(screen.getByRole("img", { name: "Serginho Barbosa sorrindo no Julifest" })).toHaveAttribute(
    "src", expect.stringContaining("20190206225457.webp"),
  );
});
