import type { MetadataRoute } from "next";
import { discographyAlbums } from "@/components/sites/serginho-barbosa/discography-data";
import galleryData from "@/components/sites/serginho-barbosa/media-pages-data.json";
import { navigation } from "@/components/sites/serginho-barbosa/site-content";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const lastContentUpdate = "2026-11-24";

function pageUrl(path: string) {
  return absoluteUrl(path === "/" ? path : `${path.replace(/\/+$/, "")}/`);
}

const staticRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/biografia", changeFrequency: "yearly" as const, priority: 0.8 },
  { path: "/portfolio", changeFrequency: "yearly" as const, priority: 0.8 },
  { path: "/ator", changeFrequency: "yearly" as const, priority: 0.8 },
  { path: "/carnaval", changeFrequency: "yearly" as const, priority: 0.8 },
  { path: "/discografias", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/videos", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/galeria-de-fotos", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/contatos", changeFrequency: "yearly" as const, priority: 0.7 },
];

const discographyCategoryRoutes =
  navigation
    .find(({ label }) => label === "Discografias")
    ?.children?.map(([, path]) => `/discografias/${path}`) ?? [];

const galleryRoutes = galleryData.albums.map(
  ({ slug, id }) => `/galeria-de-fotos/${slug}/${id}`,
);

export default function sitemap(): MetadataRoute.Sitemap {
  const primaryRoutes = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: pageUrl(path),
    lastModified: lastContentUpdate,
    changeFrequency,
    priority,
  }));

  const detailRoutes = [
    ...discographyAlbums.map(({ href }) => href),
    ...discographyCategoryRoutes,
    ...galleryRoutes,
  ].map((path) => ({
    url: pageUrl(path),
    lastModified: lastContentUpdate,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...primaryRoutes, ...detailRoutes];
}
