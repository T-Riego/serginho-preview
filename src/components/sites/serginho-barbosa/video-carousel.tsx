"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./media-sections.module.css";

const motionPreference = "(prefers-reduced-motion: reduce)";
const scrollInterval = 5000;

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia?.(motionPreference);
  query?.addEventListener("change", callback);
  return () => query?.removeEventListener("change", callback);
}

function moveTrack(track: HTMLDivElement, direction: 1 | -1) {
  const max = track.scrollWidth - track.clientWidth;
  const current = track.scrollLeft;
  const first = track.firstElementChild;
  if (max <= 1 || !(first instanceof HTMLElement)) return;

  if (direction === 1 && current >= max - 1) {
    track.scrollTo({ left: 0 });
    return;
  }

  const positions = Array.from(track.children, (card) => (card as HTMLElement).offsetLeft - first.offsetLeft);
  const next = direction === 1
    ? positions.find((position) => position > current + 1)
    : positions.reverse().find((position) => position < current - 1);
  track.scrollTo({ left: Math.min(next ?? max, max) });
}

export function VideoCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [play, setPlay] = useState<boolean | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia?.(motionPreference).matches ?? false,
    () => false,
  );
  const playing = play ?? !reducedMotion;

  useEffect(() => {
    const element = track.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element || !playing || !inView || hovered) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) moveTrack(element, 1);
    }, scrollInterval);
    return () => window.clearInterval(timer);
  }, [playing, inView, hovered]);

  function step(direction: 1 | -1) {
    setPlay(false);
    if (track.current) moveTrack(track.current, direction);
  }

  return (
    <section
      className={styles.videoCarousel}
      aria-label="Vídeos em destaque"
      aria-roledescription="carrossel"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setPlay(false); }}
    >
      <div className={styles.videoCarouselControls} role="group" aria-label="Controles da rolagem">
        <button type="button" aria-label={playing ? "Pausar rolagem dos vídeos" : "Retomar rolagem dos vídeos"} onClick={() => setPlay(!playing)}>
          {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
        </button>
        <button type="button" aria-label="Vídeos anteriores" onClick={() => step(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <button type="button" aria-label="Próximos vídeos" onClick={() => step(1)}><ChevronRight size={20} aria-hidden="true" /></button>
      </div>
      <div
        className={styles.videoCarouselTrack}
        ref={track}
        role="group"
        aria-label="Miniaturas de vídeos"
        onPointerDown={() => setPlay(false)}
        onWheel={(event) => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) setPlay(false); }}
      >
        {children}
      </div>
    </section>
  );
}
