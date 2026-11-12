import Image from "next/image";
import { DiscographyZoomCover } from "./discography-zoom-cover";
import { DiscographyCatalog } from "./discography-catalog";
import { discographyContent } from "./discography-content";
import { discographyAlbums, type DiscographyAlbum } from "./discography-data";
import { BannerLinks, InnerBanner } from "./inner-banner";
import { navigation } from "./site-content";
import styles from "./discography.module.css";

export const discographyRoot = "/discografias";

export const discographyCategories = (navigation.find(({ label }) => label === "Discografias")?.children ?? [])
  .map(([label, path]) => {
    const [slug, id] = path.split("/");
    return { label, href: `${discographyRoot}/${path}`, slug, id };
  });

export type DiscographySearchParams = Promise<{ search?: string | string[] }>;

export async function readDiscographySearch(params: DiscographySearchParams) {
  const { search } = await params;
  return Array.isArray(search) ? search[0] : search;
}

export function DiscographyListing({
  category,
  search,
}: {
  category?: (typeof discographyCategories)[number];
  search?: string;
}) {
  const albums = category
    ? discographyAlbums
      .filter(({ categoryId }) => categoryId === category.id)
      .sort((first, second) => first.title.localeCompare(second.title, "pt-BR"))
    : discographyAlbums;
  const path = category?.href ?? discographyRoot;

  return (
    <main>
      <InnerBanner title={category?.label ?? "Discografias"} page="discografias">
        <BannerLinks items={discographyCategories} activeHref={category?.href} />
      </InnerBanner>
      <DiscographyCatalog albums={albums} path={path} search={search} />
    </main>
  );
}

export function DiscographyDetail({ album }: { album: DiscographyAlbum }) {
  return (
    <main>
      <InnerBanner title={album.title} page="discografias" />
      <div className={styles.detail}>
        <article className={`sb-container ${styles.detailLayout}`}>
          {album.slug === "brilho-novo" ? <DiscographyZoomCover album={album} /> : (
            <figure className={styles.detailCover}>
              <Image
                src={album.detailCover}
                alt={`Capa de ${album.title}`}
                width={album.detailWidth}
                height={album.detailHeight}
                unoptimized
              />
            </figure>
          )}
          <div className={styles.detailCopy}>{discographyContent[album.slug]}</div>
        </article>
      </div>
    </main>
  );
}
