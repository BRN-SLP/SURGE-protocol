"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const NAV_LINKS = [
  { label: "Identity", href: "/identity" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Drops", href: "/drops" },
  { label: "About", href: "/about" },
];

function NotificationBell() {
  return (
    <button
      title="Notifications"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-muted)",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        transition: "color 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </button>
  );
}

function ConnectButton() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address, isConnected } = useAccount();

  const label =
    isConnected && address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connect Wallet";

  const handleClick = () => {
    if (isConnected) {
      openAccountModal?.();
    } else {
      openConnectModal?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-5 py-2 text-xs font-light tracking-widest uppercase"
      style={{
        background: "var(--surface-2)",
        color: "var(--text)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {label}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();

  const resolvedLinks = NAV_LINKS;

  const isActive = (href: string) => {
    if (href === "/identity") return pathname.startsWith("/identity");
    return pathname === href;
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex h-16 items-center justify-between px-[var(--section-px)]">
        {/* Logo */}
        <Link href="/" aria-label="SURGE Protocol home" className="flex items-center">
          <span
            className="glitch-text font-display text-2xl font-light tracking-[0.25em] uppercase"
            data-text="SURGE"
            style={{ color: "var(--text)" }}
          >
            SURGE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden h-full items-center gap-8 md:flex">
          {resolvedLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex h-full items-center text-sm font-light tracking-tight uppercase transition-colors duration-0"
                style={{
                  color: active ? "var(--text)" : "rgba(245,245,245,0.5)",
                  borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderBottomColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderBottomColor = "transparent";
                    e.currentTarget.style.color = "rgba(245,245,245,0.5)";
                  }
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NotificationBell />
          <ConnectButton />
        </div>
      </div>
    </motion.header>
  );
}
