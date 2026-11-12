"use client";

import { useState, type FormEvent } from "react";
import { contactEmail } from "./site-content";
import styles from "./editorial.module.css";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;

  const area = digits.slice(0, 2);
  const number = digits.slice(2);
  const prefixLength = number.length === 9 ? 5 : 4;
  const prefix = number.slice(0, prefixLength);
  const suffix = number.slice(prefixLength);

  return `(${area}) ${prefix}${suffix ? `-${suffix}` : ""}`;
}

export function ContactForm() {
  const [phone, setPhone] = useState("");
  const [draft, setDraft] = useState<string | null>(null);

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const subject = String(fields.get("subject")).trim();
    const body = [
      String(fields.get("message")).trim(),
      "",
      `Nome: ${String(fields.get("name")).trim()}`,
      `E-mail: ${String(fields.get("email")).trim()}`,
      `Telefone: ${String(fields.get("phone")).trim()}`,
    ].join("\r\n");

    setDraft(`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  return (
    <form
      aria-label="Formulário de contato"
      className={styles.contactForm}
      method="post"
      onSubmit={prepareMessage}
      onInput={() => setDraft(null)}
    >
      <div className={styles.contactFields}>
        <div>
          <label htmlFor="contact-name">Nome*</label>
          <input id="contact-name" name="name" autoComplete="name" maxLength={256} required />
        </div>
        <div>
          <label htmlFor="contact-email">E-mail*</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={256} required />
        </div>
        <div>
          <label htmlFor="contact-phone">Telefone*</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            pattern={String.raw`\(\d{2}\) \d{4,5}-\d{4}`}
            value={phone}
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-subject">Assunto*</label>
          <input id="contact-subject" name="subject" maxLength={256} required />
        </div>
        <div className={styles.contactMessage}>
          <label htmlFor="contact-message">Mensagem*</label>
          <textarea id="contact-message" name="message" required />
        </div>
      </div>
      <button type="submit" className={`sb-button ${styles.contactSubmit}`}>Enviar</button>
      {draft && (
        <p className={styles.contactStatus} role="status">
          Mensagem pronta. <a href={draft}>Abrir no aplicativo de e-mail</a> para concluir o envio.
        </p>
      )}
    </form>
  );
}
