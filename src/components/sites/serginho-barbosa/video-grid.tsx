"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import styles from "./media-sections.module.css";

type Video = {
  id: string;
  title: string;
};

export function VideoGrid({ videos, library = false }: { videos: readonly Video[]; library?: boolean }) {
  return (
    <div className={library ? `${styles.videoGrid} ${styles.videoLibrary}` : styles.videoGrid}>
      {videos.map(({ id, title }) => (
        <Dialog.Root key={id}>
          <Dialog.Trigger
            className={styles.videoTile}
            aria-label={`Assistir vídeo: ${title}`}
            style={{ backgroundImage: `url(/sites/serginho-barbosa/videos/${id}.jpg)` }}
          >
            <span className={styles.play} aria-hidden="true" />
            <span className={styles.videoCaption}>
              <span className={styles.videoTitle}>{title}</span>
              <span className={styles.tileAction}>Assistir vídeo</span>
            </span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.backdrop} />
            <Dialog.Popup className={styles.lightbox}>
              <Dialog.Title className="sr-only">{title}</Dialog.Title>
              <Dialog.Close className={styles.close} aria-label="Fechar vídeo">
                <X size={22} aria-hidden="true" />
              </Dialog.Close>
              <iframe
                src={`https://www.youtube.com/embed/${id}${library ? "?autoplay=1" : ""}`}
                title={title}
                referrerPolicy="origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <a
                className={styles.youtubeLink}
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                rel="noreferrer"
              >
                Assistir no YouTube
              </a>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
}
