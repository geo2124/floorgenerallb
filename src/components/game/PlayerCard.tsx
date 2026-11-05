import { useRef, useState, type CSSProperties } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { Rarity } from "@/lib/game-data";

type Props = { name: string; team: string; pos: string; rarity: Rarity; img: string; boosts: readonly (readonly string[])[]; owned?: boolean; selected?: boolean; small?: boolean; id?: number };

const frames: Record<Rarity, { a: string; b: string; c: string; ovr: number; label: string; serial: string }> = {
  common: { a: "var(--common)", b: "var(--surface-2)", c: "var(--common)", ovr: 72, label: "Common", serial: "" },
  rare: { a: "var(--rare)", b: "var(--accent)", c: "var(--surface-2)", ovr: 79, label: "Rare", serial: "/2000" },
  epic: { a: "var(--epic)", b: "var(--primary)", c: "var(--rare)", ovr: 86, label: "Epic", serial: "/500" },
  legend: { a: "var(--legend)", b: "var(--primary)", c: "var(--foreground)", ovr: 93, label: "Legend", serial: "/50" },
};

export function PlayerCard({ name, team, pos, rarity, img, boosts, owned = true, selected, small, id = 1 }: Props) {
  const f = frames[rarity];
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0.5, y: 0.5, on: false });
  const special = rarity !== "common";
  const [first, ...rest] = name.split(" ");

  return (
    <div
      ref={ref}
      onPointerMove={(e) => { const r = ref.current!.getBoundingClientRect(); setP({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, on: true }); }}
      onPointerLeave={() => setP({ x: 0.5, y: 0.5, on: false })}
      className={`relative transition-transform duration-200 ${owned ? "" : "opacity-40 grayscale"} ${selected ? "scale-[1.03]" : ""}`}
      style={{ perspective: "800px" }}
    >
      <div
        className={`relative rounded-[18px] p-[2px] shadow-card ${special ? "frame-animated" : ""} ${selected ? "shadow-glow" : ""}`}
        style={{ "--frame-a": f.a, "--frame-b": f.b, "--frame-c": f.c, background: special ? undefined : f.a, transform: p.on ? `rotateY(${(p.x - 0.5) * 16}deg) rotateX(${(0.5 - p.y) * 16}deg)` : undefined, transition: "transform .15s" } as CSSProperties}
      >
        <div className="relative overflow-hidden rounded-2xl bg-background">
          <img src={img} alt={name} loading="lazy" width={720} height={928} className="aspect-[3/4] w-full object-cover" />
          {/* rarity tint + vignette */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${f.a} 22%, transparent), transparent 35%, transparent 55%, var(--background) 96%)` }} />
          {/* holo foil */}
          {special && (
            <div className="pointer-events-none absolute inset-0 mix-blend-color-dodge transition-opacity"
              style={{ opacity: p.on ? 0.55 : 0.18, background: `radial-gradient(circle at ${p.x * 100}% ${p.y * 100}%, oklch(1 0 0 / .5), transparent 40%), repeating-linear-gradient(${110 + p.x * 40}deg, oklch(0.8 0.15 0 / .35) 0%, oklch(0.8 0.15 120 / .35) 6%, oklch(0.8 0.15 240 / .35) 12%, oklch(0.8 0.15 360 / .35) 18%)` }} />
          )}

          {/* OVR block */}
          <div className="absolute left-2 top-2 flex flex-col items-center rounded-xl bg-background/70 px-2 py-1 backdrop-blur-md">
            <span className="font-display text-2xl font-black leading-none" style={{ color: f.a }}>{f.ovr}</span>
            <span className="font-display text-[11px] font-black leading-none">{pos}</span>
          </div>
          <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-background" style={{ background: f.a }}>{f.label}</div>

          <div className="absolute inset-x-0 bottom-0 p-2.5">
            <div className="text-[10px] font-semibold uppercase leading-none text-muted-foreground">{first}</div>
            <div className="font-display text-lg font-black uppercase leading-none tracking-wide">{rest.join(" ") || first}</div>
            <div className="mb-1.5 mt-0.5 flex items-center justify-between text-[9px] font-bold uppercase text-muted-foreground">
              <span>{team}</span>{f.serial && <span style={{ color: f.a }}>#{String(id * 17).padStart(3, "0")}{f.serial}</span>}
            </div>
            {!small && (
              <div className="grid grid-cols-3 gap-1 border-t border-border pt-1.5">
                {boosts.map(([v, k]) => {
                  const neg = v!.startsWith("-");
                  return (
                    <div key={k} className={`flex items-center justify-center gap-0.5 rounded-md py-0.5 text-[10px] font-black ${neg ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                      {neg ? <ArrowDown className="size-2.5" strokeWidth={3} /> : <ArrowUp className="size-2.5" strokeWidth={3} />}{v!.replace(/[+-]/, "")} {k}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
