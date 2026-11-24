import type { Metadata } from "next";

export const siteName = "Serginho Barbosa";
export const defaultTitle = "Serginho Barbosa | Cantor, Compositor, Ator e Produtor";
export const defaultDescription =
  "Site oficial de Serginho Barbosa, cantor, compositor, ator e produtor de Itabirito, Minas Gerais. Conheça sua biografia, discografia, vídeos, portfólio e projetos.";

const fallbackSiteUrl = "https://www.serginhobarbosa.com.br";

function normalizeSiteUrl(value: string | undefined) {
  const candidate = value?.trim() || fallbackSiteUrl;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallbackSiteUrl;
    return url.toString().replace(/\/+$/, "");
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const socialImagePath = "/sites/serginho-barbosa/editorial/hero-serginho-solo.webp";

export function absoluteUrl(path = "/") {
  return new URL(path.replace(/^\/+/, ""), `${siteUrl}/`).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  home?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  home = false,
}: PageMetadataOptions): Metadata {
  const socialTitle = home ? title : `${title} | ${siteName}`;

  return {
    title: home ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName,
      title: socialTitle,
      description,
      url: path,
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
      title: socialTitle,
      description,
      images: [{ url: socialImagePath, alt: "Serginho Barbosa cantando no palco" }],
    },
  };
}

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const searchVerification: Metadata["verification"] =
  googleVerification || bingVerification
    ? {
        ...(googleVerification ? { google: googleVerification } : {}),
        ...(bingVerification
          ? { other: { "msvalidate.01": bingVerification } }
          : {}),
      }
    : undefined;
