import type { Metadata } from "next";
import { SiteHeader } from "@/components/sites/serginho-barbosa/home-controls";
import { FloatingContacts } from "@/components/sites/serginho-barbosa/home-sections";
import { SiteFooter } from "@/components/sites/serginho-barbosa/lower-sections";
import "./globals.css";
import "@/components/sites/serginho-barbosa/site.css";

export const metadata: Metadata = {
  title: "Serginho Barbosa | Voz Companheira, Boleros e Circo dos Amores",
  description: "Discografias, vídeos, biografia e projetos de Serginho Barbosa, cantor e compositor de Itabirito, Minas Gerais.",
  icons: { icon: "/sites/serginho-barbosa/favicon.webp" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="sb-site">
          <SiteHeader />
          {children}
          <SiteFooter />
          <FloatingContacts />
        </div>
      </body>
    </html>
  );
}
