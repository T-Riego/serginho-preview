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
    expect(container).toHaveTextContent(/2025.*No Necesito.*Juan Yole.*Cuba/);
    expect(container).toHaveTextContent(/2026.*Show Cênico.*Voz Companheira 20 anos/);
    expect(container).toHaveTextContent(/2026.*Caminos.*Lèa Camarón.*Argentina/);
    expect(container).toHaveTextContent(/2024.*Baile Brilho Novo - Maio 2024/);

    const timeline = container.textContent ?? "";
    expect(timeline.indexOf("2024 - Baile Brilho Novo - Maio 2024")).toBeLessThan(
      timeline.indexOf("2025 - Show Cênico - Voz Companheira 20 anos"),
    );
    expect(timeline.indexOf('2025 - Lançamento do single "No Necesito"')).toBeLessThan(
      timeline.indexOf('2026 - Lançamento do single "Caminos"'),
    );
    expect(timeline.indexOf('2026 - Lançamento do single "Caminos"')).toBeLessThan(
      timeline.indexOf('2026 - Lançamento de "Show Cênico'),
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
