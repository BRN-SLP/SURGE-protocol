import type { WalletRole } from "@/types";

interface RoleBadgeProps {
  role: WalletRole;
}

const ROLE_CONFIG: Record<WalletRole, { label: string; color: string; bg: string }> = {
  primary: {
    label: "PRIMARY",
    color: "var(--accent)",
    bg: "rgba(220,51,51,0.08)",
  },
  security: {
    label: "SECURITY",
    color: "#22b5cc",
    bg: "rgba(34,181,204,0.08)",
  },
  regular: {
    label: "REGULAR",
    color: "var(--text-faint)",
    bg: "transparent",
  },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        border: `1px solid ${cfg.color}`,
        borderRadius: "var(--radius-sm)",
        background: cfg.bg,
        color: cfg.color,
        fontSize: "0.65rem",
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {cfg.label}
    </span>
  );
}
