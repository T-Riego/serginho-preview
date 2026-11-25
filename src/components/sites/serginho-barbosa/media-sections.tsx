import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getAlbum } from "./media-pages";
import { VideoGrid } from "./video-grid";
import { assetRoot } from "./site-content";
import styles from "./media-sections.module.css";

const featuredAlbum = getAlbum("festival-gastronomico-2024", "17");
const galleryPhotoOrder = [3, 0, 2, 4, 6]; // Portrait first, then the four landscape photos.

const featuredVideos = [
  { id: "P8RNoTjF6Kc", title: 'Serginho Barbosa -"Show Cênico- Voz Companheira" - 20 anos.' },
  { id: "_Jou5h-7ndM", title: "CAMINHO" },
  { id: "dbpqoQoFrJE", title: 'JULIFEST 2022 - SHOW "CAMINHOS BRILHO NOVO", AO VIVO' },
  { id: "F5I2loKD-AE", title: 'DVD - SHOW "CAMINHOS BRILHO NOVO"' },
  { id: "EM-mMv1MDEk", title: "CIRCO DOS AMORES" },
  { id: "JsnJ4BEOISs", title: "AS ROSAS NÃO FALAM" },
];

export function VideosSection() {
  return (
    <section className={`sb-section sb-on-dark ${styles.videos}`} aria-labelledby="videos-heading">
      <div className="sb-container">
        <div className="sb-section-heading">
          <h2 className="sb-heading sb-heading-light" id="videos-heading">Vídeos</h2>
          <Link className="sb-button sb-button-outline" href="/videos">Ver todos <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <VideoGrid videos={featuredVideos} />
      </div>
    </section>
  );
}

export function GallerySection() {
  if (!featuredAlbum) return null;

  const { label, slug, id, photos } = featuredAlbum;
  const galleryUrl = `/galeria-de-fotos/${slug}/${id}`;
  const galleryPhotos = galleryPhotoOrder.flatMap((index) => photos[index] ?? []);

  return (
    <section className="sb-section" aria-labelledby="gallery-heading">
      <div className="sb-container">
        <div className="sb-section-heading sb-section-heading-accent">
          <h2 className="sb-heading" id="gallery-heading">Galeria de Fotos</h2>
          <Link className="sb-button sb-button-outline" href="/galeria-de-fotos">Ver galeria <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.galleryGrid}>
          {galleryPhotos.map(({ thumbnail }, index) => (
            <Link
              key={thumbnail}
              className={styles.photoTile}
              href={galleryUrl}
              aria-label={`Veja as fotos do ${label}, foto ${index + 1}`}
              style={{ backgroundImage: `url(${assetRoot}/${thumbnail})` }}
            >
              <span className={styles.photoAction}><ArrowUpRight size={20} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
