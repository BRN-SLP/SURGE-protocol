import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ScoreCalculator } from "@/components/sections/ScoreCalculator";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ScoreCalculator />
      <FinalCTA />
      <Footer />
    </main>
  );
}
