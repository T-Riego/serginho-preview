import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/sites/serginho-barbosa/editorial-contact";
import styles from "@/components/sites/serginho-barbosa/editorial.module.css";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";
import { SiteSocialLinks, WhatsappIcon } from "@/components/sites/serginho-barbosa/lower-sections";
import { contactEmail, telephone, whatsapp } from "@/components/sites/serginho-barbosa/site-content";

export const metadata: Metadata = { title: "Contatos" };

export default function ContactsPage() {
  return (
    <main>
      <InnerBanner title="Contatos" page="contatos" />
      <section className="sb-section">
        <div className={`sb-container ${styles.contactLayout}`}>
          <div>
            <h2 className={styles.contactTitle}>Preencha os campos abaixo e envie sua mensagem:</h2>
            <ContactForm />
          </div>
          <aside className={styles.contactSidebar}>
            <h2>Contatos</h2>
            <a className={styles.contactLink} href={telephone} aria-label="Ligar para Serginho Barbosa">
              <Phone size={14} fill="currentColor" aria-hidden="true" /> (31) 99378-9787
            </a>
            <a className={styles.contactLink} href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp de Serginho Barbosa">
              <WhatsappIcon /> (31) 99378-9787
            </a>
            <a className={styles.contactLink} href={`mailto:${contactEmail}`}>
              <Mail size={16} aria-hidden="true" /> {contactEmail}
            </a>
            <div className={styles.contactSocial}>
              <h2>Redes Sociais</h2>
              <SiteSocialLinks />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
