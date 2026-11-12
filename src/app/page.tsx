import { HeroCarousel } from "@/components/sites/serginho-barbosa/home-controls";
import { ArtistHero, ArtistStory, Discographies } from "@/components/sites/serginho-barbosa/home-sections";
import { LowerSections } from "@/components/sites/serginho-barbosa/lower-sections";
import { GallerySection, VideosSection } from "@/components/sites/serginho-barbosa/media-sections";

export default function Home() {
  return (
    <main>
      <ArtistHero />
      <Discographies />
      <ArtistStory story="biografia" />
      <section className="sb-section sb-highlights" aria-labelledby="destaques">
        <div className="sb-container">
          <h2 className="sb-heading" id="destaques">Destaques</h2>
          <HeroCarousel />
        </div>
      </section>
      <VideosSection />
      <ArtistStory story="carnaval" />
      <GallerySection />
      <LowerSections />
    </main>
  );
}
