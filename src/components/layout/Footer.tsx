export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1c1c27] px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg text-[#6366f1]" aria-hidden="true">
            ◆
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[#f1f5f9]">
            SURGE
          </span>
          <span className="ml-2 text-sm text-[#64748b]">Protocol</span>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation" className="flex items-center gap-6">
          {[
            { label: "Protocol", href: "#" },
            { label: "Docs", href: "#" },
            { label: "GitHub", href: "#" },
            { label: "Twitter", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#94a3b8] transition-colors duration-200 hover:text-[#f1f5f9]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Legal */}
        <p className="text-xs text-[#64748b]">
          © {currentYear} SURGE Protocol · Built on Optimism Superchain
        </p>
      </div>
    </footer>
  );
}
