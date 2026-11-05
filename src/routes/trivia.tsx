import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SectionTitle, Bar } from "@/components/game/Shell";
import { EarnTabs } from "./predict";
import { triviaTopics } from "@/lib/game-data";
import { Gem, Zap, Timer, X, Check } from "lucide-react";

export const Route = createFileRoute("/trivia")({
  head: () => ({
    meta: [
      { title: "Trivia — The Floor General" },
      { name: "description", content: "Answer basketball trivia across NBA, EuroLeague and Lebanese league to earn XP." },
      { property: "og:title", content: "Trivia — The Floor General" },
      { property: "og:description", content: "Climb levels in basketball trivia and earn XP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Trivia,
});

const q = { text: "Which club won the 2024 Lebanese Basketball Championship?", options: ["Al Riyadi", "Sagesse", "Beirut Club", "Homenetmen"], correct: 0 };

function Trivia() {
  const [playing, setPlaying] = useState(false);
  const [ans, setAns] = useState<number | null>(null);
  return (
    <Shell>
      <EarnTabs active="trivia" />
      <SectionTitle title="Choose a topic" action="1 credit / round" />
      <div className="space-y-3">
        {triviaTopics.map((t) => (
          <button key={t.id} onClick={() => { setPlaying(true); setAns(null); }} className="flex w-full items-center gap-4 rounded-2xl border bg-surface p-4 text-left active:scale-[0.98]">
            <div className="grid size-14 place-items-center rounded-2xl bg-surface-2 font-display text-2xl font-black text-primary">{t.level}</div>
            <div className="flex-1">
              <div className="font-display text-lg font-black uppercase">{t.name}</div>
              <div className="mb-1.5 text-xs text-muted-foreground">Level {t.level} of {t.levels}</div>
              <Bar value={(t.level / t.levels) * 100} />
            </div>
            <div className="text-right text-xs font-bold text-xp"><Zap className="ml-auto size-4 fill-current" />+{t.xp}</div>
          </button>
        ))}
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 flex justify-center bg-background">
          <div className="flex w-full max-w-[440px] flex-col p-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setPlaying(false)} className="rounded-full bg-surface p-2"><X className="size-4" /></button>
              <div className="flex items-center gap-1 font-display text-xl font-black text-primary"><Timer className="size-5" />0:12</div>
              <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-bold"><Gem className="size-3 text-credit" />−1</span>
            </div>
            <div className="mt-6 flex gap-1">{Array.from({ length: 10 }).map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 3 ? "bg-primary" : "bg-surface-2"}`} />)}</div>
            <div className="mt-2 text-xs font-bold uppercase text-muted-foreground">Question 4 / 10 · Lebanese League</div>
            <h2 className="mt-6 font-display text-3xl font-black leading-tight">{q.text}</h2>
            <div className="mt-8 space-y-3">
              {q.options.map((o, i) => {
                const state = ans === null ? "" : i === q.correct ? "border-success bg-success/15" : i === ans ? "border-destructive bg-destructive/15" : "opacity-50";
                return (
                  <button key={o} disabled={ans !== null} onClick={() => setAns(i)} className={`flex w-full items-center justify-between rounded-2xl border-2 bg-surface p-4 text-left font-bold transition ${state}`}>
                    {o}
                    {ans !== null && i === q.correct && <Check className="size-5 text-success" />}
                  </button>
                );
              })}
            </div>
            {ans !== null && (
              <button onClick={() => setAns(null)} className="mt-auto w-full rounded-2xl bg-gradient-primary py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-glow">Next question</button>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
