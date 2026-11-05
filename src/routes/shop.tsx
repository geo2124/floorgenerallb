import { createFileRoute } from "@tanstack/react-router";
import { Shell, SectionTitle } from "@/components/game/Shell";
import { Gem, Gift, Timer, Play, Sparkles } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — The Floor General" },
      { name: "description", content: "Get credits, card packs and training boosts." },
      { property: "og:title", content: "Shop — The Floor General" },
      { property: "og:description", content: "Credits, card packs and boosts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <Shell>
      <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-gold p-5 text-primary-foreground shine">
        <div className="text-xs font-black uppercase tracking-widest">Limited · 23h left</div>
        <div className="font-display text-4xl font-black uppercase leading-none">Legend pack</div>
        <div className="mb-4 text-sm font-semibold">Guaranteed Epic+ card · 10 cards</div>
        <button className="rounded-xl bg-background px-5 py-2.5 font-display font-black uppercase text-foreground">$4.99</button>
      </div>

      <SectionTitle title="Credits" action="Free: 1 every 2h" />
      <div className="grid grid-cols-3 gap-2">
        {[["5", "$0.99"], ["15", "$2.49"], ["40", "$5.99"]].map(([n, p], i) => (
          <button key={n} className={`relative rounded-2xl border bg-surface p-3 text-center ${i === 2 ? "border-primary" : ""}`}>
            {i === 2 && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 text-[9px] font-black uppercase text-primary-foreground">Best</span>}
            <Gem className="mx-auto mb-1 size-7 text-credit" />
            <div className="font-display text-2xl font-black">{n}</div>
            <div className="text-xs font-bold text-muted-foreground">{p}</div>
          </button>
        ))}
      </div>
      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-3 text-sm font-bold text-accent"><Play className="size-4 fill-current" />Watch an ad · +1 credit</button>

      <SectionTitle title="Card packs" />
      {[["Starter pack", "5 cards", "$0.99"], ["Pro pack", "8 cards · 1 Rare+", "$1.99"], ["Club pack", "12 cards · coaches", "$2.99"]].map(([n, d, p]) => (
        <div key={n} className="mb-2 flex items-center gap-3 rounded-2xl border bg-surface p-3">
          <Gift className="size-8 text-primary" />
          <div className="flex-1"><div className="font-bold">{n}</div><div className="text-xs text-muted-foreground">{d}</div></div>
          <button className="rounded-xl bg-primary px-3 py-2 text-xs font-black text-primary-foreground">{p}</button>
        </div>
      ))}

      <SectionTitle title="Training boosts" />
      <div className="grid grid-cols-2 gap-2">
        {[["−1 hour", "$0.49"], ["Finish all", "$1.99"]].map(([n, p]) => (
          <button key={n} className="rounded-2xl border bg-surface p-4 text-left">
            <Timer className="mb-3 size-6 text-accent" />
            <div className="font-bold">{n}</div><div className="text-xs text-muted-foreground">{p}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="size-3.5" />Purchases are mock in this prototype.</div>
    </Shell>
  );
}
