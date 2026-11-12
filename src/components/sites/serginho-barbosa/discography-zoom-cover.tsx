"use client";

import Image from "next/image";
import type { DiscographyAlbum } from "./discography-data";
import styles from "./discography.module.css";

export function DiscographyZoomCover({ album }: { album: DiscographyAlbum }) {
  return (
    <figure
      className={`${styles.detailCover} ${styles.zoomCover}`}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const cover = event.currentTarget;
        const bounds = cover.getBoundingClientRect();
        cover.style.setProperty("--zoom-x", `${(event.clientX - bounds.left) / bounds.width * 100}%`);
        cover.style.setProperty("--zoom-y", `${(event.clientY - bounds.top) / bounds.height * 100}%`);
      }}
    >
      <Image
        src={album.detailCover}
        alt={`Capa de ${album.title}`}
        width={album.detailWidth}
        height={album.detailHeight}
        unoptimized
      />
      <div className={styles.zoomLens} aria-hidden="true" />
      <div className={styles.zoomWindow} style={{ backgroundImage: `url(${album.cover})` }} aria-hidden="true" />
    </figure>
  );
}
