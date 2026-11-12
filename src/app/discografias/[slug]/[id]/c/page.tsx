import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  discographyCategories,
  DiscographyListing,
  readDiscographySearch,
  type DiscographySearchParams,
} from "@/components/sites/serginho-barbosa/discography-pages";

type CategoryPageProps = {
  params: Promise<{ slug: string; id: string }>;
  searchParams: DiscographySearchParams;
};

async function getCategory(params: CategoryPageProps["params"]) {
  const { slug, id } = await params;
  const category = discographyCategories.find((entry) => entry.slug === slug && entry.id === id);
  if (!category) notFound();
  return category;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return { title: (await getCategory(params)).label };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [category, search] = await Promise.all([getCategory(params), readDiscographySearch(searchParams)]);
  return <DiscographyListing category={category} search={search} />;
}
