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

export function DiscographyListing({
  category,
}: {
  category?: (typeof discographyCategories)[number];
}) {
  const albums = category
    ? discographyAlbums
      .filter(({ categoryId }) => categoryId === category.id)
      .sort((first, second) => first.title.localeCompare(second.title, "pt-BR"))
    : discographyAlbums;
  const path = category?.href ?? discographyRoot;
  const featured = category ? albums[0] : undefined;

  return (
    <main>
      <InnerBanner
        title={category?.label ?? "Discografias"}
        page="discografias"
        media={featured && { src: featured.cover, alt: `Capa de ${featured.title}`, fit: "contain" }}
      >
        <BannerLinks items={discographyCategories} activeHref={category?.href} />
      </InnerBanner>
      <DiscographyCatalog albums={albums} path={path} />
    </main>
  );
}

export function DiscographyDetail({ album }: { album: DiscographyAlbum }) {
  return (
    <main>
      <InnerBanner title={album.title} page="discografias" media={{ src: album.cover, alt: `Capa de ${album.title}`, fit: "contain" }} />
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
