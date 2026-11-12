"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { assetRoot, currentNavigation, heroSlides, navigation } from "./site-content";

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="sb-brand" onClick={onClick}>
      <Image src={`${assetRoot}/logo.webp`} width={405} height={83} alt="Serginho Barbosa" loading="eager" unoptimized />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function updateHeader() {
      setScrolled(window.scrollY > 105);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className="sb-header" data-home={pathname === "/"} data-scrolled={scrolled}>
      <div className="sb-container sb-header-inner">
        <Brand />
        <nav className="sb-desktop-nav" aria-label="Navegação principal">
          <ul>
            {navigation.map(({ label, href, children }) => (
              <li key={label}>
                <Link href={href} aria-current={currentNavigation(pathname, href)}>{label}</Link>
                {children && (
                  <ul className="sb-subnav">
                    {children.map(([name, path]) => {
                      const destination = `${href}/${path}`;
                      return <li key={path}><Link href={destination} aria-current={currentNavigation(pathname, destination)}>{name}</Link></li>;
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="sb-menu-trigger" aria-label="Abrir menu">
            <span /><span /><span />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="sb-menu-backdrop" />
            <Dialog.Popup className="sb-mobile-menu">
              <Dialog.Title className="sr-only">Menu principal</Dialog.Title>
              <Dialog.Close className="sb-menu-close" aria-label="Fechar menu"><X size={29} strokeWidth={1} /></Dialog.Close>
              <Brand onClick={() => setMenuOpen(false)} />
              <nav aria-label="Navegação móvel">
                <ul>
                  {navigation.map(({ href, label, children }) => (
                    <li className="sb-mobile-nav-item" key={href}>
                      <Link className={children ? "sb-mobile-parent" : undefined} href={href} onClick={() => setMenuOpen(false)} aria-current={currentNavigation(pathname, href)}>{label}</Link>
                      {children && (
                        <details className="sb-mobile-subnav">
                          <summary role="button" aria-label={`Submenu de ${label}`}><ChevronDown size={17} aria-hidden="true" /></summary>
                          <ul>
                            {children.map(([name, path]) => {
                              const destination = `${href}/${path}`;
                              return <li key={path}><Link href={destination} onClick={() => setMenuOpen(false)} aria-current={currentNavigation(pathname, destination)}>{name}</Link></li>;
                            })}
                          </ul>
                        </details>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}

type CarouselView = { index: number; previous: number | null; direction: 1 | -1 };
const slideCount = heroSlides.length;

export function HeroCarousel() {
  const [view, setView] = useState<CarouselView>({ index: 0, previous: null, direction: 1 });
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    if (manual || paused || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setView(({ index }) => ({ index: (index + 1) % slideCount, previous: index, direction: 1 }));
    }, 3000);

    return () => window.clearInterval(timer);
  }, [manual, paused]);

  function show(index: number, direction: 1 | -1) {
    setManual(true);
    if (index !== view.index) setView({ index, direction, previous: view.index });
  }

  function step(direction: 1 | -1) {
    show((view.index + direction + slideCount) % slideCount, direction);
  }

  const slide = heroSlides[view.index];

  return (
    <section
      className="sb-hero"
      aria-label="Destaques"
      data-direction={view.direction}
      style={{ "--sb-slide-ratio": `${slide.width} / ${slide.height}` } as CSSProperties}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setPaused(true); }}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          step(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        suppressClick.current = false;
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
          suppressClick.current = true;
          step(dx < 0 ? 1 : -1);
        }
      }}
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault();
          suppressClick.current = false;
        }
      }}
    >
      {view.previous !== null && (
        <div key={`leaving-${view.previous}-${view.index}`} className="sb-slide sb-slide-leaving" aria-hidden="true">
          <Image src={`${assetRoot}/${heroSlides[view.previous].image}`} alt="" fill unoptimized loading="eager" />
        </div>
      )}
      <div key={view.index} className={`sb-slide${view.previous === null ? "" : " sb-slide-entering"}`}>
        {slide.href ? (
          <a href={slide.href}>
            <Image src={`${assetRoot}/${slide.image}`} alt={slide.label} fill unoptimized loading="eager" />
          </a>
        ) : (
          <Image src={`${assetRoot}/${slide.image}`} alt={slide.label} fill unoptimized loading="eager" />
        )}
      </div>
      <button className="sb-hero-arrow sb-hero-prev" type="button" aria-label="Destaque anterior" onClick={() => step(-1)}><ChevronLeft size={24} /></button>
      <button className="sb-hero-arrow sb-hero-next" type="button" aria-label="Próximo destaque" onClick={() => step(1)}><ChevronRight size={24} /></button>
      <div className="sb-hero-dots">
        {heroSlides.map(({ label }, index) => (
          <button key={label} type="button" aria-label={`Mostrar ${label}`} aria-current={index === view.index} onClick={() => show(index, index > view.index ? 1 : -1)} />
        ))}
      </div>
    </section>
  );
}
