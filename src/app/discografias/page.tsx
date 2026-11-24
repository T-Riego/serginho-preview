import type { Metadata } from "next";
import { DiscographyListing } from "@/components/sites/serginho-barbosa/discography-pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Discografia",
  description:
    "Explore os álbuns, coletâneas, sambas, boleros, hinos e outros trabalhos da discografia de Serginho Barbosa.",
  path: "/discografias",
});

export default function DiscographyPage() {
  return <DiscographyListing />;
}
