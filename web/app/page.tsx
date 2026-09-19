import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogosMarquee } from "@/components/landing/LogosMarquee";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionBento } from "@/components/landing/SolutionBento";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesShowcase } from "@/components/landing/FeaturesShowcase";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <LogosMarquee />
      <ProblemSection />
      <SolutionBento />
      <HowItWorks />
      <FeaturesShowcase />
      <TestimonialsMarquee />
      <PricingSection />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
