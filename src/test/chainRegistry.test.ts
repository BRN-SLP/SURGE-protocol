import { describe, it, expect } from "vitest";
import {
  CHAIN_REGISTRY,
  SURGE_IDENTITY_ADDRESSES,
  SURGE_SCORE_ADDRESSES,
  SURGE_BADGE_ADDRESSES,
  SURGE_ATTESTATION_ADDRESSES,
} from "@/lib/contracts";

const EXPECTED_CHAINS = [84532, 11155420, 1301, 4202, 4801, 763373, 919, 999999999, 1946, 11142220];
const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

describe("CHAIN_REGISTRY", () => {
  it("contains all 10 expected chains", () => {
    const registeredChains = Object.keys(CHAIN_REGISTRY).map(Number);
    for (const chainId of EXPECTED_CHAINS) {
      expect(registeredChains).toContain(chainId);
    }
  });

  it("every chain has all 4 valid contract addresses", () => {
    for (const [chainId, addrs] of Object.entries(CHAIN_REGISTRY)) {
      expect(addrs.identity, `identity missing on chain ${chainId}`).toMatch(ADDRESS_RE);
      expect(addrs.score, `score missing on chain ${chainId}`).toMatch(ADDRESS_RE);
      expect(addrs.attestation, `attestation missing on chain ${chainId}`).toMatch(ADDRESS_RE);
      expect(addrs.badge, `badge missing on chain ${chainId}`).toMatch(ADDRESS_RE);
    }
  });
});

describe("backwards-compat address maps", () => {
  it("SURGE_IDENTITY_ADDRESSES matches CHAIN_REGISTRY", () => {
    for (const [chainId, addrs] of Object.entries(CHAIN_REGISTRY)) {
      expect(SURGE_IDENTITY_ADDRESSES[Number(chainId)]).toBe(addrs.identity);
    }
  });

  it("SURGE_SCORE_ADDRESSES matches CHAIN_REGISTRY", () => {
    for (const [chainId, addrs] of Object.entries(CHAIN_REGISTRY)) {
      expect(SURGE_SCORE_ADDRESSES[Number(chainId)]).toBe(addrs.score);
    }
  });

  it("SURGE_BADGE_ADDRESSES matches CHAIN_REGISTRY", () => {
    for (const [chainId, addrs] of Object.entries(CHAIN_REGISTRY)) {
      expect(SURGE_BADGE_ADDRESSES[Number(chainId)]).toBe(addrs.badge);
    }
  });

  it("SURGE_ATTESTATION_ADDRESSES matches CHAIN_REGISTRY", () => {
    for (const [chainId, addrs] of Object.entries(CHAIN_REGISTRY)) {
      expect(SURGE_ATTESTATION_ADDRESSES[Number(chainId)]).toBe(addrs.attestation);
    }
  });
});
