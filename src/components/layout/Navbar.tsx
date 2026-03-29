"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SurgeLogo } from "@/components/ui/SurgeLogo";

const NAV_LINKS = [
  { label: "Identity", href: "#", active: true },
  { label: "Leaderboard", href: "#", active: false },
  { label: "Drops", href: "#", active: false },
  { label: "About", href: "#", active: false },
];

export function Navbar() {
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
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" aria-label="SURGE Protocol home" className="flex items-center">
          <span style={{ color: "var(--text)" }}>
            <SurgeLogo size={28} />
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden h-full items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex h-full items-center text-sm font-light tracking-tight uppercase transition-colors duration-0"
              style={{
                color: link.active ? "var(--text)" : "rgba(245,245,245,0.5)",
                borderBottom: link.active ? "1px solid var(--accent)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!link.active) {
                  e.currentTarget.style.borderBottomColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!link.active) {
                  e.currentTarget.style.borderBottomColor = "transparent";
                  e.currentTarget.style.color = "rgba(245,245,245,0.5)";
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Connect Wallet */}
        <button
          className="px-5 py-2 text-xs font-light tracking-widest uppercase transition-colors duration-0"
          style={{
            background: "var(--surface-2)",
            color: "var(--text)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
        >
          Connect Wallet
        </button>
      </div>
    </motion.header>
  );
}
