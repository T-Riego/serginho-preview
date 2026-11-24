import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { discographyAlbums } from "@/components/sites/serginho-barbosa/discography-data";
import { DiscographyDetail } from "@/components/sites/serginho-barbosa/discography-pages";
import { createPageMetadata } from "@/lib/seo";

type AlbumPageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export const dynamicParams = false;

async function getAlbum(params: AlbumPageProps["params"]) {
  const { slug, id } = await params;
  const album = discographyAlbums.find((entry) => entry.slug === slug && entry.id === id);
  if (!album) notFound();
  return album;
}

export function generateStaticParams() {
  return discographyAlbums.map(({ slug, id }) => ({ slug, id }));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const album = await getAlbum(params);
  return createPageMetadata({
    title: album.title,
    description: `Conheça ${album.title} na discografia de Serginho Barbosa.`,
    path: album.href,
  });
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  return <DiscographyDetail album={await getAlbum(params)} />;
}
