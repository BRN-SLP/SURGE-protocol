"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg text-[#6366f1]">◆</span>
          <span className="font-display text-lg font-bold tracking-tight text-[#f1f5f9]">
            SURGE
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {["Protocol", "Leaderboard", "Drops", "Docs"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-[#94a3b8] transition-colors duration-200 hover:text-[#f1f5f9]"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button className="group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#06b6d4] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            <span>◆</span>
            Connect Wallet
          </span>
        </button>
      </div>
    </motion.header>
  );
}
