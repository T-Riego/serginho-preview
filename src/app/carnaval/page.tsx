import type { Metadata } from "next";
import { CarnivalContent } from "@/components/sites/serginho-barbosa/editorial-content";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Carnaval",
  description:
    "Conheça o projeto Carnaval é Aqui — Circo dos Amores, de Serginho Barbosa, com música, samba, frevo e celebração da cultura mineira.",
  path: "/carnaval",
});

export default function CarnivalPage() {
  return (
    <main>
      <InnerBanner title="Carnaval" page="carnaval" />
      <CarnivalContent />
    </main>
  );
}
