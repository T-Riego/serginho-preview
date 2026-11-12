import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HeroCarousel } from "./hero-carousel";
import { SiteHeader } from "./home-controls";

const routing = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => routing.pathname }));

describe("navegação da página inicial", () => {
  it("abre o menu móvel, oferece links locais e devolve o foco ao fechar", async () => {
    routing.pathname = "/";
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(trigger);
    const menu = screen.getByRole("dialog", { name: "Menu principal" });

    expect(within(menu).getByRole("link", { name: "Biografia" })).toHaveAttribute(
      "href",
      "/biografia",
    );
    await user.click(within(menu).getByRole("button", { name: "Submenu de Discografias" }));
    expect(within(menu).getByRole("link", { name: "Brilho Novo" })).toHaveAttribute("href", "/discografias/brilho-novo/10/c");

    await user.keyboard("{Escape}");
    expect(menu).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("marca a seção e a página abertas no menu desktop", () => {
    routing.pathname = "/galeria-de-fotos/julifest-2018/8";
    render(<SiteHeader />);

    const nav = within(screen.getByRole("navigation", { name: "Navegação principal" }));
    expect(nav.getByRole("link", { name: "Galeria de Fotos" })).toHaveAttribute("aria-current", "location");
    expect(nav.getByRole("link", { name: "Julifest 2018" })).toHaveAttribute("aria-current", "page");
    expect(nav.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });
});

describe("carrossel de destaques", () => {
  it("avança com o cursor sobre a foto, mas pausa sobre um link ou pelo controle", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(private readonly callback: IntersectionObserverCallback) {}

      observe() {
        this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }

      disconnect() {}
    });

    const { unmount } = render(<HeroCarousel />);
    try {
      fireEvent.pointerOver(screen.getByRole("button", { name: "Pausar destaques pela foto" }), { pointerType: "mouse" });
      await act(() => vi.advanceTimersByTimeAsync(4000));
      expect(screen.getByRole("heading", { level: 2, name: "Brilho Novo" })).toBeVisible();
      expect(screen.getByRole("img", { name: "Capa do álbum Brilho Novo" })).toHaveAttribute("width", "1200");

      fireEvent.pointerOver(screen.getByRole("link", { name: "Conhecer o álbum" }), { pointerType: "mouse" });
      await act(() => vi.advanceTimersByTimeAsync(4000));
      expect(screen.getByRole("heading", { level: 2, name: "Brilho Novo" })).toBeVisible();
      fireEvent.pointerOver(screen.getByRole("button", { name: "Pausar destaques pela foto" }), { pointerType: "mouse" });

      fireEvent.click(screen.getByRole("button", { name: "Pausar destaques" }));
      await act(() => vi.advanceTimersByTimeAsync(4000));
      expect(screen.getByRole("heading", { level: 2, name: "Brilho Novo" })).toBeVisible();

      fireEvent.click(screen.getByRole("button", { name: "Reproduzir destaques" }));
      await act(() => vi.advanceTimersByTimeAsync(4000));
      expect(screen.getByRole("heading", { level: 2, name: "Serginho no YouTube" })).toBeVisible();
    } finally {
      unmount();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });

  it("pausa e retoma ao acionar a foto, usando o mesmo estado da barra", async () => {
    const user = userEvent.setup();
    render(<HeroCarousel />);

    await user.click(screen.getByRole("button", { name: "Pausar destaques pela foto" }));
    expect(screen.getByRole("button", { name: "Reproduzir destaques" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Reproduzir destaques pela foto" }));
    expect(screen.getByRole("button", { name: "Pausar destaques" })).toBeVisible();
  });

  it("avança com um gesto lateral e retoma só com um novo toque", () => {
    render(<HeroCarousel />);
    const photo = screen.getByRole("button", { name: "Pausar destaques pela foto" });
    fireEvent.touchStart(photo, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(photo, { changedTouches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.click(photo, { detail: 1 });

    expect(screen.getByRole("button", { name: "Mostrar Brilho Novo" })).toHaveAttribute("aria-current", "true");
    expect(photo).toHaveAccessibleName("Reproduzir destaques pela foto");

    fireEvent.touchStart(photo, { touches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.touchEnd(photo, { changedTouches: [{ clientX: 120, clientY: 100 }] });
    fireEvent.click(photo, { detail: 1 });
    expect(photo).toHaveAccessibleName("Pausar destaques pela foto");
  });

  it("navega pelas setas e indicadores e volta ao início ao avançar do último", async () => {
    const user = userEvent.setup();
    render(<HeroCarousel />);

    const first = screen.getByRole("button", { name: "Mostrar Serginho Barbosa" });
    expect(first).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("heading", { level: 1, name: "Serginho Barbosa" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Serginho Barbosa cantando no palco sob luz roxa" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Destaque anterior" }));
    expect(screen.getByRole("button", { name: "Mostrar Circo dos Amores" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Próximo destaque" }));
    expect(first).toHaveAttribute("aria-current", "true");

    await user.click(screen.getByRole("button", { name: "Mostrar Voz Companheira" }));
    expect(screen.getByRole("link", { name: "Ouvir a rádio" })).toHaveAttribute(
      "href",
      "https://www.radiovozcompanheira.com.br/",
    );
    expect(screen.getByRole("button", { name: "Reproduzir destaques" })).toBeVisible();
  });
});
