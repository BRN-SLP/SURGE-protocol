"use client";

import { createContext, useContext, useRef } from "react";
import { type BorderVariant, assignVariants } from "@/lib/border-variants";

interface BorderVariantContextValue {
  getVariant: (blockId: string) => BorderVariant;
}

const BorderVariantContext = createContext<BorderVariantContextValue>({
  getVariant: () => "cw-tl",
});

export function useBorderVariant(blockId: string): BorderVariant {
  return useContext(BorderVariantContext).getVariant(blockId);
}

// Pool of variant sequences regenerated on each page load
const BLOCK_IDS = [
  "hero-cta-1",
  "hero-cta-2",
  "problem-1",
  "problem-2",
  "problem-3",
  "hiw-1",
  "hiw-2",
  "hiw-3",
  "hiw-4",
  "calc-wallet",
  "calc-result",
  "cta-email",
  "navbar-connect",
];

export function BorderVariantProvider({ children }: { children: React.ReactNode }) {
  // Assign once per mount (page load / navigation)
  const mapRef = useRef<Map<string, BorderVariant> | null>(null);

  if (mapRef.current === null) {
    const variants = assignVariants(BLOCK_IDS.length);
    const map = new Map<string, BorderVariant>();
    BLOCK_IDS.forEach((id, i) => map.set(id, variants[i]));
    mapRef.current = map;
  }

  const getVariant = (blockId: string): BorderVariant => {
    return mapRef.current!.get(blockId) ?? "cw-tl";
  };

  return (
    <BorderVariantContext.Provider value={{ getVariant }}>{children}</BorderVariantContext.Provider>
  );
}
