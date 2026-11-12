import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryPage, getAlbum, getAlbumParams } from "@/components/sites/serginho-barbosa/media-pages";

type Props = { params: Promise<{ slug: string; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAlbumParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  return { title: getAlbum(slug, id)?.label ?? "Galeria de Fotos" };
}

export default async function Page({ params }: Props) {
  const { slug, id } = await params;
  const album = getAlbum(slug, id);
  if (!album) notFound();

  return <GalleryPage album={album} activeHref={`/galeria-de-fotos/${slug}/${id}`} />;
}
