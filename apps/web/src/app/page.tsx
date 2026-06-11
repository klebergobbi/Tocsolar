import { Hero } from "@/components/sections/Hero";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { PainPromise } from "@/components/sections/PainPromise";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SegmentCards } from "@/components/sections/SegmentCards";
import { Differentials } from "@/components/sections/Differentials";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsCounter />
      <PainPromise />
      <HowItWorks />
      <SegmentCards />
      <Differentials />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
  );
}
