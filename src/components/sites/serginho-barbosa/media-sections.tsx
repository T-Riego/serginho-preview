import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { VideoGrid } from "./video-grid";
import { assetRoot } from "./site-content";
import styles from "./media-sections.module.css";

const galleryUrl = "/galeria-de-fotos/julifest-2018/8";

const featuredVideos = [
  { id: "_Jou5h-7ndM", title: "CAMINHO" },
  { id: "dbpqoQoFrJE", title: 'JULIFEST 2022 - SHOW "CAMINHOS BRILHO NOVO", AO VIVO' },
  { id: "F5I2loKD-AE", title: 'DVD - SHOW "CAMINHOS BRILHO NOVO"' },
  { id: "EM-mMv1MDEk", title: "CIRCO DOS AMORES" },
  { id: "JsnJ4BEOISs", title: "AS ROSAS NÃO FALAM" },
];

const galleryPhotos = [
  "Julifest-2018-20190206225457.webp",
  "Julifest-2018-20190206225801.webp",
  "Julifest-2018-20190206225542.webp",
  "Julifest-2018-20190206225859.webp",
  "Julifest-2018-20190206225909.webp",
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
  return (
    <section className="sb-section" aria-labelledby="gallery-heading">
      <div className="sb-container">
        <div className="sb-section-heading sb-section-heading-accent">
          <h2 className="sb-heading" id="gallery-heading">Galeria de Fotos</h2>
          <Link className="sb-button sb-button-outline" href="/galeria-de-fotos">Ver galeria <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className={styles.galleryGrid}>
          {galleryPhotos.map((photo, index) => (
            <Link
              key={photo}
              className={styles.photoTile}
              href={galleryUrl}
              aria-label={`Veja as fotos do Julifest 2018, foto ${index + 1}`}
              style={{ backgroundImage: `url(${assetRoot}/gallery/${photo})` }}
            >
              <span className={styles.photoAction}><ArrowUpRight size={20} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
