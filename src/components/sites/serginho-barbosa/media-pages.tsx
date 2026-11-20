import { GalleryAlbum } from "./gallery-album";
import { BannerLinks, InnerBanner } from "./inner-banner";
import data from "./media-pages-data.json";
import styles from "./media-pages.module.css";
import { assetRoot } from "./site-content";
import { VideoGrid } from "./video-grid";

type BannerRecord = {
  src: string;
  position?: string;
  mobilePosition?: string;
};

type PhotoRecord = {
  src: string;
  thumbnail: string;
  caption?: string;
  width: number;
  height: number;
};

type Album = {
  label: string;
  slug: string;
  id: string;
  banner?: BannerRecord;
  photos: PhotoRecord[];
};

const albums = data.albums as Album[];

const albumLinks = albums.map(({ label, slug, id }) => ({
  label,
  href: `/galeria-de-fotos/${slug}/${id}`,
}));

export function getAlbumParams() {
  return albums.map(({ slug, id }) => ({ slug, id }));
}

export function getAlbum(slug: string, id: string) {
  return albums.find((album) => album.slug === slug && album.id === id);
}

function albumBanner(album: Album) {
  if (album.banner) {
    return {
      src: assetRoot + "/" + album.banner.src,
      alt: "Foto de destaque do álbum " + album.label,
      position: album.banner.position ?? "center",
      mobilePosition: album.banner.mobilePosition,
    };
  }

  const photo = album.photos.find(({ width, height }) => width >= height) ?? album.photos[0];
  if (!photo) return undefined;
  return {
    src: assetRoot + "/" + photo.src,
    alt: photo.caption || "Foto do álbum " + album.label,
    position: "center 35%",
  };
}

export function GalleryPage({ album, activeHref }: { album?: Album; activeHref?: string }) {
  const current = album ?? albums[0];
  const bannerMedia = album ? albumBanner(album) : undefined;

  return (
    <main>
      <InnerBanner
        title={album?.label ?? "Galeria de Fotos"}
        page="galeria-de-fotos"
        media={bannerMedia}
      >
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
      <InnerBanner title="Vídeos" page="videos" />
      <section className={styles.videoContent} aria-label="Biblioteca de vídeos">
        <div className="sb-container">
          <VideoGrid videos={data.videos} library />
        </div>
      </section>
    </main>
  );
}
