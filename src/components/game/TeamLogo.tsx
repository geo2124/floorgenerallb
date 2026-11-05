import { Flame, Crown, Zap, TreePine, Bird, Star, Mountain, Swords, Skull, Anchor } from "lucide-react";

export const logoShapes = ["shield", "circle", "hex", "diamond"] as const;
export const logoIcons = { flame: Flame, crown: Crown, zap: Zap, cedar: TreePine, eagle: Bird, star: Star, peak: Mountain, swords: Swords, skull: Skull, anchor: Anchor } as const;
// Team-chosen brand colors (user data, not UI theme)
export const logoColors = ["#ff6a1a", "#e11d2a", "#f5c542", "#22c55e", "#0ea5e9", "#2563eb", "#a855f7", "#f8fafc", "#111111", "#0f3d2e"];

export type LogoSpec = { shape: (typeof logoShapes)[number]; icon: keyof typeof logoIcons; primary: string; secondary: string; initials: string };

const paths: Record<LogoSpec["shape"], string> = {
  shield: "M50 4 L92 18 V50 C92 74 72 90 50 98 C28 90 8 74 8 50 V18 Z",
  circle: "M50 4 A46 46 0 1 1 49.9 4 Z",
  hex: "M50 3 L93 27 V73 L50 97 L7 73 V27 Z",
  diamond: "M50 2 L98 50 L50 98 L2 50 Z",
};

export function TeamLogo({ spec, size = 64 }: { spec: LogoSpec; size?: number }) {
  const Icon = logoIcons[spec.icon];
  const id = `g${spec.primary.slice(1)}${spec.shape}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={spec.primary} />
          <stop offset="1" stopColor={spec.primary} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d={paths[spec.shape]} fill={spec.secondary} />
      <path d={paths[spec.shape]} fill={`url(#${id})`} transform="translate(50 50) scale(0.86) translate(-50 -50)" />
      <path d={paths[spec.shape]} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" transform="translate(50 50) scale(0.78) translate(-50 -50)" />
      <foreignObject x="28" y={spec.initials ? 18 : 28} width="44" height="44">
        <Icon style={{ width: "100%", height: "100%", color: spec.secondary }} strokeWidth={2.2} />
      </foreignObject>
      {spec.initials && (
        <text x="50" y="80" textAnchor="middle" fontFamily="Big Shoulders Display, sans-serif" fontWeight="900" fontSize="18" fill={spec.secondary} letterSpacing="1">
          {spec.initials.slice(0, 3).toUpperCase()}
        </text>
      )}
    </svg>
  );
}
