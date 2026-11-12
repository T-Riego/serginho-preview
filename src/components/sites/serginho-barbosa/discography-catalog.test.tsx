import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DiscographyCatalog } from "./discography-catalog";

const albums = [
  { title: "Uma História de Amor", href: "/discografias/uma-historia-de-amor/5", cover: "/historia.webp" },
  { title: "Brilho Novo", href: "/discografias/brilho-novo/11", cover: "/brilho.webp" },
];

const navigation = vi.hoisted(() => ({ search: "" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

describe("busca na discografia", () => {
  it("busca sem distinguir acentos e mantém o link local do álbum", () => {
    navigation.search = "search=++HISTORIA++";
    render(<DiscographyCatalog albums={albums} path="/discografias" />);

    expect(screen.getByRole("search")).toHaveAttribute("action", "/discografias");
    expect(screen.getByRole("textbox", { name: "Buscar álbum" })).toHaveValue("HISTORIA");
    expect(screen.getByRole("link", { name: /Uma História de Amor/ })).toHaveAttribute(
      "href",
      "/discografias/uma-historia-de-amor/5",
    );
    expect(screen.queryByRole("link", { name: /Brilho Novo/ })).not.toBeInTheDocument();
  });

  it("oferece limpar a busca na categoria atual quando não encontra álbuns", () => {
    const path = "/discografias/boleros/5/c";
    navigation.search = "search=desconhecido";
    render(<DiscographyCatalog albums={albums} path={path} />);

    expect(screen.getByRole("status")).toHaveTextContent("Nenhum álbum encontrado");
    expect(screen.getByRole("link", { name: "Limpar busca" })).toHaveAttribute("href", path);
  });
});
