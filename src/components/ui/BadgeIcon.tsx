import {
  Zap,
  Link2,
  Diamond,
  ShieldCheck,
  Sparkles,
  Code2,
  Wallet,
  Globe,
  Star,
  Award,
  Flame,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  zap: Zap,
  link2: Link2,
  diamond: Diamond,
  shieldcheck: ShieldCheck,
  sparkles: Sparkles,
  code2: Code2,
  wallet: Wallet,
  globe: Globe,
  star: Star,
  award: Award,
  flame: Flame,
};

interface BadgeIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function BadgeIcon({ name, size = 28, color = "currentColor" }: BadgeIconProps) {
  const Icon = ICON_MAP[name.toLowerCase()] ?? Star;
  return <Icon size={size} color={color} strokeWidth={1.25} />;
}
