import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PortfolioPageContent } from "./portfolio-page";

const matchMedia = vi.fn(() => ({
  matches: false,
  media: "(max-width: 720px)",
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}) as unknown as MediaQueryList);

beforeEach(() => {
  vi.stubGlobal("matchMedia", matchMedia);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it("apresenta a introdução e o visualizador sem oferecer download", () => {
  render(<PortfolioPageContent />);

  const page = screen.getByRole("region", { name: "Portfólio artístico" });
  expect(within(page).getByRole("heading", {
    level: 2,
    name: "Portfólio artístico",
  })).toBeVisible();
  expect(within(page).getByText(
    "Conheça a trajetória artística de Serginho Barbosa como cantor, ator, compositor, locutor e produtor. Navegue pelas páginas para acompanhar seus projetos, apresentações e realizações.",
  )).toBeVisible();

  const viewer = within(page).getByRole("region", { name: "Visualizador do portfólio" });
  expect(within(viewer).getByRole("img", {
    name: "Capa do portfólio de Serginho Barbosa",
  })).toBeVisible();
  expect(within(viewer).getByRole("status")).toHaveTextContent("Página 1 de 70");
  expect(within(page).queryByRole("link", { name: /baixar|download/i })).not.toBeInTheDocument();
  expect(within(page).queryByRole("button", { name: /baixar|download/i })).not.toBeInTheDocument();
});
