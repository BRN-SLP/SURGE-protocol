import type { WalletStatus } from "@/types";

interface StatusDotProps {
  status: WalletStatus;
  size?: number;
}

const STATUS_COLORS: Record<WalletStatus, string> = {
  active: "#22aa66",
  pending: "#f0aa20",
  frozen: "#4d8eff",
  compromised: "#dc3333",
};

export function StatusDot({ status, size = 8 }: StatusDotProps) {
  return (
    <span
      title={status}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: STATUS_COLORS[status],
        flexShrink: 0,
      }}
    />
  );
}
