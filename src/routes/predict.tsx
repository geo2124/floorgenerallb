import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SectionTitle } from "@/components/game/Shell";
import { games } from "@/lib/game-data";
import { Gem, Zap, Flame, Crown, Brain } from "lucide-react";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Predict & Earn — The Floor General" },
      { name: "description", content: "Predict live Lebanese basketball games and build combos for XP." },
      { property: "og:title", content: "Predict & Earn — The Floor General" },
      { property: "og:description", content: "Single picks, combos, top scorers — earn XP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Predict,
});

function EarnTabs({ active }: { active: "predict" | "trivia" }) {
  return (
    <div className="mt-4 grid grid-cols-2 rounded-2xl bg-surface p-1">
      <Link to="/predict" className={`rounded-xl py-2 text-center font-display font-black uppercase ${active === "predict" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>Predict</Link>
      <Link to="/trivia" className={`rounded-xl py-2 text-center font-display font-black uppercase ${active === "trivia" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}><Brain className="mr-1 inline size-4" />Trivia</Link>
    </div>
  );
}
export { EarnTabs };

function Predict() {
  const [picks, setPicks] = useState<Record<number, 0 | 1>>({});
  const n = Object.keys(picks).length;
  const mult = n <= 1 ? 1 : n === 2 ? 2.5 : n === 3 ? 5 : 10;
  return (
    <Shell>
      <EarnTabs active="predict" />

      <SectionTitle title="Round 14 · LBL" action={`${games.length} games`} />
      <div className="space-y-2">
        {games.map((g) => (
          <div key={g.id} className="rounded-2xl border bg-surface p-3">
            <div className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${g.live ? "text-destructive" : "text-muted-foreground"}`}>{g.live && "● "}{g.time}</div>
            <div className="grid grid-cols-2 gap-2">
              {[g.home, g.away].map((team, i) => (
                <button key={team} onClick={() => setPicks((p) => (p[g.id] === i ? (({ [g.id]: _, ...r }) => r)(p) : { ...p, [g.id]: i as 0 | 1 }))}
                  className={`flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-bold transition ${picks[g.id] === i ? "border-primary bg-primary/15 text-primary" : "bg-surface-2"}`}>
                  <span>{team}</span><span className="text-xs opacity-70">x{g.odds[i]}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle title="Specials" />
      <div className="grid grid-cols-2 gap-2">
        <Special icon={<Crown />} title="Game top scorer" xp="300" />
        <Special icon={<Flame />} title="Round top scorer" xp="800" />
        <Special icon={<Zap />} title="Exact margin" xp="500" />
        <Special icon={<Crown />} title="Most assists" xp="250" />
      </div>

      {n > 0 && (
        <div className="fixed bottom-24 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 px-4 animate-rise">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-primary p-3 text-primary-foreground shadow-glow">
            <div className="flex-1">
              <div className="font-display text-lg font-black uppercase leading-none">{n > 1 ? `${n}-game combo` : "Single pick"}</div>
              <div className="text-xs font-semibold">Win {Math.round(100 * mult)} XP {n > 1 && `· x${mult} bonus`}</div>
            </div>
            <button className="flex items-center gap-1 rounded-xl bg-background px-4 py-2.5 text-sm font-black text-foreground"><Gem className="size-4 text-credit" />1 · Submit</button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Special({ icon, title, xp }: { icon: React.ReactNode; title: string; xp: string }) {
  return (
    <button className="rounded-2xl border bg-surface p-3 text-left">
      <div className="mb-3 text-xp [&>svg]:size-5">{icon}</div>
      <div className="text-sm font-bold leading-tight">{title}</div>
      <div className="mt-1 flex items-center gap-1 text-xs font-bold text-xp"><Zap className="size-3 fill-current" />+{xp}</div>
    </button>
  );
}
