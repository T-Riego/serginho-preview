import type { Metadata } from "next";
import { BiographyContent } from "@/components/sites/serginho-barbosa/editorial-content";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";

export const metadata: Metadata = { title: "Biografia" };

export default function BiographyPage() {
  return (
    <main>
      <InnerBanner title="Biografia" page="biografia" />
      <BiographyContent />
    </main>
  );
}
