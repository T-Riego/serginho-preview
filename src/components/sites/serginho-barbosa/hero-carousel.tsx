"use client";

import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type TouchEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { assetRoot, spotify } from "./site-content";

const slides = [
  {
    label: "Serginho Barbosa",
    heading: "Serginho",
    accent: "Barbosa",
    category: "Cantor, compositor e ator",
    description: "Da MPB aos boleros e ao carnaval, uma trajetória que começa em Itabirito, Minas Gerais.",
    image: "editorial/biografia-show.webp",
    thumb: "palco.webp",
    alt: "Serginho Barbosa cantando no palco sob luz roxa",
    visual: "opening",
    actions: [
      { label: "Explorar discografias", href: "/discografias" },
      { label: "Conhecer a trajetória", href: "/biografia" },
    ],
  },
  {
    label: "Brilho Novo",
    heading: "Brilho Novo",
    category: "Discografia",
    description: "Um disco nascido durante a pandemia que celebra mais de 35 anos de carreira.",
    image: "discography/brilho-novo.png",
    width: 1200,
    height: 1200,
    thumb: "brilho-novo.webp",
    alt: "Capa do álbum Brilho Novo",
    visual: "record",
    actions: [{ label: "Conhecer o álbum", href: "/discografias/brilho-novo/11" }],
  },
  {
    label: "Canal no YouTube",
    heading: "Serginho",
    accent: "no YouTube",
    category: "Clipes e apresentações",
    description: "Assista aos clipes, shows e registros de Brilho Novo no canal oficial.",
    image: "editorial/biografia-evento.webp",
    thumb: "youtube.webp",
    alt: "Serginho Barbosa e banda em um teatro iluminado de vermelho",
    visual: "show",
    actions: [{ label: "Abrir canal no YouTube", href: "https://www.youtube.com/@SerginhoBarbosaVozCompanheira" }],
  },
  {
    label: "Voz Companheira",
    heading: "Voz Companheira",
    category: "Web rádio",
    description: "A voz na MPB. Uma rádio dedicada à música brasileira.",
    image: "slide-radio.png",
    thumb: "radio.webp",
    alt: "Selo da Web Rádio Voz Companheira com um microfone",
    visual: "radio",
    actions: [{ label: "Ouvir a rádio", href: "https://www.radiovozcompanheira.com.br/" }],
  },
  {
    label: "Boleros",
    heading: "Uma História",
    accent: "de Amor",
    category: "Boleros",
    description: "Serginho interpreta clássicos do bolero em um disco dedicado ao gênero.",
    image: "discography/uma-historia-de-amor.webp",
    width: 500,
    height: 427,
    thumb: "boleros.webp",
    alt: "Capa do álbum Boleros, Uma História de Amor",
    visual: "record",
    actions: [{ label: "Conhecer o álbum", href: "/discografias/uma-historia-de-amor/5" }],
  },
  {
    label: "Carnaval",
    heading: "Carnaval",
    accent: "é Aqui",
    category: "Show",
    description: "Marchinhas e sucessos do carnaval brasileiro, com a música de Itabirito no repertório.",
    image: "editorial/carnaval-circo.webp",
    thumb: "carnaval.webp",
    alt: "Serginho Barbosa no palco com chapéu vermelho e luzes de carnaval",
    visual: "carnival",
    actions: [
      { label: "Conhecer o projeto", href: "/carnaval" },
      { label: "Ouvir no Spotify", href: spotify },
    ],
  },
  {
    label: "Circo dos Amores",
    heading: "Circo",
    accent: "dos Amores",
    category: "Discografia",
    description: "O álbum reúne marchinhas, sambas-enredo e outras canções do carnaval de Itabirito.",
    image: "discography/circo-dos-amores.webp",
    width: 500,
    height: 427,
    thumb: "circo.webp",
    alt: "Capa do álbum Circo dos Amores",
    visual: "record",
    actions: [
      { label: "Conhecer o álbum", href: "/discografias/circo-dos-amores/4" },
      { label: "Ouvir no Spotify", href: "https://open.spotify.com/album/4brmUjtz7Y69OpUYIq82Pd" },
    ],
  },
] as const;

const motionPreference = "(prefers-reduced-motion: reduce)";
const rotationDelay = 4000;

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia?.(motionPreference);
  query?.addEventListener("change", callback);
  return () => query?.removeEventListener("change", callback);
}

export function HeroCarousel() {
  const region = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const ignorePhotoClick = useRef(false);
  const [index, setIndex] = useState(0);
  const [play, setPlay] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia?.(motionPreference).matches ?? false,
    () => false,
  );
  const playing = play ?? !reducedMotion;
  const playbackLabel = playing ? "Pausar destaques" : "Reproduzir destaques";
  const slide = slides[index];
  const imageSizing = slide.visual === "record"
    ? { width: slide.width, height: slide.height, className: "sb-cover-finish" }
    : { fill: true };
  const opening = index === 0;
  const Title = opening ? "h1" : "h2";

  useEffect(() => {
    const element = region.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView || hovered) return;
    let timer: number | undefined;
    function schedule() {
      window.clearTimeout(timer);
      if (!document.hidden) {
        timer = window.setTimeout(() => setIndex((current) => (current + 1) % slides.length), rotationDelay);
      }
    }
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [index, playing, inView, hovered]);

  useEffect(() => {
    const list = rail.current;
    const selected = list?.children[index];
    if (!list || !selected || list.scrollWidth <= list.clientWidth) return;
    const track = list.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.right > track.right) list.scrollLeft += item.right - track.right;
    if (item.left < track.left) list.scrollLeft -= track.left - item.left;
  }, [index]);

  function show(next: number) {
    setPlay(false);
    setIndex((next + slides.length) % slides.length);
  }

  function togglePlayback() {
    setPlay(!playing);
  }

  function endSwipe(event: TouchEvent) {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      ignorePhotoClick.current = true;
      show(index + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <section
      ref={region}
      className="sb-home-hero"
      aria-label="Destaques de Serginho Barbosa"
      aria-roledescription="carrossel"
      onPointerOver={(event) => {
        if (event.pointerType === "mouse" && event.target instanceof Element) {
          setHovered(Boolean(event.target.closest("a, button:not(.sb-hero-photo-toggle)")));
        }
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible:not(.sb-hero-photo-toggle)")) setPlay(false);
      }}
    >
      <div className="sb-hero-toolbar" onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          show(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}>
        <div className="sb-container sb-hero-toolbar-inner">
          <div className="sb-hero-transport" role="group" aria-label="Controles dos destaques">
            <button type="button" aria-label={playbackLabel} onClick={togglePlayback}>
              {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            </button>
            <button type="button" aria-label="Destaque anterior" onClick={() => show(index - 1)}><ChevronLeft size={20} aria-hidden="true" /></button>
            <button type="button" aria-label="Próximo destaque" onClick={() => show(index + 1)}><ChevronRight size={20} aria-hidden="true" /></button>
          </div>
          <div className="sb-hero-rail" ref={rail} role="group" aria-label="Escolher destaque">
            {slides.map(({ label, thumb }, position) => (
              <button key={label} type="button" aria-label={`Mostrar ${label}`} aria-current={index === position || undefined} onClick={() => show(position)}>
                <Image src={`${assetRoot}/hero-thumbs/${thumb}`} width={40} height={40} alt="" unoptimized />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {!opening && <h1 className="sr-only">Serginho Barbosa</h1>}
      <div
        className="sb-hero-stage"
        data-visual={slide.visual}
        aria-live={playing ? "off" : "polite"}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          ignorePhotoClick.current = false;
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={endSwipe}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <div className="sb-hero-slide" role="group" aria-roledescription="destaque" aria-label={`${index + 1} de ${slides.length}`}>
          <div className="sb-home-hero-photo">
            <div key={slide.label} className="sb-hero-image">
              <Image
                src={`${assetRoot}/${slide.image}`}
                alt={slide.alt}
                {...imageSizing}
                sizes={slide.visual === "radio" ? "(max-width: 720px) 900px, 1500px" : slide.visual === "record" ? "(max-width: 720px) 70vw, 420px" : "(max-width: 720px) 100vw, 73vw"}
                loading="eager"
                fetchPriority={opening ? "high" : undefined}
              />
            </div>
            <button
              type="button"
              className="sb-hero-photo-toggle"
              aria-label={`${playbackLabel} pela foto`}
              onPointerDown={(event) => {
                if (event.pointerType === "mouse") ignorePhotoClick.current = false;
              }}
              onClick={(event) => {
                if (!ignorePhotoClick.current || event.detail === 0) togglePlayback();
                ignorePhotoClick.current = false;
              }}
            >
              <span className="sb-hero-photo-toggle-icon" aria-hidden="true">
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </span>
            </button>
          </div>
          <div key={slide.label} className="sb-container sb-home-hero-content">
            <p className="sb-artist-role">{slide.category}</p>
            <Title className="sb-hero-title">{slide.heading}{"accent" in slide && <> <em>{slide.accent}</em></>}</Title>
            <p className="sb-hero-description">{slide.description}</p>
            <div className="sb-actions">
              {slide.actions.map(({ label, href }, actionIndex) => {
                const className = actionIndex === 0 ? "sb-button" : "sb-button sb-button-outline";
                return href.startsWith("/") ? (
                  <Link key={href} href={href} className={className}>{label}{actionIndex === 0 && <ArrowRight size={17} aria-hidden="true" />}</Link>
                ) : (
                  <a key={href} href={href} className={className} target="_blank" rel="noreferrer">{label} <ArrowUpRight size={17} aria-hidden="true" /></a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
