import type { Metadata } from "next";
import { CarnivalContent } from "@/components/sites/serginho-barbosa/editorial-content";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";

export const metadata: Metadata = { title: "Carnaval" };

export default function CarnivalPage() {
  return (
    <main>
      <InnerBanner title="Carnaval" page="carnaval" />
      <CarnivalContent />
    </main>
  );
}
