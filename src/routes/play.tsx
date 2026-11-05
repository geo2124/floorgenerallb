import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, SectionTitle } from "@/components/game/Shell";
import { PlayerCard } from "@/components/game/PlayerCard";
import { cards } from "@/lib/game-data";
import court from "@/assets/court.jpg";
import { Bot, Swords, Users, Timer, Pause, ArrowLeftRight } from "lucide-react";
import { Avatar } from "@/components/game/Avatar";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play — The Floor General" },
      { name: "description", content: "Set your strategy and play 1v1 duels or 5v5 team games as player or coach." },
      { property: "og:title", content: "Play — The Floor General" },
      { property: "og:description", content: "1v1 duels and coach-led team games." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Play,
});

function Play() {
  const [mode, setMode] = useState<"1v1" | "team">("1v1");
  const [three, setThree] = useState(60);
  const [def3, setDef3] = useState(70);
  const [pace, setPace] = useState(50);
  const [auto, setAuto] = useState(false);
  const [boosts, setBoosts] = useState<number[]>([1]);
  const [match, setMatch] = useState(false);

  return (
    <Shell>
      <div className="mt-4 grid grid-cols-2 rounded-2xl bg-surface p-1">
        {(["1v1", "team"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`flex items-center justify-center gap-1 rounded-xl py-2 font-display font-black uppercase ${mode === m ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {m === "1v1" ? <Swords className="size-4" /> : <Users className="size-4" />}{m === "1v1" ? "1 v 1" : "Team 5v5"}
          </button>
        ))}
      </div>

      {mode === "team" && (
        <div className="relative mt-4 h-64 overflow-hidden rounded-3xl border">
          <img src={court} alt="" loading="lazy" width={768} height={1152} className="absolute inset-0 h-full w-full object-cover opacity-60" />
          {[["PG", "50%", "78%", true], ["SG", "20%", "60%"], ["SF", "80%", "60%"], ["PF", "32%", "35%"], ["C", "68%", "35%"]].map(([p, x, y, me]) => (
            <div key={p as string} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: x as string, top: y as string }}>
              <div className={`grid size-11 place-items-center rounded-full border-2 font-display text-sm font-black ${me ? "border-primary bg-primary text-primary-foreground shadow-glow" : "border-foreground/40 bg-background/80"}`}>{p}</div>
              <div className="mt-0.5 text-[9px] font-bold">{me ? "YOU" : "user"}</div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-fade p-2 pt-6 text-[10px] font-bold uppercase">
            Bench: {["G", "F", "C"].map((b) => <span key={b} className="rounded-full bg-surface-2 px-2 py-0.5">{b}</span>)}
          </div>
        </div>
      )}

      <SectionTitle title={mode === "team" ? "Team strategy" : "Your strategy"} action="Locks at tip-off" />
      <div className="space-y-4 rounded-2xl border bg-surface p-4">
        <Split label="Shot selection" left="3PT" right="Mid" value={three} onChange={setThree} />
        <Split label="Defensive focus" left="Guard 3s" right="Protect paint" value={def3} onChange={setDef3} />
        <Split label="Tempo" left="Fast" right="Slow" value={pace} onChange={setPace} />
      </div>

      <SectionTitle title="Boost cards" action={`${boosts.length}/3 · edit until T-5m`} />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {cards.filter((c) => c.owned).map((c) => (
          <button key={c.id} className="w-32 shrink-0" onClick={() => setBoosts((b) => (b.includes(c.id) ? b.filter((x) => x !== c.id) : b.length < 3 ? [...b, c.id] : b))}>
            <PlayerCard {...c} selected={boosts.includes(c.id)} />
          </button>
        ))}
      </div>

      <button onClick={() => setAuto(!auto)} className="mt-4 flex w-full items-center gap-3 rounded-2xl border bg-surface p-4">
        <Bot className="size-6 text-accent" />
        <div className="flex-1 text-left"><div className="font-bold">Auto-play</div><div className="text-xs text-muted-foreground">Instant result if both sides are on auto</div></div>
        <span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${auto ? "bg-accent" : "bg-surface-2"}`}><span className={`size-5 rounded-full bg-foreground transition ${auto ? "translate-x-5" : ""}`} /></span>
      </button>

      <button onClick={() => setMatch(true)} className="mt-4 w-full rounded-2xl bg-gradient-primary py-5 font-display text-2xl font-black uppercase text-primary-foreground shadow-glow">
        Find opponent
        <div className="font-sans text-xs font-semibold normal-case opacity-80">Win +180 XP · Lose −90 XP</div>
      </button>

      {match && <Match team={mode === "team"} initial={{ three, def3, pace }} onClose={() => setMatch(false)} />}
    </Shell>
  );
}

function Split({ label, left, right, value, onChange }: { label: string; left: string; right: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mb-1 flex justify-between text-sm font-bold"><span className="text-primary">{left} {value}%</span><span className="text-accent">{100 - value}% {right}</span></div>
      <input type="range" min={0} max={100} step={5} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-[var(--primary)]" />
    </div>
  );
}

type Strat = { three: number; def3: number; pace: number };
const feed = ["Pull-up from deep — BANG! 3PT", "Steal on the perimeter, fast break layup", "Contested mid-range… off the rim", "Crossover, step-back three — GOOD!", "Block at the rim!", "Drive and kick, corner three — GOOD!"];
const starters0 = [["PG", "You"], ["SG", "Amir_S"], ["SF", "Ali.H"], ["PF", "Karim_Z"], ["C", "Hayk_G"]];
const bench0 = [["G", "Nadim_7"], ["F", "Rami.B"], ["C", "JadTower"]];

function Match({ team, onClose, initial }: { team: boolean; onClose: () => void; initial: Strat }) {
  const [t, setT] = useState(0);
  const [q, setQ] = useState(1);
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [log, setLog] = useState<string[]>([]);
  const [panel, setPanel] = useState<null | "break" | "timeout">(null);
  const [timeouts, setTimeouts] = useState(2);
  const [strat, setStrat] = useState<Strat>(initial);
  const [count, setCount] = useState(30);
  const [starters, setStarters] = useState(starters0);
  const [bench, setBench] = useState(bench0);
  const [subSel, setSubSel] = useState<number | null>(null);
  const done = q > 4;

  useEffect(() => {
    if (panel || done) return;
    const id = setInterval(() => {
      setT((x) => {
        if (x >= 84) { setPanel("break"); setCount(30); return 0; }
        return x + 6;
      });
      // strategy influences scoring: more 3s = higher variance, faster pace = more possessions
      const shotChance = 0.42 + strat.pace / 500;
      const pts = Math.random() < strat.three / 100 ? 3 : 2;
      setScore(([a, b]): [number, number] => [a + (Math.random() < shotChance ? pts : 0), b + (Math.random() < 0.45 + (100 - strat.def3) / 600 ? (Math.random() > 0.5 ? 3 : 2) : 0)]);
      setLog((l) => [feed[Math.floor(Math.random() * feed.length)] ?? "", ...l].slice(0, 4));
    }, 450);
    return () => clearInterval(id);
  }, [panel, done, strat]);

  useEffect(() => {
    if (!panel) return;
    if (count <= 0) { resume(); return; }
    const id = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(id);
  });

  function resume() {
    if (panel === "break") setQ((x) => x + 1);
    setPanel(null);
    setSubSel(null);
  }

  function sub(benchIdx: number) {
    if (subSel === null) return;
    const s = [...starters], b = [...bench];
    const out = s[subSel]!, inn = b[benchIdx]!;
    s[subSel] = [out[0]!, inn[1]!];
    b[benchIdx] = [inn[0]!, out[1]!];
    setStarters(s); setBench(b); setSubSel(null);
    setLog((l) => [`SUB: ${inn[1]} in for ${out[1]}`, ...l].slice(0, 4));
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-background">
      <div className="relative flex w-full max-w-[440px] flex-col overflow-hidden">
        <img src={court} alt="" width={768} height={1152} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        {!team && <div className="absolute inset-x-0 bottom-0 h-[70%] opacity-50"><Avatar className="h-full" /></div>}
        <div className="relative z-10 flex flex-1 flex-col overflow-y-auto p-5">
          <div className="flex items-center justify-between rounded-2xl glass border p-4">
            <div className="text-center"><div className="text-xs font-bold text-primary">YOU</div><div className="font-display text-5xl font-black">{score[0]}</div></div>
            <div className="text-center">
              <div className="font-display text-lg font-black">{done ? "FINAL" : `Q${q}`}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Timer className="size-3" />{Math.max(0, 90 - t)}s</div>
            </div>
            <div className="text-center"><div className="text-xs font-bold text-accent">{team ? "CEDARS FC" : "RIVAL_91"}</div><div className="font-display text-5xl font-black">{score[1]}</div></div>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-gradient-primary transition-all" style={{ width: `${(t / 90) * 100}%` }} /></div>
          <div className="mt-2 flex justify-center gap-2 text-[10px] font-bold uppercase">
            <span className="rounded-full glass border px-2 py-0.5">3PT {strat.three}%</span>
            <span className="rounded-full glass border px-2 py-0.5">D-3s {strat.def3}%</span>
            <span className="rounded-full glass border px-2 py-0.5">Pace {strat.pace}</span>
          </div>

          {!panel && (
            <div className="mt-auto space-y-2 pt-6">
              {log.map((l, i) => <div key={l + i} className="animate-rise rounded-xl glass border px-3 py-2 text-sm font-semibold" style={{ opacity: 1 - i * 0.22 }}>{l}</div>)}
            </div>
          )}

          {team && !panel && !done && (
            <button disabled={!timeouts} onClick={() => { setTimeouts((x) => x - 1); setPanel("timeout"); setCount(30); }}
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl border bg-surface py-3 text-sm font-bold disabled:opacity-40">
              <Pause className="size-4" />Call timeout ({timeouts} left)
            </button>
          )}

          {panel && !done && (
            <div className="mt-4 animate-rise rounded-2xl border border-primary bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-black uppercase">{panel === "timeout" ? "Timeout" : `End of Q${q}`}</span>
                <span className={`font-display text-2xl font-black ${count <= 10 ? "text-destructive" : "text-primary"}`}>0:{String(count).padStart(2, "0")}</span>
              </div>
              <div className="my-2 h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(count / 30) * 100}%` }} /></div>

              <div className="space-y-4 py-2">
                <Split label="Shot selection" left="3PT" right="Mid" value={strat.three} onChange={(v) => setStrat({ ...strat, three: v })} />
                <Split label="Defensive focus" left="Guard 3s" right="Protect paint" value={strat.def3} onChange={(v) => setStrat({ ...strat, def3: v })} />
                <Split label="Tempo" left="Fast" right="Slow" value={strat.pace} onChange={(v) => setStrat({ ...strat, pace: v })} />
              </div>

              {team && (
                <div className="mt-2">
                  <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Substitutions {subSel !== null ? "· pick bench player" : "· tap a starter"}</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {starters.map(([p, n], i) => (
                      <button key={p} onClick={() => setSubSel(subSel === i ? null : i)} className={`rounded-xl border p-1.5 text-center ${subSel === i ? "border-primary bg-primary/15" : "bg-surface-2"}`}>
                        <div className="font-display text-sm font-black">{p}</div><div className="truncate text-[9px]">{n}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {bench.map(([p, n], i) => (
                      <button key={i} disabled={subSel === null} onClick={() => sub(i)} className={`flex items-center justify-center gap-1 rounded-xl border border-dashed py-2 text-xs font-bold ${subSel !== null ? "border-accent text-accent" : "opacity-60"}`}>
                        <ArrowLeftRight className="size-3" />{p} · {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={resume} className="mt-4 w-full rounded-xl bg-gradient-primary py-3 font-display text-lg font-black uppercase text-primary-foreground">
                {panel === "timeout" ? "Resume play" : q === 4 ? "See result" : `Start Q${q + 1}`}
              </button>
            </div>
          )}

          {done && (
            <div className="mt-auto animate-pop rounded-2xl bg-surface p-5 text-center">
              <div className={`font-display text-5xl font-black uppercase ${score[0] >= score[1] ? "text-gradient-gold" : "text-destructive"}`}>{score[0] >= score[1] ? "Victory" : "Defeat"}</div>
              <div className="my-2 font-bold">{score[0] >= score[1] ? "+180 XP" : "−90 XP"}</div>
              <button onClick={onClose} className="w-full rounded-xl bg-gradient-primary py-3 font-display text-lg font-black uppercase text-primary-foreground">Continue</button>
            </div>
          )}
          {!done && !panel && <button onClick={onClose} className="mt-3 text-xs text-muted-foreground">Leave match</button>}
        </div>
      </div>
    </div>
  );
}
