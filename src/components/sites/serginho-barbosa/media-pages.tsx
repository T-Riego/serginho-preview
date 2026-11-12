import { GalleryAlbum } from "./gallery-album";
import { BannerLinks, InnerBanner } from "./inner-banner";
import data from "./media-pages-data.json";
import styles from "./media-pages.module.css";
import { VideoGrid } from "./video-grid";

type Album = (typeof data.albums)[number];

const albumLinks = data.albums.map(({ label, slug, id }) => ({
  label,
  href: `/galeria-de-fotos/${slug}/${id}`,
}));

export function getAlbumParams() {
  return data.albums.map(({ slug, id }) => ({ slug, id }));
}

export function getAlbum(slug: string, id: string) {
  return data.albums.find((album) => album.slug === slug && album.id === id);
}

export function GalleryPage({ album, activeHref }: { album?: Album; activeHref?: string }) {
  const current = album ?? data.albums[0];

  return (
    <main>
      <InnerBanner title="Galeria de Fotos" page="galeria-de-fotos">
        <BannerLinks items={albumLinks} activeHref={activeHref} />
      </InnerBanner>
      <section className={styles.galleryContent} aria-label={current.label}>
        <div className="sb-container">
          <GalleryAlbum key={current.id} title={current.label} photos={current.photos} />
        </div>
      </section>
    </main>
  );
}

export function VideoPage() {
  return (
    <main>
      <InnerBanner title="Videos" page="videos" />
      <section className={styles.videoContent} aria-label="Biblioteca de vídeos">
        <div className="sb-container">
          <VideoGrid videos={data.videos} library />
        </div>
      </section>
    </main>
  );
}
