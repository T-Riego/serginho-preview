import type { Metadata } from "next";
import { ActorContent } from "@/components/sites/serginho-barbosa/actor-content";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Ator",
  description:
    "Conheça a formação em artes cênicas e os trabalhos de Serginho Barbosa como ator, de Voz Companheira a Ensaio sobre a Cegueira e Yerma.",
  path: "/ator",
});

export default function ActorPage() {
  return (
    <main>
      <InnerBanner title="Ator" page="ator" />
      <ActorContent />
    </main>
  );
}
