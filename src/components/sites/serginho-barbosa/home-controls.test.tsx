import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HeroCarousel, SiteHeader } from "./home-controls";

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
  it("navega pelas setas e indicadores e volta ao início ao avançar do último", async () => {
    const user = userEvent.setup();
    render(<HeroCarousel />);

    const first = screen.getByRole("button", { name: "Mostrar Brilho Novo" });
    expect(first).toHaveAttribute("aria-current", "true");

    await user.click(screen.getByRole("button", { name: "Destaque anterior" }));
    expect(screen.getByRole("button", { name: "Mostrar Circo dos Amores" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Próximo destaque" }));
    expect(first).toHaveAttribute("aria-current", "true");

    await user.click(screen.getByRole("button", { name: "Mostrar Voz Companheira" }));
    expect(screen.getByRole("link", { name: "Voz Companheira" })).toHaveAttribute(
      "href",
      "https://www.radiovozcompanheira.com.br/",
    );
  });
});
