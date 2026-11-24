import type { Metadata } from "next";
import { VideoPage } from "@/components/sites/serginho-barbosa/media-pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Vídeos",
  description:
    "Assista a shows, clipes e apresentações de Serginho Barbosa, incluindo o espetáculo Voz Companheira.",
  path: "/videos",
});

export default VideoPage;
