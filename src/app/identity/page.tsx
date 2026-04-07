"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { SplitLayout } from "@/components/layout/SplitLayout";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";
import { IdentityCard } from "@/components/identity-card/IdentityCard";
import { TabBar } from "@/components/ui/TabBar";
import { GhostButton } from "@/components/ui/GhostButton";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ScorePulseTab } from "@/components/dashboard/ScorePulseTab";
import { WalletsTab } from "@/components/dashboard/WalletsTab";
import { BadgesTab } from "@/components/dashboard/BadgesTab";
import { TimelineTab } from "@/components/dashboard/TimelineTab";
import { QuestsTab } from "@/components/dashboard/QuestsTab";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useWalletManagement } from "@/hooks/useWalletManagement";
import { useBadges } from "@/hooks/useBadges";
import { useChainScores } from "@/hooks/useChainScores";
import { getTierFromScore } from "@/types";
import type { IdentityCardData } from "@/types";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SkeletonShimmer } from "@/components/ui/SkeletonShimmer";
import { Share2, TrendingUp } from "lucide-react";

const TABS = [
  { id: "pulse", label: "Score Pulse" },
  { id: "wallets", label: "Wallets" },
  { id: "badges", label: "Badges" },
  { id: "timeline", label: "Timeline" },
  { id: "quests", label: "Quests" },
];

export default function IdentityPage() {
  const [activeTab, setActiveTab] = useState("pulse");
  const { tokenId } = useSurgeIdentity();
  const { address } = useAccount();
  const identityId = Number(tokenId ?? 0);
  const { wallets } = useWalletManagement(identityId);
  const {
    activities,
    badges,
    quests,
    timeline,
    scoreHistory,
    domainBreakdown,
    mintedAt,
    loading,
    error: dataError,
  } = useDashboardData(tokenId, wallets.length);
  const { claimable, claim, isClaiming, isClaimed, refetchCanClaim } = useBadges();
  const { chainScores, totalScore } = useChainScores(address);
  const activeChainNames = chainScores.filter((c) => c.score > 0).map((c) => c.shortName);
  const { wallets: walletsWithChains } = useWalletManagement(identityId, activeChainNames);

  useEffect(() => {
    if (isClaimed) refetchCanClaim();
  }, [isClaimed, refetchCanClaim]);

  const memberSince = mintedAt
    ? new Date(mintedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : undefined;

  const activeChainCount = chainScores.filter((c) => c.score > 0).length;

  const cardData: IdentityCardData = {
    id: identityId,
    tier: getTierFromScore(totalScore),
    score: totalScore,
    walletCount: wallets.length,
    chainCount: activeChainCount || [...new Set(wallets.flatMap((w) => w.chains))].length,
    badgeCount: badges.filter((b) => b.earnedAt).length,
    memberSince,
  };

  const activeQuestCount = quests.filter((q) => q.status === "active").length;

  const sidebar = (
    <ScrollableRegion
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderRight: "1px solid var(--border)",
      }}
    >
      <div data-tour="identity-card" style={{ display: "flex", justifyContent: "center" }}>
        <IdentityCard data={cardData} interactive />
      </div>

      <div
        data-tour="quick-actions"
        style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}
      >
        <QuickActions
          activeQuestCount={activeQuestCount}
          eligibleDropCount={0}
          linkedWalletCount={wallets.length}
        />
      </div>
    </ScrollableRegion>
  );

  const main = (
    <>
      <div style={{ flexShrink: 0, padding: "12px 16px 0", overflowX: "auto" }}>
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <ScrollableRegion style={{ padding: "16px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SkeletonShimmer height={44} />
            <SkeletonShimmer height={120} />
            <SkeletonShimmer height={44} />
            <SkeletonShimmer height={44} />
            <SkeletonShimmer height={44} />
          </div>
        ) : dataError ? (
          <div
            style={{
              padding: "24px 0",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.08em" }}>
              Failed to load data
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-faint)", fontWeight: 300 }}>
              The Graph may be temporarily unavailable. Try refreshing.
            </span>
          </div>
        ) : (
          <ErrorBoundary>
            {activeTab === "pulse" && (
              <ScorePulseTab
                activities={activities}
                scoreHistory={scoreHistory}
                domainBreakdown={domainBreakdown}
                currentScore={totalScore}
                chainScores={chainScores}
              />
            )}
            {activeTab === "wallets" && <WalletsTab wallets={walletsWithChains} />}
            {activeTab === "badges" && (
              <BadgesTab
                badges={badges}
                claimable={claimable}
                onClaim={claim}
                isClaiming={isClaiming}
              />
            )}
            {activeTab === "timeline" && <TimelineTab events={timeline} />}
            {activeTab === "quests" && <QuestsTab quests={quests} />}
          </ErrorBoundary>
        )}
      </ScrollableRegion>
    </>
  );

  return (
    <ErrorBoundary>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Dashboard"
          actions={
            <>
              <GhostButton href="/identity/verify" size="sm">
                <Share2
                  size={12}
                  strokeWidth={1.25}
                  style={{ marginRight: 5, verticalAlign: "middle" }}
                />
                Share Card
              </GhostButton>
              <GhostButton href="/identity/score" size="sm">
                <TrendingUp
                  size={12}
                  strokeWidth={1.25}
                  style={{ marginRight: 5, verticalAlign: "middle" }}
                />
                Simulate Score
              </GhostButton>
            </>
          }
        />
        <SplitLayout sidebarWidth="320px" sidebar={sidebar} main={main} gap="0" />
      </ViewportContainer>
      <OnboardingTour />
    </ErrorBoundary>
  );
}
