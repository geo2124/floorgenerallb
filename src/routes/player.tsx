import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SectionTitle, Bar } from "@/components/game/Shell";
import { Avatar } from "@/components/game/Avatar";
import { Locker } from "@/components/game/Locker";
import { attributes } from "@/lib/game-data";
import { Clock, Zap, Play, Gem, X, Shirt } from "lucide-react";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "My Player — The Floor General" },
      { name: "description", content: "Upgrade your player's attributes with XP." },
      { property: "og:title", content: "My Player — The Floor General" },
      { property: "og:description", content: "Spend XP to train shooting, handling, speed and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayerPage,
});

function PlayerPage() {
  const [sel, setSel] = useState<(typeof attributes)[number] | null>(null);
  const [locker, setLocker] = useState(false);
  return (
    <Shell>
      <Avatar className="-mx-4 h-[520px]" priority>
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Point Guard</div>
              <div className="font-display text-7xl font-black leading-none text-gradient-gold">78</div>
              <div className="text-[10px] font-semibold uppercase text-muted-foreground">Overall</div>
            </div>
            <div className="space-y-1.5">
              {attributes.slice(0, 4).map((a) => (
                <div key={a.key} className="glass flex w-20 items-center justify-between rounded-lg border px-2 py-1 text-[11px] font-bold">
                  <span className="text-muted-foreground">{a.key}</span><span>{a.level}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex gap-1.5 text-[11px] font-bold">
              {["6'3\"", "190 lb", "24"].map((t) => <span key={t} className="glass rounded-full border px-2 py-1">{t}</span>)}
            </div>
            <button onClick={() => setLocker(true)} className="flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2.5 font-display text-sm font-black uppercase text-primary-foreground shadow-glow">
              <Shirt className="size-4" />Customize
            </button>
          </div>
        </div>
      </Avatar>
      {locker && <Locker onClose={() => setLocker(false)} />}

      <div className="mt-2 rounded-2xl border border-primary/40 bg-primary/10 p-3">
        <div className="flex items-center justify-between text-sm font-bold"><span>Training · 3PT → 74</span><span className="flex items-center gap-1 text-primary"><Clock className="size-3.5" />1h 24m</span></div>
        <div className="my-2"><Bar value={38} /></div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-surface-2 py-2 text-xs font-bold"><Play className="mr-1 inline size-3 fill-current" />Watch ad −15m</button>
          <button className="flex-1 rounded-xl bg-accent py-2 text-xs font-bold text-accent-foreground">Finish now · $0.99</button>
        </div>
      </div>

      <SectionTitle title="Attributes" action="1 slot free" />
      <div className="space-y-2">
        {attributes.map((a) => (
          <button key={a.key} onClick={() => setSel(a)} className="flex w-full items-center gap-3 rounded-2xl border bg-surface p-3 text-left transition active:scale-[0.98]">
            <div className="w-10 font-display text-3xl font-black">{a.level}</div>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-bold"><span>{a.name}</span><span className="text-[10px] uppercase text-muted-foreground">{a.group}</span></div>
              <div className="mt-1.5"><Bar value={(a.level / a.max) * 100} className={a.level > 80 ? "bg-gradient-gold" : a.level > 60 ? "bg-gradient-primary" : "bg-accent"} /></div>
            </div>
            <span className="flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-1 text-xs font-bold"><Zap className="size-3 fill-xp text-xp" />{a.cost}</span>
          </button>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm" onClick={() => setSel(null)}>
          <div className="w-full max-w-[440px] animate-rise rounded-t-3xl border bg-surface p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-primary">{sel.group}</div>
                <div className="font-display text-3xl font-black uppercase">{sel.name}</div>
              </div>
              <button onClick={() => setSel(null)} className="rounded-full bg-surface-2 p-2"><X className="size-4" /></button>
            </div>
            <div className="my-6 flex items-center justify-center gap-6">
              <div className="text-center"><div className="font-display text-6xl font-black text-muted-foreground">{sel.level}</div><div className="text-xs">Now</div></div>
              <div className="text-3xl text-primary">→</div>
              <div className="text-center"><div className="font-display text-6xl font-black text-gradient-gold">{sel.next}</div><div className="text-xs">After</div></div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-surface-2 p-3"><Zap className="mx-auto size-4 fill-xp text-xp" /><div className="font-bold">{sel.cost} XP</div></div>
              <div className="rounded-xl bg-surface-2 p-3"><Clock className="mx-auto size-4 text-accent" /><div className="font-bold">{sel.time}</div></div>
            </div>
            <button onClick={() => setSel(null)} className="w-full rounded-2xl bg-gradient-primary py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-glow">Start training</button>
            <button className="mt-2 flex w-full items-center justify-center gap-1 py-2 text-xs font-semibold text-muted-foreground"><Gem className="size-3 text-credit" />Instant with gems</button>
          </div>
        </div>
      )}
    </Shell>
  );
}
