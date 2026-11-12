import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/sites/serginho-barbosa/home-controls";
import { FloatingContacts } from "@/components/sites/serginho-barbosa/home-sections";
import { SiteFooter } from "@/components/sites/serginho-barbosa/lower-sections";
import "./globals.css";
import "@/components/sites/serginho-barbosa/site.css";

const displayFont = localFont({
  src: [
    { path: "../../public/sites/serginho-barbosa/instrument-serif-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/sites/serginho-barbosa/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--sb-font-display",
  display: "swap",
});

const bodyFont = localFont({
  src: "../../public/sites/serginho-barbosa/roboto-latin.woff2",
  weight: "100 900",
  variable: "--sb-font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Serginho Barbosa | Voz Companheira, Boleros e Circo dos Amores",
  description: "Discografias, vídeos, biografia e projetos de Serginho Barbosa, cantor e compositor de Itabirito, Minas Gerais.",
  icons: { icon: "/sites/serginho-barbosa/favicon.webp" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <div className="sb-site">
          <SiteHeader />
          {children}
          <SiteFooter />
          <FloatingContacts />
        </div>
      </body>
    </html>
  );
}
