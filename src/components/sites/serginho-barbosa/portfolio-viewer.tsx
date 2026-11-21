"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioPageAsset } from "./portfolio-pages-data";
import styles from "./portfolio.module.css";

const compactMediaQuery = "(max-width: 720px)";

type TouchPoint = Readonly<{ identifier: number; x: number; y: number }>;

export function PortfolioViewer({ pages }: { pages: readonly PortfolioPageAsset[] }) {
  const [index, setIndex] = useState(0);
  const [failedPage, setFailedPage] = useState<number | null>(null);
  const [previousPageCount, setPreviousPageCount] = useState(pages.length);
  const touchStart = useRef<TouchPoint | null>(null);
  const prefetchedPages = useRef(new Set<string>());
  const current = pages[index];
  const imageError = current?.number === failedPage;

  if (pages.length !== previousPageCount) {
    setPreviousPageCount(pages.length);
    if (pages.length < previousPageCount && index >= pages.length) {
      setIndex(Math.max(0, pages.length - 1));
      setFailedPage(null);
    }
  }

  useEffect(() => {
    const next = pages[index + 1];
    if (!next) return;

    const source = window.matchMedia(compactMediaQuery).matches
      ? next.compactSrc
      : next.desktopSrc;
    if (prefetchedPages.current.has(source)) return;

    prefetchedPages.current.add(source);
    const image = new window.Image();
    image.src = source;
  }, [index, pages]);

  if (!current) return null;

  function showPage(nextIndex: number) {
    const boundedIndex = Math.min(pages.length - 1, Math.max(0, nextIndex));
    if (boundedIndex === index) return;
    setFailedPage(null);
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
          if (event.touches.length !== 1) {
            touchStart.current = null;
            return;
          }

          const touch = event.touches[0];
          touchStart.current = touch
            ? { identifier: touch.identifier, x: touch.clientX, y: touch.clientY }
            : null;
        }}
        onTouchMove={(event) => {
          const start = touchStart.current;
          const touch = event.touches[0];
          if (!start) return;
          if (event.touches.length !== 1 || touch?.identifier !== start.identifier) {
            touchStart.current = null;
          }
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || event.touches.length !== 0 || event.changedTouches.length !== 1) return;

          const touch = Array.from(event.changedTouches).find(
            ({ identifier }) => identifier === start.identifier,
          );
          if (!touch) return;

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
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            unoptimized
            onError={() => setFailedPage(current.number)}
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
