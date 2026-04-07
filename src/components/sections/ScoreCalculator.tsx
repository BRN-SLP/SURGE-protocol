"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import {
  type WalletScore,
  type CombinedScore,
  getTierFromScore,
  getNextTierInfo,
  TIERS,
} from "@/types";
import { viewportOnce } from "@/lib/motion";

/* ─── Mock Scoring ─────────────────────────────────────────── */

function mockWalletScore(address: string): WalletScore {
  const hex = address.toLowerCase().replace("0x", "").padEnd(40, "0");
  const bytes = hex.match(/.{2}/g) ?? [];
  const seed = bytes.reduce((acc, b, i) => acc + parseInt(b, 16) * (i + 1), 0);
  const raw = seed % 7200;
  const score = 300 + raw;
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
  const uniqueChains = new Set<string>();
  wallets.forEach((w) => {
    for (let i = 0; i < w.chainCount; i++) uniqueChains.add(`${i}`);
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
function isValidAddress(addr: string) {
  return ETH_ADDRESS_RE.test(addr);
}
function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ─── WalletCard ────────────────────────────────────────────── */

interface WalletCardProps {
  wallet: WalletScore;
  index: number;
  onRemove?: () => void;
}

const SCRAMBLE_CHARS = "0123456789ABCDEF";

function WalletCard({ wallet, index, onRemove }: WalletCardProps) {
  const tier = TIERS[wallet.tier];
  const total = wallet.defiScore + wallet.governanceScore + wallet.builderScore;
  const defiPct = Math.round((wallet.defiScore / total) * 100);
  const govPct = Math.round((wallet.governanceScore / total) * 100);
  const builderPct = Math.round((wallet.builderScore / total) * 100);
  const targetAddr = shortenAddress(wallet.address);
  const [displayAddr, setDisplayAddr] = useState(targetAddr);

  useEffect(() => {
    let iter = 0;
    const start = requestAnimationFrame(() => setDisplayAddr(targetAddr));
    const interval = setInterval(() => {
      setDisplayAddr(
        targetAddr
          .split("")
          .map((c, i) => {
            if (i < iter) return c;
            if (c === "…" || c === "x") return c;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join(""),
      );
      iter += 0.4;
      if (iter >= targetAddr.length) {
        clearInterval(interval);
        setDisplayAddr(targetAddr);
      }
    }, 40);
    return () => {
      cancelAnimationFrame(start);
      clearInterval(interval);
    };
  }, [wallet.address, targetAddr]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-4 p-5"
      style={{
        border: `1px solid ${tier.color}30`,
        borderRadius: "var(--radius-md)",
      }}
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center opacity-0 transition-colors duration-200 group-hover:opacity-100 focus-visible:opacity-100"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
          }}
          aria-label={`Remove wallet ${shortenAddress(wallet.address)}`}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
            <path
              d="M4.5 4.5l7 7M11.5 4.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center font-mono text-xs font-light"
          style={{
            background: `${tier.color}20`,
            color: tier.color,
            borderRadius: "var(--radius-sm)",
          }}
        >
          {index + 1}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-mono text-sm" style={{ color: "var(--text)" }}>
            {displayAddr}
          </span>
          <span className="text-xs" style={{ color: tier.color }}>
            {tier.label} · {wallet.chainCount} chain{wallet.chainCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span
          className="font-display text-3xl font-light tabular-nums"
          style={{ color: tier.color }}
        >
          {wallet.score.toLocaleString()}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {wallet.txCount} txs
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {[
          { label: "DeFi", pct: defiPct },
          { label: "Gov", pct: govPct },
          { label: "Build", pct: builderPct },
        ].map((bar) => (
          <div key={bar.label} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-[10px]" style={{ color: "var(--text-muted)" }}>
              {bar.label}
            </span>
            <div
              className="h-1 flex-1 overflow-hidden"
              style={{ background: "var(--border)", borderRadius: "99px" }}
            >
              <motion.div
                className="h-full"
                style={{ background: tier.color, borderRadius: "99px" }}
                initial={{ width: 0 }}
                animate={{ width: `${bar.pct}%` }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            <span className="w-7 text-right text-[10px]" style={{ color: "var(--text-muted)" }}>
              {bar.pct}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── CombinedResultCard ─────────────────────────────────────── */

function CombinedResultCard({ result }: { result: CombinedScore }) {
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
      className="relative overflow-hidden"
      style={{
        border: `1px solid ${tier.color}40`,
        borderRadius: "var(--radius-md)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${tier.color}20` }}
      >
        <span
          className="text-xs font-light tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Combined Identity Score
        </span>
        <span
          className="px-2.5 py-1 text-xs font-light"
          style={{
            background: `${tier.color}20`,
            color: tier.color,
            borderRadius: "var(--radius-sm)",
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Main score */}
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex items-center gap-4">
          <motion.span
            className="font-display text-6xl font-light tabular-nums"
            style={{ color: tier.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {result.combinedScore.toLocaleString()}
          </motion.span>
          <div className="flex flex-col gap-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="font-light" style={{ color: "var(--text)" }}>
              pts
            </span>
            <span>SURGE Score</span>
          </div>
        </div>

        {/* Score breakdown — border only, no bg */}
        <div
          className="flex flex-col gap-2 p-4"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-muted)" }}>Individual wallets</span>
            <span className="font-mono" style={{ color: "var(--text)" }}>
              +{result.individualTotal.toLocaleString()}
            </span>
          </div>
          {result.linkingBonus > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--success)" }}>Multi-wallet linking bonus</span>
              <span className="font-mono" style={{ color: "var(--success)" }}>
                +{result.linkingBonus.toLocaleString()}
              </span>
            </div>
          )}
          {result.crossChainBonus > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--success)" }}>Cross-chain coverage bonus</span>
              <span className="font-mono" style={{ color: "var(--success)" }}>
                +{result.crossChainBonus.toLocaleString()}
              </span>
            </div>
          )}
          <div className="mt-1 h-px" style={{ background: "var(--border)" }} />
          <div className="flex items-center justify-between text-sm font-light">
            <span style={{ color: "var(--text)" }}>Combined total</span>
            <span className="font-mono" style={{ color: tier.color }}>
              {result.combinedScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tier progress */}
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center justify-between text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <span>{tier.label}</span>
            {result.nextTier ? (
              <span>
                {TIERS[result.nextTier.tier].label} in{" "}
                <strong style={{ color: "var(--text)" }}>
                  {result.nextTier.ptsNeeded.toLocaleString()} pts
                </strong>
              </span>
            ) : (
              <span className="font-light" style={{ color: tier.color }}>
                MAX TIER
              </span>
            )}
          </div>
          <div
            className="h-1.5 overflow-hidden"
            style={{ background: "var(--border)", borderRadius: "99px" }}
          >
            <motion.div
              className="h-full"
              style={{ background: tier.color, borderRadius: "99px" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full px-6 py-3.5 text-sm font-light text-white transition-colors duration-150 focus:outline-none"
          style={{
            background: "var(--accent)",
            borderRadius: "var(--radius-sm)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          aria-label="Claim your SURGE Identity"
        >
          Claim Your SURGE Identity
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
    <section
      id="score-calculator"
      style={{
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
        paddingTop: "clamp(2.5rem, 5vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
      }}
    >
      <div>
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
        >
          <p
            className="mb-4 text-xs font-light tracking-[0.2em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Score Calculator
          </p>
          <h2
            className="font-display text-4xl leading-tight font-light lg:text-5xl"
            style={{ color: "var(--text)" }}
          >
            What&apos;s your <span style={{ color: "var(--accent)" }}>SURGE Score?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg" style={{ color: "var(--text-muted)" }}>
            Add up to {MAX_WALLETS} wallets and see how your combined identity stacks up.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-[var(--block-gap)] lg:grid-cols-2">
          {/* Left: Input + wallet list */}
          <motion.div
            className="flex flex-col gap-6"
            initial={reducedMotion ? {} : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-3">
              <label
                htmlFor="wallet-input"
                className="text-sm font-light"
                style={{ color: "var(--text)" }}
              >
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
                  className="min-w-0 flex-1 px-4 py-3 font-mono text-sm focus:outline-none disabled:opacity-40"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text)",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  aria-describedby={error ? "wallet-error" : undefined}
                  aria-invalid={!!error}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={handleAdd}
                  disabled={wallets.length >= MAX_WALLETS || !input.trim()}
                  className="shrink-0 px-4 py-3 text-sm font-light text-white transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: "var(--accent)",
                    borderRadius: "var(--radius-sm)",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.background = "var(--accent-hover)";
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
                  aria-label="Add wallet"
                >
                  Add
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    id="wallet-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--accent)" }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertTriangle
                      size={13}
                      strokeWidth={1.25}
                      aria-hidden="true"
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                {wallets.length}/{MAX_WALLETS} wallets added
                {wallets.length >= MAX_WALLETS && " — maximum reached"}
              </p>
            </div>

            <div className="flex min-h-[120px] flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {wallets.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-28 items-center justify-center border border-dashed text-sm"
                    style={{
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-muted)",
                    }}
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

            {wallets.length > 0 && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={handleCalculate}
                  className="flex-1 py-3.5 text-sm font-light text-white transition-colors duration-150 focus:outline-none"
                  style={{
                    background: "var(--accent)",
                    borderRadius: "var(--radius-sm)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
                >
                  Calculate{wallets.length > 1 ? " Combined" : ""} Score
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3.5 text-sm font-light transition-all duration-200 focus:outline-none"
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
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
                  className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 border border-dashed p-8 text-center"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <svg
                    viewBox="0 0 80 80"
                    className="h-16 w-16"
                    style={{ color: "var(--border-hover)" }}
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="8"
                      y="16"
                      width="64"
                      height="48"
                      rx="8"
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
                    <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                      Your score appears here
                    </p>
                    <p className="max-w-xs text-xs" style={{ color: "var(--text-faint)" }}>
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
