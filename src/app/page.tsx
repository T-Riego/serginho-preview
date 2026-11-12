import { HeroCarousel } from "@/components/sites/serginho-barbosa/home-controls";
import { ArtistStory, Discographies } from "@/components/sites/serginho-barbosa/home-sections";
import { LowerSections } from "@/components/sites/serginho-barbosa/lower-sections";
import { GallerySection, VideosSection } from "@/components/sites/serginho-barbosa/media-sections";

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">Serginho Barbosa</h1>
      <HeroCarousel />
      <Discographies />
      <ArtistStory story="biografia" />
      <VideosSection />
      <ArtistStory story="carnaval" />
      <GallerySection />
      <LowerSections />
    </main>
  );
}
