import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustSection } from "@/components/landing/TrustSection";
import { AwsArchitectureSection } from "@/components/landing/AwsArchitectureSection";
import { ProductStageSection } from "@/components/landing/ProductStageSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <AudienceSection />
      <HowItWorks />
      <TrustSection />
      <AwsArchitectureSection />
      <ProductStageSection />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
