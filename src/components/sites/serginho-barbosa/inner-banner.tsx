import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { assetRoot, navigation } from "./site-content";

export { BannerLinks } from "./inner-banner-links";

const bannerImages = {
  biografia: "biografia.png",
  carnaval: "carnaval.png",
  discografias: "discografias.png",
  videos: "videos.png",
  "galeria-de-fotos": "galeria-de-fotos.png",
  contatos: "contatos.png",
};

export function InnerBanner({ title, page, children }: {
  title: string;
  page: keyof typeof bannerImages;
  children?: ReactNode;
}) {
  const parent = navigation.find(({ href }) => href === `/${page}`);
  return (
    <div className="sb-inner-banner" style={{ backgroundImage: `linear-gradient(90deg, #21121d 10%, #21121df0 30%, #21121da0 70%, #21121d55), url("${assetRoot}/banners/${bannerImages[page]}")` }}>
      <div className="sb-container">
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
