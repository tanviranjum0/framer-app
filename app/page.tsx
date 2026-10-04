import { IntroCurtain } from "@/components/layout/intro-curtain";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CardDeck } from "@/components/sections/card-deck";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { ImageTrail } from "@/components/sections/image-trail";
import { ParallaxGallery } from "@/components/sections/parallax-gallery";
import { PeekCarousel } from "@/components/sections/peek-carousel";
import { PointerField } from "@/components/sections/pointer-field";
import { ScrollSequence } from "@/components/sections/scroll-sequence";
import { SpringPlayground } from "@/components/sections/spring-playground";
import { TraitList } from "@/components/sections/trait-list";
import { VelocityMarquee } from "@/components/sections/velocity-marquee";
import { ViewSwitcher } from "@/components/sections/view-switcher";

/**
 * The page is a server component; only the sections that need the browser
 * carry "use client". That keeps the document shell, metadata and the intro
 * curtain out of the client bundle entirely.
 */
export default function Page() {
  return (
    <>
      <IntroCurtain />
      <ScrollProgress />
      <SiteHeader />

      <main>
        <Hero />
        <VelocityMarquee />
        <ScrollSequence />
        <CardDeck />
        <PeekCarousel />
        <ParallaxGallery />
        <TraitList />
        <PointerField />
        <ImageTrail />
        <SpringPlayground />
        <ViewSwitcher />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
