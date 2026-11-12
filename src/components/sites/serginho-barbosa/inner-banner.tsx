import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { assetRoot, navigation } from "./site-content";

export { BannerLinks } from "./inner-banner-links";

type BannerMedia = {
  src: string;
  alt: string;
  position?: string;
  mobilePosition?: string;
  fit?: "contain";
};

const bannerImages = {
  biografia: {
    src: `${assetRoot}/editorial/biografia-retrato.webp`,
    alt: "Serginho Barbosa de terno branco em um palco iluminado de azul",
    position: "center 35%",
  },
  carnaval: {
    src: `${assetRoot}/editorial/biografia-carnaval.webp`,
    alt: "Serginho Barbosa caracterizado como Palhaço dos Amores, de braços abertos",
    position: "center 32%",
  },
  discografias: {
    src: `${assetRoot}/editorial/biografia-evento.webp`,
    alt: "Serginho Barbosa e banda em um teatro iluminado de vermelho",
    position: "center 40%",
    mobilePosition: "center 54%",
  },
  videos: {
    src: `${assetRoot}/gallery/Julifest-2018-20190206225542.webp`,
    alt: "Serginho Barbosa cantando no Julifest",
    position: "center 34%",
  },
  "galeria-de-fotos": {
    src: `${assetRoot}/editorial/carnaval-banda.webp`,
    alt: "Serginho Barbosa de braços abertos sob luzes coloridas no Carnaval",
    position: "center 30%",
  },
  contatos: {
    src: `${assetRoot}/gallery/Julifest-2018-20190206225457.webp`,
    alt: "Serginho Barbosa sorrindo no Julifest",
    position: "center 17%",
    mobilePosition: "center 20%",
  },
} satisfies Record<string, BannerMedia>;

export function InnerBanner({ title, page, media, children }: {
  title: string;
  page: keyof typeof bannerImages;
  media?: BannerMedia;
  children?: ReactNode;
}) {
  const parent = navigation.find(({ href }) => href === `/${page}`);
  const image: BannerMedia = media ?? bannerImages[page];
  const style = {
    "--sb-banner-position": image.position ?? "center",
    "--sb-banner-position-mobile": image.mobilePosition ?? image.position ?? "center",
  } as CSSProperties;

  return (
    <div className="sb-inner-banner" data-fit={image.fit ?? "cover"}>
      <div className="sb-inner-banner-media" style={style}>
        <div className="sb-inner-banner-image">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading="eager"
            sizes={image.fit === "contain" ? "(max-width: 720px) 50vw, 340px" : "(max-width: 720px) 100vw, 62vw"}
          />
        </div>
      </div>
      <div className="sb-container sb-inner-banner-content">
        <nav className="sb-breadcrumbs" aria-label="Caminho da página">
          <ol>
            <li><Link href="/">Início</Link></li>
            {parent && parent.label !== title && (
              <li><ChevronRight size={14} aria-hidden="true" /><Link href={parent.href}>{parent.label}</Link></li>
            )}
            <li><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{title}</span></li>
          </ol>
        </nav>
        <h1 className="sb-heading sb-inner-title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
