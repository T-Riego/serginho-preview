import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AlbumCard } from "./album-card";
import { albums, assetRoot, spotify, telephone, whatsapp } from "./site-content";

export function Discographies() {
  return (
    <section className="sb-section sb-discographies" aria-labelledby="discografias">
      <div className="sb-container">
        <div className="sb-section-heading sb-section-heading-accent">
          <h2 className="sb-heading" id="discografias">Discografias</h2>
          <Link href="/discografias" className="sb-button sb-button-outline">Ver todos <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="sb-albums">
          {albums.map(({ image, title, path }) => (
            <AlbumCard key={path} href={`/discografias/${path}`} title={title} cover={`${assetRoot}/${image}`} />
          ))}
        </div>
        <div className="sb-actions sb-album-actions">
          <a href={spotify} className="sb-text-link" target="_blank" rel="noreferrer">Ouça no Spotify <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

const stories = {
  biografia: {
    title: "Biografia",
    body: "Serginho Barbosa nasceu em Itabirito (MG) e, desde 1993, reside em Contagem (MG). A música entrou na sua vida ainda na infância, quando atuou no coral Canarinhos de Itabirito. A partir de 1982, participou de vários festivais da canção, com prêmios em várias categorias, incluindo dois primeiros lugares.",
    photo: "biografia-retrato.webp",
    alt: "Serginho Barbosa cantando em um palco iluminado de azul",
    music: "https://spotify.link/dgOjpcY9sDb",
  },
  carnaval: {
    title: "Carnaval",
    body: "Selecionado na Mostra de Música de Itabirito em 2006, o show Carnaval é Aqui reúne a música carnavalesca local e sucessos do carnaval brasileiro. Desde 2007, o projeto passou por várias cidades.",
    photo: "carnaval-circo.webp",
    alt: "Serginho Barbosa se apresentando no carnaval de chapéu vermelho",
  },
};

export function ArtistStory({ story }: { story: keyof typeof stories }) {
  const content = stories[story];

  return (
    <section className={`sb-section sb-story sb-story-${story}`} aria-labelledby={story}>
      <div className="sb-container sb-story-layout">
        <div className="sb-story-photo">
          <Image src={`${assetRoot}/editorial/${content.photo}`} alt={content.alt} fill sizes="(max-width: 720px) 92vw, 50vw" />
        </div>
        <div className="sb-story-inner">
          <h2 className="sb-heading" id={story}>{content.title}</h2>
          <p>{content.body}</p>
          <div className="sb-actions sb-story-actions">
            <Link href={`/${story}`} className="sb-button">Leia mais <ArrowRight size={17} aria-hidden="true" /></Link>
            {"music" in content && (
              <a href={content.music} className="sb-text-link" target="_blank" rel="noreferrer">Ouça no Spotify <ArrowUpRight size={17} aria-hidden="true" /></a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FloatingContacts() {
  return (
    <aside className="sb-float" aria-label="Contato rápido">
      <a className="sb-float-phone" href={telephone} aria-label="Ligar para Serginho Barbosa">
        <Phone size={18} fill="currentColor" />
      </a>
      <a className="sb-float-whatsapp" href={whatsapp} aria-label="WhatsApp" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2a9.9 9.9 0 0 0-8.54 14.9L2 22l5.25-1.38A9.94 9.94 0 1 0 12.04 2Zm0 18.22a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.27 8.27 0 1 1 6.97 3.85Zm4.54-6.19c-.25-.12-1.47-.72-1.7-.8-.22-.08-.38-.12-.55.13-.16.25-.63.8-.78.96-.14.16-.29.18-.53.06-.25-.13-1.04-.39-1.97-1.23-.73-.65-1.22-1.45-1.37-1.7-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.43h-.47c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.16 1.75 2.66 4.24 3.73.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.48-.07 1.48-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z" />
        </svg>
        <span>WhatsApp</span>
      </a>
    </aside>
  );
}
