"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";

export function BannerLinks({ items, activeHref }: {
  items: readonly { label: string; href: string }[];
  activeHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <nav className="sb-banner-links" aria-label="Categorias" data-open={open} onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    }}>
      <button ref={trigger} type="button" className="sb-banner-links-trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <Menu size={26} strokeWidth={3} aria-hidden="true" /> Categorias
      </button>
      <ul id={id}>
        {items.map(({ label, href }) => (
          <li key={href}>
            <Link href={href} aria-current={href === activeHref ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
