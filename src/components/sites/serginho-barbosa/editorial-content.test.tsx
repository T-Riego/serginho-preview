import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BiographyContent } from "./editorial-content";
import styles from "./editorial.module.css";

describe("conteúdo da biografia", () => {
  it("apresenta o release atualizado e remove informações obsoletas", () => {
    const { container } = render(<BiographyContent />);

    expect(container).toHaveTextContent("Apresentador de Programa de Rádio");
    expect(container).toHaveTextContent("Programa Habilidades");
    expect(container).toHaveTextContent("divulgando e fazendo shows");
    expect(container).toHaveTextContent("cantor Richard Saooco");
    expect(container).toHaveTextContent(/2025.*Por um Bolero.*Richard Saooco/);
    expect(container).toHaveTextContent(/2025.*Festa Yuan - Cuba/);
    expect(container).toHaveTextContent(/2026.*Show Cênico.*Voz Companheira 20 anos/);
    expect(container).toHaveTextContent(/2026.*Lea Câmarom Argentina/);

    const timeline = container.textContent ?? "";
    expect(timeline.indexOf("2025 - Festa Yuan - Cuba.")).toBeLessThan(
      timeline.indexOf("2026 - Lançamento"),
    );
    expect(timeline.indexOf("2026 - Lançamento")).toBeLessThan(
      timeline.indexOf("2026 - Lea Câmarom Argentina."),
    );
    expect(container).not.toHaveTextContent("TALENTO ITABIRITENSE");
    expect(container).not.toHaveTextContent("Medalha de Honra ao Mérito");
    expect(container).not.toHaveTextContent("Web Rádio");
  });

  it("preserva a estrutura, as quatro fotos e os contatos", () => {
    const { container } = render(<BiographyContent />);

    const section = container.querySelector("section.sb-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(styles.biography);
    expect(section?.querySelector("article.sb-container")).toBeInTheDocument();

    const expectedImages = [
      ["Serginho Barbosa cantando no palco", "biografia-show.webp"],
      ["Serginho Barbosa no Carnaval", "biografia-carnaval.webp"],
      ["Retrato de Serginho Barbosa", "biografia-retrato.webp"],
      ["Serginho Barbosa em apresentação musical", "biografia-evento.webp"],
    ] as const;

    expect(screen.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual(
      expectedImages.map(([, file]) => expect.stringContaining(file)),
    );

    for (const [name, file] of expectedImages) {
      expect(screen.getByRole("img", { name })).toHaveAttribute("src", expect.stringContaining(file));
    }

    expect(screen.getByRole("link", { name: "barbosavozcompanheira@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:barbosavozcompanheira@gmail.com",
    );
    expect(container).toHaveTextContent("(31) 99378 9787");
  });
});
