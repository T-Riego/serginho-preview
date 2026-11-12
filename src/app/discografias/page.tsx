import type { Metadata } from "next";
import { DiscographyListing } from "@/components/sites/serginho-barbosa/discography-pages";

export const metadata: Metadata = { title: "Discografias" };

export default function DiscographyPage() {
  return <DiscographyListing />;
}
