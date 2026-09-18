import { Hero } from "@/components/Hero";
import { AWSArchitecture, Navbar, Features, LiveUseCase, Footer } from "@/components/LandingSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <Hero />
      <Features />
      <LiveUseCase />
      <AWSArchitecture />
      <Footer />
    </main>
  );
}
