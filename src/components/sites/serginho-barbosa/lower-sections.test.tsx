import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LowerSections, SiteFooter } from "./lower-sections";

describe("seções de contato", () => {
  it("exibe o crédito de desenvolvimento com o link no nome", () => {
    render(<SiteFooter />);
    const credit = screen.getByRole("link", { name: "RiegosDev" });
    expect(credit).toHaveAttribute("href", "https://riegosdev.cloud");
    expect(credit.parentElement).toHaveTextContent("Desenvolvido por RiegosDev - Sites sob medida.");
  });

  it("expande e recolhe cada resposta de forma independente", async () => {
    const user = userEvent.setup();
    render(<LowerSections />);

    const question = screen.getByText("Como conhecer a discografia do Serginho?");
    const answer = screen.getByText(/Serginho tem 8 projetos discográficos/);

    expect(answer).not.toBeVisible();
    await user.click(question);
    expect(answer).toBeVisible();
    await user.click(screen.getByText("Como faço para adquirir a discografia do Serginho?"));
    const secondAnswer = screen.getByText(/Você pode conferir todos os projetos/);
    expect(secondAnswer).toBeVisible();
    expect(answer).toBeVisible();
    await user.click(question);
    expect(answer).not.toBeVisible();
    expect(secondAnswer).toBeVisible();
  });

  it("valida o orçamento e encaminha à página local de contatos", async () => {
    const user = userEvent.setup();
    render(<LowerSections />);

    const form = within(screen.getByRole("form", { name: "Orçamento Rápido" }));
    const submit = form.getByRole("button", { name: "Enviar" });

    await user.click(submit);
    expect(form.queryByText(/formulário validado/i)).toBeNull();

    await user.type(form.getByLabelText("Nome*"), "Maria");
    await user.type(form.getByLabelText("E-mail*"), "maria@example.com");
    await user.type(form.getByLabelText("Telefone*"), "(31) 99999-9999");
    await user.type(form.getByLabelText("Detalhes*"), "Show em Itabirito");
    await user.click(submit);

    expect(form.getByRole("status")).toHaveTextContent(/formulário validado/i);
    expect(form.getByRole("link", { name: "Acessar Contatos" })).toHaveAttribute(
      "href",
      "/contatos",
    );
  });

  it("mostra a confirmação local somente no formulário de newsletter preenchido", async () => {
    const user = userEvent.setup();
    render(<><LowerSections /><SiteFooter /></>);

    const main = within(screen.getByRole("form", { name: "Cadastro de novidades" }));
    const footer = within(screen.getByRole("form", { name: "Cadastro de novidades no rodapé" }));

    await user.type(footer.getByRole("textbox", { name: "Nome" }), "Maria");
    await user.type(footer.getByRole("textbox", { name: "E-mail" }), "maria@example.com");
    await user.click(footer.getByRole("button", { name: "Cadastre-se" }));

    expect(footer.getByRole("status")).toHaveTextContent(/cadastro validado/i);
    expect(main.queryByText(/cadastro validado/i)).toBeNull();
  });
});
