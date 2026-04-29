import { Navbar } from "@/components/layout/Navbar";
import { HeroSectionPreview } from "@/components/sections/HeroSectionPreview";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ProtocolArchSection } from "@/components/sections/ProtocolArchSection";
import { HowItWorksSectionV2 } from "@/components/sections/HowItWorksSectionV2";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { ScoreCalculator } from "@/components/sections/ScoreCalculator";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";
import { BorderVariantProvider } from "@/components/providers/BorderVariantProvider";

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

export default function PreviewPage() {
  return (
    <BorderVariantProvider>
      <Navbar />
      <main className="flex flex-col pt-16">
        <HeroSectionPreview />
        <GradientDivider />
        <div style={{ background: "var(--surface)" }}>
          <ProblemSection />
        </div>
        <GradientDivider />
        <ProtocolArchSection />
        <GradientDivider />
        <div style={{ background: "var(--surface)" }}>
          <HowItWorksSectionV2 />
        </div>
        <GradientDivider />
        <EcosystemSection />
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
