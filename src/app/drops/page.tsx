"use client";
import { Navbar } from "@/components/layout/Navbar";
import { DropsHub } from "@/components/sections/DropsHub";
import { BorderVariantProvider } from "@/components/providers/BorderVariantProvider";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function DropsPage() {
  return (
    <ErrorBoundary>
      <BorderVariantProvider>
        <Navbar />
        <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
          <CompactHeader
            title="Drops Hub"
            subtitle="Exclusive opportunities for SURGE Identity holders"
          />
          <DropsHub />
        </ViewportContainer>
      </BorderVariantProvider>
    </ErrorBoundary>
  );
}
