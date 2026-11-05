import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SectionTitle, Bar } from "@/components/game/Shell";
import { PlayerCard } from "@/components/game/PlayerCard";
import { cards, teams } from "@/lib/game-data";
import { Download, Gift, Trophy, X } from "lucide-react";

export const Route = createFileRoute("/album")({
  head: () => ({
    meta: [
      { title: "Album — The Floor General" },
      { name: "description", content: "Collect every Lebanese league player and coach card. Complete the album to enter the grand draw." },
      { property: "og:title", content: "Album — The Floor General" },
      { property: "og:description", content: "Unpack daily cards and complete the album." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Album,
});

function Album() {
  const [open, setOpen] = useState(false);
  const total = teams.reduce((s, t) => s + t.total, 0);
  const have = teams.reduce((s, t) => s + t.have, 0);
  return (
    <Shell>
      <div className="mt-4 overflow-hidden rounded-3xl border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-muted-foreground">Season 2026 album</div>
            <div className="font-display text-4xl font-black">{have}<span className="text-muted-foreground">/{total}</span></div>
          </div>
          <Trophy className="size-12 text-xp" />
        </div>
        <div className="my-3"><Bar value={(have / total) * 100} className="bg-gradient-gold" /></div>
        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-surface-2 py-2.5 text-xs font-bold"><Download className="size-4" />PDF</button>
          <button disabled className="flex-1 rounded-xl bg-surface-2 py-2.5 text-xs font-bold text-muted-foreground">Grand draw · locked</button>
        </div>
      </div>

      <button onClick={() => setOpen(true)} className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-gold p-4 text-primary-foreground shine">
        <Gift className="size-8" />
        <div className="flex-1 text-left"><div className="font-display text-xl font-black uppercase leading-none">Open daily pack</div><div className="text-xs font-semibold">5 cards · free today</div></div>
        <span className="rounded-lg bg-background/20 px-2 py-1 text-xs font-black">1 / 1</span>
      </button>

      <SectionTitle title="Teams" />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {teams.map((t, i) => (
          <div key={t.name} className={`min-w-28 rounded-2xl border p-3 ${i === 0 ? "border-primary bg-primary/10" : "bg-surface"}`}>
            <div className="text-sm font-bold">{t.name}</div>
            <div className="mb-1.5 text-xs text-muted-foreground">{t.have}/{t.total}</div>
            <Bar value={(t.have / t.total) * 100} />
          </div>
        ))}
      </div>

      <SectionTitle title="My cards" action="Sort: rarity" />
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => <PlayerCard key={c.id} {...c} />)}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[440px] p-5">
            <button className="absolute right-5 top-5 rounded-full bg-surface p-2"><X className="size-4" /></button>
            <div className="mb-6 text-center font-display text-4xl font-black uppercase text-gradient-gold">Pack opened!</div>
            <div className="grid grid-cols-3 gap-2">
              {cards.slice(0, 5).map((c, i) => (
                <div key={c.id} className="animate-pop" style={{ animationDelay: `${i * 150}ms` }}><PlayerCard {...c} owned small /></div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">Tap anywhere to continue</p>
          </div>
        </div>
      )}
    </Shell>
  );
}
