import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PortfolioPageAsset } from "./portfolio-pages-data";
import { PortfolioViewer } from "./portfolio-viewer";

const pages = [
  {
    number: 1,
    compactSrc: "/portfolio/page-001-960.webp",
    desktopSrc: "/portfolio/page-001-1600.webp",
    alt: "Capa do portfólio",
  },
  {
    number: 2,
    compactSrc: "/portfolio/page-002-960.webp",
    desktopSrc: "/portfolio/page-002-1600.webp",
    alt: "Sumário do portfólio",
  },
  {
    number: 3,
    compactSrc: "/portfolio/page-003-960.webp",
    desktopSrc: "/portfolio/page-003-1600.webp",
    alt: "Biografia do artista",
  },
] as const satisfies readonly PortfolioPageAsset[];

class PrefetchImage {
  src = "";
  srcset = "";
  sizes = "";

  constructor() {
    prefetchedImages.push(this);
  }
}

const prefetchedImages: PrefetchImage[] = [];
const portfolioCss = readFileSync(
  "src/components/sites/serginho-barbosa/portfolio.module.css",
  "utf8",
);

beforeEach(() => {
  prefetchedImages.length = 0;
  vi.stubGlobal("Image", PrefetchImage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("visualizador do portfólio", () => {
  it("abre na primeira página com limites, imagem responsiva e só os controles essenciais", () => {
    render(<PortfolioViewer pages={pages} />);

    const viewer = screen.getByRole("region", { name: "Visualizador do portfólio" });
    const stage = within(viewer).getByRole("group", { name: "Página atual do portfólio" });
    const image = within(stage).getByRole("img", { name: "Capa do portfólio" });
    const source = image.closest("picture")?.querySelector("source");

    expect(stage).toHaveAttribute("tabindex", "0");
    expect(new URL(image.getAttribute("src") ?? "", window.location.href).pathname).toBe(
      pages[0].desktopSrc,
    );
    expect(image).toHaveAttribute("width", "1600");
    expect(image).toHaveAttribute("height", "900");
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(source).toHaveAttribute("media", "(max-width: 720px)");
    expect(source).toHaveAttribute("srcset", pages[0].compactSrc);
    expect(within(viewer).getByRole("status")).toHaveTextContent("Página 1 de 3");
    expect(within(viewer).getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(within(viewer).getByRole("button", { name: "Próxima" })).toBeEnabled();
    expect(within(viewer).getAllByRole("img")).toHaveLength(1);
    expect(within(viewer).queryByRole("link")).not.toBeInTheDocument();
    expect(
      within(viewer).queryByRole("button", { name: /download|baixar|tela cheia|miniatura/i }),
    ).not.toBeInTheDocument();
  });

  it("avança e volta pelos botões", async () => {
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    const secondImage = screen.getByRole("img", { name: "Sumário do portfólio" });
    expect(secondImage).toBeVisible();
    expect(secondImage).not.toHaveAttribute("fetchpriority");
    expect(screen.getByRole("status")).toHaveTextContent("Página 2 de 3");

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(screen.getByRole("img", { name: "Capa do portfólio" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("navega pelas setas quando o palco está focado", async () => {
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    stage.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Página 2 de 3");

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("navega nas duas direções com swipe horizontal de exatamente 48 pixels", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 152, clientY: 108 }] });

    expect(screen.getByRole("status")).toHaveTextContent("Página 2 de 3");

    fireEvent.touchStart(stage, { touches: [{ clientX: 152, clientY: 100 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 200, clientY: 108 }] });
    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora swipe horizontal abaixo de 48 pixels", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 153, clientY: 100 }] });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora gesto em que o deslocamento vertical domina", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 130, clientY: 200 }] });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora gesto com deslocamentos horizontal e vertical empatados", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 152, clientY: 148 }] });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("para na última página e desabilita o avanço", async () => {
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));

    expect(screen.getByRole("img", { name: "Biografia do artista" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Página 3 de 3");
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeEnabled();
  });

  it("mostra erro no palco, mantém os controles e limpa o aviso ao mudar de página", async () => {
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.error(within(stage).getByRole("img", { name: "Capa do portfólio" }));

    expect(within(stage).getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar esta página do portfólio.",
    );
    expect(screen.getByRole("button", { name: "Próxima" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(within(stage).queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Sumário do portfólio" })).toBeVisible();
  });

  it("pré-carrega só a próxima página e não repete páginas já preparadas", async () => {
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    expect(prefetchedImages).toHaveLength(1);
    expect(prefetchedImages[0]).toMatchObject({
      src: pages[1].desktopSrc,
      srcset: `${pages[1].compactSrc} 960w, ${pages[1].desktopSrc} 1600w`,
      sizes: "(max-width: 720px) 100vw, 1600px",
    });

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(prefetchedImages).toHaveLength(2);
    expect(prefetchedImages[1]).toMatchObject({
      src: pages[2].desktopSrc,
      srcset: `${pages[2].compactSrc} 960w, ${pages[2].desktopSrc} 1600w`,
      sizes: "(max-width: 720px) 100vw, 1600px",
    });

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(prefetchedImages).toHaveLength(2);
  });

  it("preserva no CSS os contratos visuais, táteis e de movimento", () => {
    expect(portfolioCss).toMatch(
      /\.stage\s*\{[^}]*aspect-ratio:\s*16 \/ 9;[^}]*touch-action:\s*pan-y pinch-zoom;[^}]*\}/,
    );
    expect(portfolioCss).toMatch(/\.stage:focus-visible\s*\{[^}]*outline:/);
    expect(portfolioCss).toMatch(/\.image\s*\{[^}]*object-fit:\s*contain;/);
    expect(portfolioCss).toMatch(
      /\.button\s*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/,
    );
    expect(portfolioCss).toMatch(
      /\.picture\s*\{[^}]*animation:\s*page-reveal 160ms ease-out both;/,
    );
    expect(portfolioCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.picture\s*\{\s*animation:\s*none;/,
    );
    expect(portfolioCss).toMatch(
      /\.stage\[data-error="true"\] \.picture\s*\{[^}]*animation:\s*none;[^}]*opacity:\s*\.22;/,
    );
  });
});
