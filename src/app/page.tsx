import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { ScoreCalculator } from "@/components/sections/ScoreCalculator";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";
import { BorderVariantProvider } from "@/components/providers/BorderVariantProvider";

const HowItWorksSection = dynamic(
  () => import("@/components/sections/HowItWorksSection").then((m) => m.HowItWorksSection),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh" }} /> },
);

function GradientDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background:
          "linear-gradient(to right, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)",
      }}
    />
  );
}

export default function HomePage() {
  return (
    <BorderVariantProvider>
      <Navbar />
      <main className="flex flex-col pt-16">
        <HeroSection />
        <GradientDivider />
        <div style={{ background: "var(--surface)" }}>
          <ProblemSection />
        </div>
        <GradientDivider />
        <HowItWorksSection />
        <GradientDivider />
        <div style={{ background: "var(--surface)" }}>
          <EcosystemSection />
        </div>
        <GradientDivider />
        <ScoreCalculator />
        <GradientDivider />
        <div style={{ background: "var(--surface)" }}>
          <FinalCTA />
        </div>
      </main>
      <GradientDivider />
      <Footer />
    </BorderVariantProvider>
  );
}
