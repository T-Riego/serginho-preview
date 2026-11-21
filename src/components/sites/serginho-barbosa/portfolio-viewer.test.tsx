import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
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

const compactMediaQuery = "(max-width: 720px)";
const requestedSources: string[] = [];
let compactViewport = false;

class PrefetchImage {
  private source = "";

  constructor() {
    prefetchedImages.push(this);
  }

  get src() {
    return this.source;
  }

  set src(value: string) {
    this.source = value;
    requestedSources.push(value);
  }
}

const prefetchedImages: PrefetchImage[] = [];
const matchMedia = vi.fn((query: string) => ({
  matches: query === compactMediaQuery && compactViewport,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}) as unknown as MediaQueryList);
const portfolioCss = readFileSync(
  "src/components/sites/serginho-barbosa/portfolio.module.css",
  "utf8",
);

beforeEach(() => {
  prefetchedImages.length = 0;
  requestedSources.length = 0;
  compactViewport = false;
  matchMedia.mockClear();
  vi.stubGlobal("Image", PrefetchImage);
  vi.stubGlobal("matchMedia", matchMedia);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function touch(identifier: number, clientX: number, clientY: number) {
  return { identifier, clientX, clientY };
}

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
    expect(image).toHaveAttribute("loading", "eager");
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
    fireEvent.touchStart(stage, { touches: [touch(1, 200, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(1, 152, 108)],
    });

    expect(screen.getByRole("status")).toHaveTextContent("Página 2 de 3");

    fireEvent.touchStart(stage, { touches: [touch(2, 152, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(2, 200, 108)],
    });
    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora swipe horizontal abaixo de 48 pixels", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [touch(3, 200, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(3, 153, 100)],
    });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora gesto em que o deslocamento vertical domina", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [touch(4, 200, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(4, 130, 200)],
    });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora gesto com deslocamentos horizontal e vertical empatados", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [touch(5, 200, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(5, 152, 148)],
    });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("ignora gesto que começa com múltiplos toques", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, {
      touches: [touch(6, 200, 100), touch(7, 210, 100)],
    });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(6, 140, 100), touch(7, 150, 100)],
    });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("cancela o swipe quando um segundo toque transforma o gesto em pinch", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [touch(8, 200, 100)] });
    fireEvent.touchMove(stage, {
      touches: [touch(8, 180, 100), touch(9, 220, 100)],
    });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(8, 140, 100), touch(9, 260, 100)],
    });

    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("só conclui o swipe com o mesmo toque e sem outro toque restante", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [touch(10, 200, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(11, 140, 100)],
    });
    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");

    fireEvent.touchStart(stage, { touches: [touch(12, 200, 100)] });
    fireEvent.touchEnd(stage, {
      touches: [touch(13, 220, 100)],
      changedTouches: [touch(12, 140, 100)],
    });
    expect(screen.getByRole("status")).toHaveTextContent("Página 1 de 3");
  });

  it("limpa o gesto ao receber touchcancel", () => {
    render(<PortfolioViewer pages={pages} />);

    const stage = screen.getByRole("group", { name: "Página atual do portfólio" });
    fireEvent.touchStart(stage, { touches: [touch(14, 200, 100)] });
    fireEvent.touchCancel(stage, { touches: [] });
    fireEvent.touchEnd(stage, {
      touches: [],
      changedTouches: [touch(14, 140, 100)],
    });

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

  it("associa o erro à página que falhou quando a lista muda", () => {
    const { rerender } = render(<PortfolioViewer pages={pages} />);

    fireEvent.error(screen.getByRole("img", { name: "Capa do portfólio" }));
    expect(screen.getByRole("alert")).toBeVisible();

    rerender(<PortfolioViewer pages={[pages[1], pages[0], pages[2]]} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Sumário do portfólio" })).toBeVisible();
  });

  it("normaliza a página atual somente quando a lista fica menor", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PortfolioViewer pages={pages} />);
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));

    rerender(<PortfolioViewer pages={pages.slice(0, 2)} />);

    expect(screen.getByRole("img", { name: "Sumário do portfólio" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Página 2 de 2");
  });

  it("pré-carrega no desktop somente a próxima variante exibida e sem repetir", async () => {
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    expect(matchMedia).toHaveBeenCalledWith(compactMediaQuery);
    expect(prefetchedImages).toHaveLength(1);
    expect(prefetchedImages[0]).not.toHaveProperty("srcset");
    expect(prefetchedImages[0]).not.toHaveProperty("sizes");
    expect(requestedSources).toEqual([pages[1].desktopSrc]);

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(requestedSources).toEqual([pages[1].desktopSrc, pages[2].desktopSrc]);

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(requestedSources).toEqual([pages[1].desktopSrc, pages[2].desktopSrc]);
  });

  it("pré-carrega no mobile somente a variante compacta da próxima página", async () => {
    compactViewport = true;
    const user = userEvent.setup();
    render(<PortfolioViewer pages={pages} />);

    expect(requestedSources).toEqual([pages[1].compactSrc]);
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(requestedSources).toEqual([pages[1].compactSrc, pages[2].compactSrc]);
  });

  it("não duplica o prefetch desktop ou mobile no StrictMode", () => {
    const desktop = render(
      <StrictMode>
        <PortfolioViewer pages={pages} />
      </StrictMode>,
    );

    expect(prefetchedImages).toHaveLength(1);
    expect(requestedSources).toEqual([pages[1].desktopSrc]);

    desktop.unmount();
    compactViewport = true;
    render(
      <StrictMode>
        <PortfolioViewer pages={pages} />
      </StrictMode>,
    );
    expect(prefetchedImages).toHaveLength(2);
    expect(requestedSources).toEqual([pages[1].desktopSrc, pages[1].compactSrc]);
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
