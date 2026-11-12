import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  discographyCategories,
  DiscographyListing,
} from "@/components/sites/serginho-barbosa/discography-pages";

type CategoryPageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return discographyCategories.map(({ slug, id }) => ({ slug, id }));
}

async function getCategory(params: CategoryPageProps["params"]) {
  const { slug, id } = await params;
  const category = discographyCategories.find((entry) => entry.slug === slug && entry.id === id);
  if (!category) notFound();
  return category;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return { title: (await getCategory(params)).label };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return <DiscographyListing category={await getCategory(params)} />;
}
