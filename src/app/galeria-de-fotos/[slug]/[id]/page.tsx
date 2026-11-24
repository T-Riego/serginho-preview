import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryPage, getAlbum, getAlbumParams } from "@/components/sites/serginho-barbosa/media-pages";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAlbumParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const album = getAlbum(slug, id);
  const title = album?.label ?? "Galeria de Fotos";
  return createPageMetadata({
    title,
    description: `Veja as fotos de ${title} na galeria de Serginho Barbosa.`,
    path: `/galeria-de-fotos/${slug}/${id}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug, id } = await params;
  const album = getAlbum(slug, id);
  if (!album) notFound();

  return <GalleryPage album={album} activeHref={`/galeria-de-fotos/${slug}/${id}`} />;
}
