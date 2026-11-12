import type { ReactNode } from "react";
import { assetRoot } from "./site-content";

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
  return (
    <div className="sb-inner-banner" style={{ backgroundImage: `linear-gradient(#00000080, #00000080), url("${assetRoot}/banners/${bannerImages[page]}")` }}>
      <div className="sb-container">
        <h1 className="sb-heading sb-inner-title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
