"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioPageAsset } from "./portfolio-pages-data";
import styles from "./portfolio.module.css";

type TouchPoint = Readonly<{ x: number; y: number }>;

export function PortfolioViewer({ pages }: { pages: readonly PortfolioPageAsset[] }) {
  const [index, setIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const touchStart = useRef<TouchPoint | null>(null);
  const prefetchedPages = useRef(new Set<string>());
  const current = pages[index];

  useEffect(() => {
    const next = pages[index + 1];
    if (!next || prefetchedPages.current.has(next.desktopSrc)) return;

    prefetchedPages.current.add(next.desktopSrc);
    const image = new window.Image();
    image.srcset = `${next.compactSrc} 960w, ${next.desktopSrc} 1600w`;
    image.sizes = "(max-width: 720px) 100vw, 1600px";
    image.src = next.desktopSrc;
  }, [index, pages]);

  if (!current) return null;

  function showPage(nextIndex: number) {
    const boundedIndex = Math.min(pages.length - 1, Math.max(0, nextIndex));
    if (boundedIndex === index) return;
    setImageError(false);
    setIndex(boundedIndex);
  }

  return (
    <section className={styles.viewer} aria-label="Visualizador do portfólio">
      <div
        className={styles.stage}
        role="group"
        aria-label="Página atual do portfólio"
        tabIndex={0}
        data-error={imageError || undefined}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            showPage(index + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          const touch = event.changedTouches[0];
          touchStart.current = null;
          if (!start || !touch) return;

          const deltaX = touch.clientX - start.x;
          const deltaY = touch.clientY - start.y;
          if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
            showPage(index + (deltaX < 0 ? 1 : -1));
          }
        }}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
      >
        <picture key={current.desktopSrc} className={styles.picture}>
          <source media="(max-width: 720px)" srcSet={current.compactSrc} />
          <Image
            className={styles.image}
            src={current.desktopSrc}
            alt={current.alt}
            width={1600}
            height={900}
            sizes="(max-width: 720px) 100vw, 1600px"
            fetchPriority={index === 0 ? "high" : undefined}
            unoptimized
            onError={() => setImageError(true)}
          />
        </picture>
        {imageError && (
          <p className={styles.error} role="alert">
            Não foi possível carregar esta página do portfólio.
          </p>
        )}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          disabled={index === 0}
          onClick={() => showPage(index - 1)}
        >
          Anterior
        </button>
        <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
          Página {index + 1} de {pages.length}
        </p>
        <button
          type="button"
          className={styles.button}
          disabled={index === pages.length - 1}
          onClick={() => showPage(index + 1)}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
