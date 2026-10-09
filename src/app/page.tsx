import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Proof } from "@/components/Proof";
import { LanguageMap } from "@/components/LanguageMap";
import { Leaks } from "@/components/Leaks";
import { Automations } from "@/components/Automations";
import { Showcase } from "@/components/Showcase";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Proof />
        <LanguageMap />
        <Leaks />
        <Automations />
        <Showcase />
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
