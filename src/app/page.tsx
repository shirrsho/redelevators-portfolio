import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Showcase } from "@/components/Showcase";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Systems } from "@/components/Systems";
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
        <Showcase />
        <Services />
        <Process />
        <Systems />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
