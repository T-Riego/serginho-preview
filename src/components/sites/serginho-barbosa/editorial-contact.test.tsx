import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContactForm } from "./editorial-contact";

describe("formulário da página de contatos", () => {
  it("valida os campos e prepara uma mensagem para o e-mail oficial", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submit = screen.getByRole("button", { name: "Enviar" });
    await user.click(submit);
    expect(screen.queryByRole("status")).toBeNull();

    await user.type(screen.getByLabelText("Nome*"), "Visitante");
    await user.type(screen.getByLabelText("E-mail*"), "visitante@example.com");
    await user.type(screen.getByLabelText("Telefone*"), "31993789787");
    expect(screen.getByLabelText("Telefone*")).toHaveValue("(31) 99378-9787");
    await user.type(screen.getByLabelText("Assunto*"), "Show em Minas");
    await user.type(screen.getByLabelText("Mensagem*"), "Gostaria de saber sobre o show.");
    await user.click(submit);

    expect(screen.getByRole("status")).toHaveTextContent("Mensagem pronta");
    const draft = screen.getByRole("link", { name: "Abrir no aplicativo de e-mail" }).getAttribute("href");
    expect(draft).toMatch(/^mailto:contato@serginhobarbosa\.com\.br\?/);
    expect(decodeURIComponent(draft ?? "")).toContain("Gostaria de saber sobre o show.");
  });
});
