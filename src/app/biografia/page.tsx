import type { Metadata } from "next";
import { BiographyContent } from "@/components/sites/serginho-barbosa/editorial-content";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Biografia",
  description:
    "Conheça a trajetória de Serginho Barbosa na música, no rádio, no teatro e no carnaval, de Itabirito para os palcos de Minas Gerais.",
  path: "/biografia",
});

export default function BiographyPage() {
  return (
    <main>
      <InnerBanner title="Biografia" page="biografia" />
      <BiographyContent />
    </main>
  );
}
