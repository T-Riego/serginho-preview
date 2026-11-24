import type { Metadata } from "next";
import { GalleryPage } from "@/components/sites/serginho-barbosa/media-pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Galeria de Fotos",
  description:
    "Veja os álbuns de fotos de shows, carnavais, festivais, lançamentos e projetos artísticos de Serginho Barbosa.",
  path: "/galeria-de-fotos",
});

export default function Page() {
  return <GalleryPage />;
}
