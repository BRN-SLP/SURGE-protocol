"use client";

const FOOTER_LINKS = [
  { label: "Legal", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Docs", href: "#" },
];

export function Footer() {
  return (
    <footer
      className="flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {/* Copyright */}
      <div
        className="text-[11px] font-light tracking-widest uppercase"
        style={{ color: "rgba(245,245,245,0.35)" }}
      >
        © 2024 SURGE PROTOCOL. ALL RIGHTS RESERVED.
      </div>

      {/* Links */}
      <nav aria-label="Footer navigation" className="flex gap-6">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[11px] font-light tracking-widest uppercase transition-colors duration-0"
            style={{ color: "rgba(245,245,245,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,245,0.35)")}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
