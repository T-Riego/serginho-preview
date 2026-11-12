import { HeroCarousel } from "@/components/sites/serginho-barbosa/hero-carousel";
import { ArtistStory, Discographies } from "@/components/sites/serginho-barbosa/home-sections";
import { LowerSections } from "@/components/sites/serginho-barbosa/lower-sections";
import { GallerySection, VideosSection } from "@/components/sites/serginho-barbosa/media-sections";

export default function Home() {
  return (
    <main>
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
