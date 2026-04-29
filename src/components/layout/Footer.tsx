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
      className="flex flex-col items-center justify-between gap-4 md:flex-row"
      style={{
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div
        className="text-[11px] font-light tracking-widest uppercase"
        style={{ color: "var(--text-faint)" }}
      >
        © {new Date().getFullYear()} SURGE PROTOCOL. ALL RIGHTS RESERVED.
      </div>

      <nav aria-label="Footer navigation" className="flex gap-6">
        {FOOTER_LINKS.map((link) => (
          <span
            key={link.label}
            aria-label={`${link.label} (coming soon)`}
            className="cursor-not-allowed text-[11px] font-light tracking-widest uppercase"
            style={{ color: "var(--text-faint)" }}
          >
            {link.label}
          </span>
        ))}
      </nav>
    </footer>
  );
}
