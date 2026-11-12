import type { Metadata } from "next";
import {
  DiscographyListing,
  readDiscographySearch,
  type DiscographySearchParams,
} from "@/components/sites/serginho-barbosa/discography-pages";

export const metadata: Metadata = { title: "Discografias" };

export default async function DiscographyPage({ searchParams }: { searchParams: DiscographySearchParams }) {
  return <DiscographyListing search={await readDiscographySearch(searchParams)} />;
}
