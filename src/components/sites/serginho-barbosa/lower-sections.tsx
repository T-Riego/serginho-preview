"use client";

import { ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, useState } from "react";
import { assetRoot, currentNavigation, navigation, officialSite, spotify, telephone, whatsapp } from "./site-content";
import { SiteInput, SiteTextarea } from "./site-fields";
import styles from "./lower-sections.module.css";

const youtube = "https://www.youtube.com/channel/UCgokYREGN6KlYcu2rk3NzcQ";

const questions = [
  {
    question: "Serginho Barbosa tem outras atuações no entretenimento além de cantar?",
    answer: (
      <p>Sim! Serginho se destaca também na produção cultural, como <strong>apresentador de programas de rádio</strong>. Ele também é <strong>ator, tendo vivência de atuação circense.</strong></p>
    ),
  },
  {
    question: "Como faço para adquirir a discografia do Serginho?",
    answer: (
      <>
        <p>Você pode conferir todos os projetos do Serginho nas mídias sociais: <a href={spotify} target="_blank" rel="noreferrer">Spotify</a> e <a href={youtube} target="_blank" rel="noreferrer">YouTube</a>.</p>
        <p>Mas se preferir, pode adquirir um pen drive com toda sua discografia. Basta chamar o Serginho no <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> e pedir por mais informações.</p>
      </>
    ),
  },
  {
    question: "Em quais regiões, ou cidades, posso contratar o Serginho Barbosa para meu evento?",
    answer: (
      <p>Serginho Barbosa está disponível para shows em <strong>todas as regiões de Minas Gerais</strong>, com destaque para as <strong>cidades de Itabirito, Contagem, Belo Horizonte, Ouro Preto e Mariana.</strong></p>
    ),
  },
  {
    question: "Quem é Serginho Barbosa e qual sua trajetória no mundo artístico?",
    answer: (
      <p>Serginho Barbosa é um <strong>cantor, ator e compositor nascido em Itabirito-MG.</strong> Ele se envolveu com a música desde sua adolescência, começando em corais e posteriormente participando de Festivais da Canção. Ao longo dos anos, <strong>ele se destacou em diversas áreas da música, formando uma dupla com seu irmão, lançando CDs em carreira solo</strong> e sendo reconhecido por sua contribuição à música e cultura de Minas Gerais.</p>
    ),
  },
  {
    question: "Para quais tipos de eventos o show do Serginho Barbosa pode ser contratado?",
    answer: (
      <p>Serginho é versátil! Contrate-o para <strong>eventos pré e Carnaval com seu show &quot;Carnaval é Aqui&quot;</strong>, apresentações em teatros e shows abertos para amantes da <strong>MPB e dança.</strong></p>
    ),
  },
  {
    question: "Como conhecer a discografia do Serginho?",
    answer: (
      <p>Serginho tem 8 projetos discográficos disponíveis no site oficial, canal de <a href={youtube} target="_blank" rel="noreferrer">YouTube</a> e no <a href={spotify} target="_blank" rel="noreferrer">Spotify</a>.</p>
    ),
  },
  {
    question: "Onde Serginho Barbosa promove suas músicas além de YouTube e Spotify?",
    answer: (
      <>
        <p>Suas músicas ganham destaque nas Rádios, especificamente na <a href="https://www.radiovozcompanheira.com.br/" target="_blank" rel="noreferrer">Web Radio Voz Companheira</a> e em programas de rádio apresentados pelo próprio cantor.</p>
        <p>Mas se quiser uma coletânea completa com a discografia do Serginho, você pode contatá-lo no <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> e fazer a compra de um pen drive com os arquivos em formato mp3.</p>
      </>
    ),
  },
  {
    question: "Quais tipos de música o Serginho Barbosa canta em seu show?",
    answer: (
      <p>Serginho se destaca na Música Popular Brasileira, música regional e <a href={spotify} target="_blank" rel="noreferrer">suas músicas autorais</a>, representativas da sua rica discografia.</p>
    ),
  },
  {
    question: "Como faço para contratar o show ao vivo do Serginho Barbosa?",
    answer: (
      <p>É simples. Basta visitar o site oficial de Serginho Barbosa, ou contatá-lo pelas mídias digitais ou através do <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>.</p>
    ),
  },
];

const socialLinks = [
  {
    title: "Facebook",
    href: "https://www.facebook.com/SerginhoBarbosaOficial/",
    icon: <path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.25.2 2.25.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/serginhobarbosa_vozcompanheira",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    title: "YouTube",
    href: youtube,
    icon: <path fill="currentColor" fillRule="evenodd" d="M22.4 6.1c-.25-.94-.99-1.68-1.93-1.93C18.77 3.7 12 3.7 12 3.7s-6.77 0-8.47.47A2.74 2.74 0 0 0 1.6 6.1C1.13 7.8 1.13 12 1.13 12s0 4.2.47 5.9c.25.94.99 1.68 1.93 1.93C5.23 20.3 12 20.3 12 20.3s6.77 0 8.47-.47a2.74 2.74 0 0 0 1.93-1.93c.47-1.7.47-5.9.47-5.9s0-4.2-.47-5.9ZM9.8 15.56V8.44l5.9 3.56-5.9 3.56Z" />,
  },
];

export function WhatsappIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.08-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35m-5.44 7.4h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.73.98 1-3.63-.24-.37a9.81 9.81 0 0 1-1.5-5.21c0-5.42 4.41-9.83 9.85-9.83 2.63 0 5.1 1.02 6.96 2.89a9.77 9.77 0 0 1 2.88 6.96c0 5.42-4.41 9.83-9.83 9.83m8.37-18.2A11.8 11.8 0 0 0 12.03.13C5.5.13.18 5.45.18 11.97c0 2.09.55 4.14 1.58 5.93L.08 24l6.27-1.64a11.82 11.82 0 0 0 5.67 1.45h.01c6.53 0 11.85-5.31 11.85-11.83 0-3.16-1.23-6.13-3.48-8.36" />
    </svg>
  );
}

export function SiteSocialLinks() {
  return (
    <div className={styles.socialLinks}>
      {socialLinks.map(({ title, href, icon }) => (
        <a aria-label={title} href={href} key={title} target="_blank" rel="noreferrer">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="23" height="23">{icon}</svg>
        </a>
      ))}
    </div>
  );
}

function BudgetForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className={styles.budget} aria-labelledby="budget-title">
      <div className={`sb-container ${styles.budgetLayout}`}>
        <div>
          <h2 className="sb-heading" id="budget-title">Orçamento Rápido</h2>
          <p className={styles.budgetIntro}>Conte um pouco sobre o seu evento para preparar o contato.</p>
          <Link className="sb-text-link" href="/contatos">Outras formas de contato</Link>
        </div>
        <form aria-labelledby="budget-title" className={styles.budgetForm} method="post" onSubmit={handleSubmit} onInput={() => setSubmitted(false)}>
          <div className={styles.budgetFields}>
            <div>
              <label htmlFor="budget-name">Nome*</label>
              <SiteInput id="budget-name" autoComplete="name" required />
            </div>
            <div>
              <label htmlFor="budget-email">E-mail*</label>
              <SiteInput id="budget-email" type="email" autoComplete="email" required />
            </div>
            <div>
              <label htmlFor="budget-phone">Telefone*</label>
              <SiteInput id="budget-phone" type="tel" autoComplete="tel" required />
            </div>
            <div>
              <label htmlFor="budget-subject">Assunto</label>
              <SiteInput id="budget-subject" />
            </div>
            <div className={styles.budgetMessage}>
              <label htmlFor="budget-details">Detalhes*</label>
              <SiteTextarea id="budget-details" required />
            </div>
          </div>
          <button className={`sb-button ${styles.budgetButton}`} type="submit">Enviar</button>
          {submitted && (
            <p className={styles.formStatus} role="status">
              Formulário validado nesta prévia. <Link href="/contatos">Acessar Contatos</Link> para preparar sua mensagem.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Newsletter({ footer = false }: { footer?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className={footer ? styles.footerNewsletter : styles.newsletterPanel}>
      <h2 className={styles.newsletterTitle}>Receba as novidades</h2>
      <form aria-label={footer ? "Cadastro de novidades no rodapé" : "Cadastro de novidades"} method="post" onSubmit={handleSubmit} onInput={() => setSubmitted(false)}>
        <div className={styles.newsletterFields}>
          <SiteInput aria-label="Nome" placeholder="Nome" autoComplete="name" required />
          <SiteInput aria-label="E-mail" placeholder="E-mail" type="email" autoComplete="email" required />
          <button className="sb-button" type="submit">Cadastre-se</button>
        </div>
        {submitted && (
          <p className={styles.formStatus} role="status">
            Cadastro validado nesta prévia. <a href={officialSite}>Acesse o site oficial</a> para se inscrever.
          </p>
        )}
      </form>
    </div>
  );
}

function FrequentlyAskedQuestions() {
  return (
    <section className={styles.faq} aria-labelledby="faq-title">
      <div className={`sb-container ${styles.faqLayout}`}>
        <h2 className="sb-heading" id="faq-title">Perguntas frequentes</h2>
        <div className={styles.questions}>
          {questions.map(({ question, answer }) => (
            <details className={styles.question} key={question}>
              <summary>
                {question}
                <ChevronDown aria-hidden="true" size={20} strokeWidth={3} />
              </summary>
              <div className={styles.answer}>{answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  return (
    <footer className={styles.footer}>
      <div className={`sb-container ${styles.footerColumns}`}>
        <div className={styles.footerIdentity}>
          <Link href="/" className={styles.footerArtist}>Serginho <em>Barbosa</em></Link>
          <div className={styles.socialBlock}>
            <h2 className="sr-only">Redes sociais</h2>
            <SiteSocialLinks />
          </div>
        </div>
        <nav className={styles.footerBlock} aria-label="Acesso rápido">
          <h2>Acesso Rápido</h2>
          {navigation.map(({ label, href }) => (
            <Link key={label} href={href} aria-current={currentNavigation(pathname, href)}>{label}</Link>
          ))}
        </nav>
        <div>
          <div className={styles.footerBlock}>
            <h2>Contatos</h2>
            <div className={styles.contactLinks}>
              <a href={telephone} aria-label="Ligar para Serginho Barbosa"><Phone aria-hidden="true" size={14} fill="currentColor" /> (31) 9.9378-9787</a>
              <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp de Serginho Barbosa"><WhatsappIcon /> (31) 9.9378-9787</a>
            </div>
          </div>
        </div>
        <Newsletter footer />
      </div>
      <div className={styles.copyright}>
        <div className="sb-container">
          <Image src={`${assetRoot}/riegosdev.svg`} alt="" width={107} height={18} unoptimized />
          <span>
            <span className={styles.copyrightOwner}>© 2026 · Serginho Barbosa</span>{" "}
            Desenvolvido por <a href="https://riegosdev.cloud" target="_blank" rel="noreferrer">RiegosDev</a> - Sites sob medida.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function LowerSections() {
  return (
    <>
      <BudgetForm />
      <section className={styles.newsletter}>
        <div className="sb-container"><Newsletter /></div>
      </section>
      <FrequentlyAskedQuestions />
    </>
  );
}
