"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./media-pages.module.css";
import { assetRoot } from "./site-content";

type Photo = {
  src: string;
  thumbnail: string;
  caption?: string;
  width: number;
  height: number;
};

export function GalleryAlbum({ title, photos }: { title: string; photos: readonly Photo[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const activeThumbnail = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const current = photos[selectedIndex];
  const hasMultiplePhotos = photos.length > 1;
  const canAdvance = selectedIndex < photos.length - 1;

  useEffect(() => {
    if (isOpen) activeThumbnail.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [isOpen, selectedIndex]);

  if (!current) return null;

  function move(offset: number) {
    setSelectedIndex((index) => Math.min(photos.length - 1, Math.max(0, index + offset)));
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={styles.photoGrid} role="group" aria-label={title}>
        {photos.map((photo, index) => (
          <button
            type="button"
            className={styles.photo}
            key={photo.src}
            aria-label={`Abrir foto ${index + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
            aria-haspopup="dialog"
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setSelectedIndex(index);
              setIsOpen(true);
            }}
          >
            <Image src={`${assetRoot}/${photo.thumbnail}`} alt="" fill sizes="(min-width: 992px) 22vw, 90vw" unoptimized />
            <span aria-hidden="true" className={styles.photoZoom} />
          </button>
        ))}
      </div>

      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup
          className={styles.lightbox}
          data-group={hasMultiplePhotos}
          finalFocus={trigger}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            }
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close className={styles.close} aria-label="Fechar foto">
            <X size={22} aria-hidden="true" />
          </Dialog.Close>
          <div
            className={styles.photoStage}
            onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (start === null) return;
              const delta = event.changedTouches[0].clientX - start;
              if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
            }}
          >
            <figure className={styles.figure}>
              <Image
                src={`${assetRoot}/${current.src}`}
                alt={current.caption || `Foto ${selectedIndex + 1}`}
                width={current.width}
                height={current.height}
                loading="eager"
                unoptimized
              />
              {current.caption && <figcaption>{current.caption}</figcaption>}
            </figure>
          </div>
          {hasMultiplePhotos && (
            <>
              <button type="button" className={styles.previous} disabled={selectedIndex === 0} onClick={() => move(-1)} aria-label="Foto anterior">
                <ChevronLeft size={32} aria-hidden="true" />
              </button>
              <button type="button" className={styles.next} disabled={!canAdvance} onClick={() => move(1)} aria-label="Próxima foto">
                <ChevronRight size={32} aria-hidden="true" />
              </button>
              <div className={styles.filmstrip} role="group" aria-label="Miniaturas do álbum">
                {photos.map((photo, index) => (
                  <button
                    type="button"
                    key={photo.src}
                    ref={selectedIndex === index ? activeThumbnail : undefined}
                    aria-pressed={selectedIndex === index}
                    aria-label={`Selecionar foto ${index + 1}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image src={`${assetRoot}/${photo.thumbnail}`} alt="" fill sizes="10vh" unoptimized />
                  </button>
                ))}
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
