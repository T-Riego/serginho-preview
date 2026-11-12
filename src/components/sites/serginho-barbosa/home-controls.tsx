"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { assetRoot, currentNavigation, navigation } from "./site-content";

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="sb-brand" onClick={onClick}>
      <Image src={`${assetRoot}/logo.webp`} width={405} height={83} alt="Serginho Barbosa" loading="eager" unoptimized />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sb-header">
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
            <Menu size={19} aria-hidden="true" /> Menu
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
