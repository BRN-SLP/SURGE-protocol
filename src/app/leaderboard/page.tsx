import { Navbar } from "@/components/layout/Navbar";
import { Leaderboard } from "@/components/sections/Leaderboard";
import { BorderVariantProvider } from "@/components/providers/BorderVariantProvider";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Top SURGE Protocol identities ranked by on-chain reputation score across the Superchain.",
};

export default function LeaderboardPage() {
  return (
    <ErrorBoundary>
      <BorderVariantProvider>
        <Navbar />
        <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
          <CompactHeader
            title="Leaderboard"
            subtitle="Top SURGE identities ranked by reputation score"
          />
          <Leaderboard />
        </ViewportContainer>
      </BorderVariantProvider>
    </ErrorBoundary>
  );
}
