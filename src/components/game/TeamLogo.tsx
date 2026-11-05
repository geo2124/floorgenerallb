import { Flame, Crown, Zap, TreePine, Bird, Star, Mountain, Swords, Skull, Anchor, Shield, Target, Rocket, Ghost, Cat, Dog, Fish, Sun, Moon, Bolt, Trophy, Hexagon, Wind, Castle } from "lucide-react";

export const logoShapes = ["shield", "circle", "hex", "diamond", "crest", "badge"] as const;
export const logoPatterns = ["none", "stripes", "split", "chevron", "sash", "halftone"] as const;
export const logoBorders = ["none", "single", "double", "thick"] as const;
export const logoFonts = { block: "Big Shoulders Display, sans-serif", serif: "Georgia, serif", mono: "ui-monospace, monospace" } as const;
export const logoIcons = { flame: Flame, crown: Crown, zap: Zap, cedar: TreePine, eagle: Bird, star: Star, peak: Mountain, swords: Swords, skull: Skull, anchor: Anchor, shield: Shield, target: Target, rocket: Rocket, ghost: Ghost, panther: Cat, wolf: Dog, shark: Fish, sun: Sun, moon: Moon, bolt: Bolt, trophy: Trophy, hex: Hexagon, wind: Wind, castle: Castle } as const;
// Team-chosen brand colors (user data, not UI theme)
export const logoColors = ["#ff6a1a", "#e11d2a", "#f5c542", "#22c55e", "#0ea5e9", "#2563eb", "#a855f7", "#f8fafc", "#111111", "#0f3d2e", "#7c2d12", "#64748b"];

export type LogoSpec = {
  shape: (typeof logoShapes)[number]; icon: keyof typeof logoIcons; primary: string; secondary: string; initials: string;
  accent?: string; pattern?: (typeof logoPatterns)[number]; border?: (typeof logoBorders)[number];
  iconScale?: number; iconRotate?: number; font?: keyof typeof logoFonts; gradient?: boolean; arcText?: string;
};

const paths: Record<LogoSpec["shape"], string> = {
  shield: "M50 4 L92 18 V50 C92 74 72 90 50 98 C28 90 8 74 8 50 V18 Z",
  circle: "M50 4 A46 46 0 1 1 49.9 4 Z",
  hex: "M50 3 L93 27 V73 L50 97 L7 73 V27 Z",
  diamond: "M50 2 L98 50 L50 98 L2 50 Z",
  crest: "M10 8 H90 V48 C90 72 70 88 50 97 C30 88 10 72 10 48 Z M10 8 L30 2 L50 8 L70 2 L90 8",
  badge: "M50 3 L61 14 L77 11 L80 27 L95 35 L88 50 L95 65 L80 73 L77 89 L61 86 L50 97 L39 86 L23 89 L20 73 L5 65 L12 50 L5 35 L20 27 L23 11 L39 14 Z",
};

let uid = 0;
export function TeamLogo({ spec, size = 64 }: { spec: LogoSpec; size?: number }) {
  const s = { accent: spec.secondary, pattern: "none", border: "single", iconScale: 100, iconRotate: 0, font: "block", gradient: true, arcText: "", ...spec } as Required<LogoSpec>;
  const Icon = logoIcons[s.icon];
  const id = `tl${(uid = (uid + 1) % 1e6)}${size}`;
  const iconSize = 42 * (s.iconScale / 100);
  const iconY = (s.initials ? 44 : 50) + (s.arcText ? 4 : 0);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={s.primary} />
          <stop offset="1" stopColor={s.primary} stopOpacity={s.gradient ? 0.62 : 1} />
        </linearGradient>
        <clipPath id={`${id}c`}><path d={paths[s.shape]} transform="translate(50 50) scale(0.86) translate(-50 -50)" /></clipPath>
        <pattern id={`${id}h`} width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.1" fill={s.accent} opacity=".45" /></pattern>
        <path id={`${id}arc`} d="M18 52 A32 32 0 0 1 82 52" />
      </defs>
      {s.border !== "none" && <path d={paths[s.shape]} fill={s.secondary} />}
      <path d={paths[s.shape]} fill={`url(#${id}g)`} transform={s.border === "none" ? undefined : `translate(50 50) scale(${s.border === "thick" ? 0.82 : 0.88}) translate(-50 -50)`} />
      <g clipPath={`url(#${id}c)`} opacity=".55">
        {s.pattern === "stripes" && [20, 40, 60, 80].map((x) => <rect key={x} x={x - 4} y="0" width="8" height="100" fill={s.accent} />)}
        {s.pattern === "split" && <rect x="50" y="0" width="50" height="100" fill={s.accent} />}
        {s.pattern === "chevron" && <path d="M0 55 L50 80 L100 55 V72 L50 97 L0 72 Z" fill={s.accent} />}
        {s.pattern === "sash" && <path d="M-10 20 L20 -10 L110 80 L80 110 Z" fill={s.accent} />}
        {s.pattern === "halftone" && <rect width="100" height="100" fill={`url(#${id}h)`} />}
      </g>
      {s.border === "double" && <path d={paths[s.shape]} fill="none" stroke={s.secondary} strokeWidth="1.6" transform="translate(50 50) scale(0.76) translate(-50 -50)" />}
      {s.border !== "none" && <path d={paths[s.shape]} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1" transform="translate(50 50) scale(0.8) translate(-50 -50)" />}
      {s.arcText && (
        <text fontFamily={logoFonts[s.font]} fontWeight="900" fontSize="9" fill={s.secondary} letterSpacing="1.5" textAnchor="middle">
          <textPath href={`#${id}arc`} startOffset="50%">{s.arcText.toUpperCase().slice(0, 16)}</textPath>
        </text>
      )}
      <g transform={`translate(50 ${iconY}) rotate(${s.iconRotate})`}>
        <foreignObject x={-iconSize / 2} y={-iconSize / 2} width={iconSize} height={iconSize}>
          <Icon style={{ width: "100%", height: "100%", color: s.secondary }} strokeWidth={2.2} />
        </foreignObject>
      </g>
      {s.initials && (
        <text x="50" y="82" textAnchor="middle" fontFamily={logoFonts[s.font]} fontWeight="900" fontSize="17" fill={s.secondary} letterSpacing="1" stroke={s.primary} strokeWidth=".4">
          {s.initials.slice(0, 3).toUpperCase()}
        </text>
      )}
    </svg>
  );
}
