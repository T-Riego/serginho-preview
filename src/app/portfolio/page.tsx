import type { Metadata } from "next";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";
import { PortfolioPageContent } from "@/components/sites/serginho-barbosa/portfolio-page";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Portfólio artístico de Serginho Barbosa como cantor, ator, compositor, locutor e produtor.",
};

export default function PortfolioPage() {
  return (
    <main>
      <InnerBanner title="Portfólio" page="portfolio" />
      <PortfolioPageContent />
    </main>
  );
}
