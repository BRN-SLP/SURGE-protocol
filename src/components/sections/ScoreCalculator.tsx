"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  type WalletScore,
  type CombinedScore,
  getTierFromScore,
  getNextTierInfo,
  TIERS,
} from "@/types";
import { viewportOnce } from "@/lib/motion";

/* ─── Mock Scoring ─────────────────────────────────────────── */

/** Deterministic pseudo-random score from a wallet address. */
function mockWalletScore(address: string): WalletScore {
  const hex = address.toLowerCase().replace("0x", "").padEnd(40, "0");
  // Spread entropy across the address bytes
  const bytes = hex.match(/.{2}/g) ?? [];
  const seed = bytes.reduce((acc, b, i) => acc + parseInt(b, 16) * (i + 1), 0);

  const raw = seed % 7200;
  const score = 300 + raw; // 300–7499

  const defiScore = 80 + ((seed * 7) % 420);
  const governanceScore = 20 + ((seed * 13) % 280);
  const builderScore = 10 + ((seed * 19) % 190);

  return {
    address,
    score,
    tier: getTierFromScore(score),
    txCount: 40 + (seed % 460),
    chainCount: 1 + (seed % 7),
    defiScore,
    governanceScore,
    builderScore,
  };
}

function calcCombined(wallets: WalletScore[]): CombinedScore {
  const individualTotal = wallets.reduce((s, w) => s + w.score, 0);
  const linkingBonus = wallets.length >= 2 ? 500 + (wallets.length - 2) * 150 : 0;
  // Cross-chain bonus derived from unique chain counts across wallets
  const uniqueChains = new Set<string>();
  wallets.forEach((w) => {
    for (let i = 0; i < w.chainCount; i++) {
      uniqueChains.add(`${i}`);
    }
  });
  const realCrossChain = Math.max(0, uniqueChains.size - 1) * 80;

  const combinedScore = individualTotal + linkingBonus + realCrossChain;
  return {
    wallets,
    individualTotal,
    linkingBonus,
    crossChainBonus: realCrossChain,
    combinedScore,
    tier: getTierFromScore(combinedScore),
    nextTier: getNextTierInfo(combinedScore),
  };
}

/* ─── Validation ────────────────────────────────────────────── */

const ETH_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

function isValidAddress(addr: string): boolean {
  return ETH_ADDRESS_RE.test(addr);
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ─── Sub-components ────────────────────────────────────────── */

interface WalletCardProps {
  wallet: WalletScore;
  index: number;
  onRemove?: () => void;
}

function WalletCard({ wallet, index, onRemove }: WalletCardProps) {
  const tier = TIERS[wallet.tier];
  const total = wallet.defiScore + wallet.governanceScore + wallet.builderScore;
  const defiPct = Math.round((wallet.defiScore / total) * 100);
  const govPct = Math.round((wallet.governanceScore / total) * 100);
  const builderPct = Math.round((wallet.builderScore / total) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-4 rounded-2xl border bg-[#0d0d13] p-5"
      style={{ borderColor: `${tier.color}30` }}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#1c1c27] text-[#94a3b8] opacity-0 transition-colors duration-200 group-hover:opacity-100 hover:bg-[#ef4444]/10 hover:text-[#ef4444] focus-visible:opacity-100"
          aria-label={`Remove wallet ${shortenAddress(wallet.address)}`}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true">
            <path
              d="M4.5 4.5l7 7M11.5 4.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {/* Address + tier */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold"
          style={{ background: `${tier.color}20`, color: tier.color }}
        >
          {index + 1}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-mono text-sm text-[#f1f5f9]">
            {shortenAddress(wallet.address)}
          </span>
          <span className="text-xs" style={{ color: tier.color }}>
            {tier.label} · {wallet.chainCount} chain{wallet.chainCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-end justify-between">
        <span
          className="font-display text-3xl font-bold tabular-nums"
          style={{ color: tier.color }}
        >
          {wallet.score.toLocaleString()}
        </span>
        <span className="text-xs text-[#94a3b8]">{wallet.txCount} txs</span>
      </div>

      {/* Activity bars */}
      <div className="flex flex-col gap-1.5">
        {[
          { label: "DeFi", pct: defiPct },
          { label: "Gov", pct: govPct },
          { label: "Build", pct: builderPct },
        ].map((bar) => (
          <div key={bar.label} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-[10px] text-[#64748b]">{bar.label}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#1c1c27]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: tier.color }}
                initial={{ width: 0 }}
                animate={{ width: `${bar.pct}%` }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            <span className="w-7 text-right text-[10px] text-[#64748b]">{bar.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface CombinedResultCardProps {
  result: CombinedScore;
}

function CombinedResultCard({ result }: CombinedResultCardProps) {
  const tier = TIERS[result.tier];
  const progressPct = result.nextTier
    ? Math.round(
        ((result.combinedScore - tier.minScore) /
          ((tier.maxScore ?? tier.minScore + 2000) - tier.minScore)) *
          100,
      )
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, #13131a 0%, #0d0d13 100%)`,
        border: `1px solid ${tier.color}40`,
        boxShadow: `0 0 60px ${tier.glowColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: `1px solid ${tier.color}20` }}
      >
        <span className="text-xs font-semibold tracking-widest text-[#94a3b8] uppercase">
          Combined Identity Score
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: `${tier.color}20`, color: tier.color }}
        >
          {tier.label}
        </span>
      </div>

      {/* Main score */}
      <div className="flex flex-col gap-6 px-8 py-8">
        <div className="flex items-center gap-4">
          <motion.span
            className="font-display text-6xl font-bold tabular-nums"
            style={{ color: tier.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {result.combinedScore.toLocaleString()}
          </motion.span>
          <div className="flex flex-col gap-0.5 text-sm text-[#94a3b8]">
            <span className="font-semibold text-[#f1f5f9]">pts</span>
            <span>SURGE Score</span>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="flex flex-col gap-2 rounded-xl bg-[#0a0a0f] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#94a3b8]">Individual wallets</span>
            <span className="font-mono text-[#f1f5f9]">
              +{result.individualTotal.toLocaleString()}
            </span>
          </div>
          {result.linkingBonus > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#10b981]">Multi-wallet linking bonus</span>
              <span className="font-mono text-[#10b981]">
                +{result.linkingBonus.toLocaleString()}
              </span>
            </div>
          )}
          {result.crossChainBonus > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#10b981]">Cross-chain coverage bonus</span>
              <span className="font-mono text-[#10b981]">
                +{result.crossChainBonus.toLocaleString()}
              </span>
            </div>
          )}
          <div className="mt-1 h-px bg-[#1c1c27]" />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-[#f1f5f9]">Combined total</span>
            <span className="font-mono" style={{ color: tier.color }}>
              {result.combinedScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tier progress */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#94a3b8]">
            <span>{tier.label}</span>
            {result.nextTier ? (
              <span>
                {TIERS[result.nextTier.tier].label} in{" "}
                <strong className="text-[#f1f5f9]">
                  {result.nextTier.ptsNeeded.toLocaleString()} pts
                </strong>
              </span>
            ) : (
              <span className="font-semibold text-[#f59e0b]">MAX TIER</span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#1c1c27]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${tier.color}, ${tier.color}cc)` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          className="group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
          aria-label="Claim your SURGE Identity"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-opacity duration-300" />
          <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center justify-center gap-2">
            <span aria-hidden="true">◆</span>
            Claim Your SURGE Identity
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */

const MAX_WALLETS = 5;

export function ScoreCalculator() {
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<WalletScore[]>([]);
  const [result, setResult] = useState<CombinedScore | null>(null);

  const handleAdd = useCallback(() => {
    const trimmed = input.trim();
    if (!isValidAddress(trimmed)) {
      setError("Enter a valid Ethereum address (0x…)");
      return;
    }
    if (wallets.some((w) => w.address.toLowerCase() === trimmed.toLowerCase())) {
      setError("This wallet is already added");
      return;
    }
    setError(null);
    setResult(null);
    setWallets((prev) => [...prev, mockWalletScore(trimmed)]);
    setInput("");
  }, [input, wallets]);

  const handleRemove = useCallback((index: number) => {
    setWallets((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  }, []);

  const handleCalculate = useCallback(() => {
    if (wallets.length === 0) return;
    setResult(calcCombined(wallets));
  }, [wallets]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleReset = () => {
    setWallets([]);
    setResult(null);
    setInput("");
    setError(null);
  };

  return (
    <section id="score-calculator" className="relative overflow-hidden px-6 py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#8b5cf6] opacity-[0.05] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#8b5cf6] uppercase">
            Score Calculator
          </p>
          <h2 className="font-display text-4xl leading-tight font-bold text-[#f1f5f9] lg:text-5xl">
            What&apos;s your{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
              SURGE Score?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-[#94a3b8]">
            Add up to {MAX_WALLETS} wallets and see how your combined identity stacks up.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* Left: Input + wallet list */}
          <motion.div
            className="flex flex-col gap-6"
            initial={reducedMotion ? {} : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Input */}
            <div className="flex flex-col gap-3">
              <label htmlFor="wallet-input" className="text-sm font-semibold text-[#f1f5f9]">
                Wallet Address
              </label>
              <div className="flex gap-2">
                <input
                  id="wallet-input"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="0x…"
                  disabled={wallets.length >= MAX_WALLETS}
                  className="flex-1 rounded-xl border border-[#1c1c27] bg-[#13131a] px-4 py-3 font-mono text-sm text-[#f1f5f9] placeholder-[#64748b] transition-colors duration-200 focus:outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#6366f1] disabled:opacity-40"
                  aria-describedby={error ? "wallet-error" : undefined}
                  aria-invalid={!!error}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={handleAdd}
                  disabled={wallets.length >= MAX_WALLETS || !input.trim()}
                  className="shrink-0 rounded-xl bg-[#6366f1] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#8b5cf6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Add wallet"
                >
                  Add
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    id="wallet-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-[#ef4444]"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span aria-hidden="true">⚠</span>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Wallet count */}
              <p className="text-xs text-[#64748b]">
                {wallets.length}/{MAX_WALLETS} wallets added
                {wallets.length >= MAX_WALLETS && " — maximum reached"}
              </p>
            </div>

            {/* Wallet cards */}
            <div className="flex min-h-[120px] flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {wallets.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-[#1c1c27] text-sm text-[#64748b]"
                  >
                    Add a wallet to see its score
                  </motion.div>
                ) : (
                  wallets.map((w, i) => (
                    <WalletCard
                      key={w.address}
                      wallet={w}
                      index={i}
                      onRemove={() => handleRemove(i)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            {wallets.length > 0 && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={handleCalculate}
                  className="group relative flex-1 overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center gap-2">
                    <span aria-hidden="true">◆</span>
                    Calculate{wallets.length > 1 ? " Combined" : ""} Score
                  </span>
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-[#1c1c27] px-4 py-3.5 text-sm font-semibold text-[#94a3b8] transition-all duration-200 hover:border-[#6366f1]/40 hover:text-[#f1f5f9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                  aria-label="Reset calculator"
                >
                  Reset
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <CombinedResultCard key="result" result={result} />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#1c1c27] p-8 text-center"
                >
                  {/* Bespoke placeholder illustration */}
                  <svg
                    viewBox="0 0 80 80"
                    className="h-16 w-16 text-[#1c1c27]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="8"
                      y="16"
                      width="64"
                      height="48"
                      rx="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="32" cy="34" r="8" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M20 56c0-8 5.4-12 12-12s12 4.5 12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M52 34h16M52 42h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-[#64748b]">Your score appears here</p>
                    <p className="max-w-xs text-xs text-[#64748b]/60">
                      Add a wallet and click Calculate to see your SURGE identity score.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
