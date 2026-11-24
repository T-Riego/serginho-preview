import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/sites/serginho-barbosa/home-controls";
import { FloatingContacts } from "@/components/sites/serginho-barbosa/home-sections";
import { SiteFooter } from "@/components/sites/serginho-barbosa/lower-sections";
import { assetRoot } from "@/components/sites/serginho-barbosa/site-content";
import {
  absoluteUrl,
  defaultDescription,
  defaultTitle,
  searchVerification,
  siteName,
  siteUrl,
  socialImagePath,
} from "@/lib/seo";
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

const sectionActionFont = localFont({
  src: "../../public/sites/serginho-barbosa/instrument-sans-semibold.woff2",
  weight: "600",
  variable: "--sb-font-section-action",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "music",
  keywords: [
    "Serginho Barbosa",
    "cantor de Itabirito",
    "Voz Companheira",
    "Boleros",
    "Circo dos Amores",
    "música brasileira",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: socialImagePath,
        width: 3448,
        height: 2299,
        type: "image/webp",
        alt: "Serginho Barbosa cantando no palco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: socialImagePath, alt: "Serginho Barbosa cantando no palco" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: searchVerification,
  icons: { icon: `${assetRoot}/favicon.webp` },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#serginho-barbosa`,
      name: siteName,
      url: siteUrl,
      image: absoluteUrl(socialImagePath),
      description:
        "Cantor, compositor, ator, produtor e apresentador de rádio, nascido em Itabirito e residente em Contagem, Minas Gerais.",
      jobTitle: ["Cantor", "Compositor", "Ator", "Produtor"],
      birthPlace: {
        "@type": "Place",
        name: "Itabirito, Minas Gerais, Brasil",
      },
      homeLocation: {
        "@type": "Place",
        name: "Contagem, Minas Gerais, Brasil",
      },
      sameAs: [
        "https://open.spotify.com/intl-pt/artist/6S9S2gRYbH7vGCA57CJgjw",
        "https://www.facebook.com/SerginhoBarbosaOficial/",
        "https://www.instagram.com/serginhobarbosa_vozcompanheira",
        "https://www.youtube.com/channel/UCgokYREGN6KlYcu2rk3NzcQ",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: defaultDescription,
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}/#serginho-barbosa` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable} ${sectionActionFont.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
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
