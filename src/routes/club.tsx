import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SectionTitle } from "@/components/game/Shell";
import { TeamLogo, logoShapes, logoIcons, logoColors, type LogoSpec } from "@/components/game/TeamLogo";
import { Crown, UserMinus, Check, X, LogOut, Search, Shuffle, Trophy, Palette, Plus, Clock, Users } from "lucide-react";

export const Route = createFileRoute("/club")({
  head: () => ({
    meta: [
      { title: "Club — The Floor General" },
      { name: "description", content: "Create or join a fixed 5v5 team, design your logo and compete in leagues." },
      { property: "og:title", content: "Club — The Floor General" },
      { property: "og:description", content: "Build your squad, design a logo, win the league." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Club,
});

type Member = { id: number; name: string; pos: string; ovr: number; role?: "coach" | "you"; bench?: boolean };

const initialRoster: Member[] = [
  { id: 1, name: "K. Ayoubi", pos: "PG", ovr: 78, role: "coach" },
  { id: 2, name: "Amir_S", pos: "SG", ovr: 74 },
  { id: 3, name: "Ali.H", pos: "SF", ovr: 76 },
  { id: 4, name: "Karim_Z", pos: "PF", ovr: 71 },
  { id: 5, name: "Hayk_G", pos: "C", ovr: 80 },
  { id: 6, name: "Nadim_7", pos: "G", ovr: 69, bench: true },
  { id: 7, name: "Rami.B", pos: "F", ovr: 67, bench: true },
];
const initialRequests = [
  { id: 11, name: "JadTower", pos: "C", ovr: 72 },
  { id: 12, name: "Sami.3pt", pos: "SG", ovr: 70 },
];
const openTeams: { name: string; spec: LogoSpec; ovr: number; slots: number; league: string }[] = [
  { name: "Beirut Blaze", spec: { shape: "circle", icon: "flame", primary: "#e11d2a", secondary: "#f8fafc", initials: "BB" }, ovr: 77, slots: 2, league: "Cedar League" },
  { name: "Byblos Eagles", spec: { shape: "hex", icon: "eagle", primary: "#0ea5e9", secondary: "#111111", initials: "BYE" }, ovr: 74, slots: 1, league: "Open" },
  { name: "Tripoli Kings", spec: { shape: "diamond", icon: "crown", primary: "#f5c542", secondary: "#111111", initials: "TK" }, ovr: 79, slots: 3, league: "Cedar League" },
];
const standings = [
  { name: "Tripoli Kings", w: 7, l: 1, spec: openTeams[2]!.spec },
  { name: "Cedar Storm", w: 6, l: 2, me: true },
  { name: "Beirut Blaze", w: 5, l: 3, spec: openTeams[0]!.spec },
  { name: "Byblos Eagles", w: 3, l: 5, spec: openTeams[1]!.spec },
  { name: "Saida Sharks", w: 2, l: 6, spec: { shape: "shield", icon: "anchor", primary: "#2563eb", secondary: "#f8fafc", initials: "SS" } as LogoSpec },
];

function Club() {
  const [tab, setTab] = useState<"team" | "find" | "league">("team");
  const [hasTeam, setHasTeam] = useState(true);
  const [spec, setSpec] = useState<LogoSpec>({ shape: "shield", icon: "cedar", primary: "#ff6a1a", secondary: "#111111", initials: "CS" });
  const [name, setName] = useState("Cedar Storm");
  const [roster, setRoster] = useState(initialRoster);
  const [requests, setRequests] = useState(initialRequests);
  const [pending, setPending] = useState<string[]>([]);
  const [studio, setStudio] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  return (
    <Shell>
      <div className="mt-4 grid grid-cols-3 rounded-2xl bg-surface p-1">
        {([["team", "My team"], ["find", "Find team"], ["league", "Leagues"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-xl py-2 font-display text-sm font-black uppercase ${tab === k ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
        ))}
      </div>

      {tab === "team" && (hasTeam ? (
        <>
          <div className="relative mt-4 overflow-hidden rounded-3xl border bg-surface p-5">
            <div className="absolute -right-10 -top-10 size-48 rounded-full opacity-25 blur-3xl" style={{ background: spec.primary }} />
            <div className="relative flex items-center gap-4">
              <button onClick={() => setStudio(true)} className="group relative">
                <TeamLogo spec={spec} size={88} />
                <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"><Palette className="size-3.5" /></span>
              </button>
              <div className="flex-1">
                <div className="font-display text-3xl font-black uppercase leading-none">{name}</div>
                <div className="mt-1 text-xs text-muted-foreground">Cedar League · 2nd place</div>
                <div className="mt-2 flex gap-1.5 text-[10px] font-bold uppercase">
                  <span className="rounded-full bg-success/20 px-2 py-0.5 text-success">6W – 2L</span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5">OVR 75</span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5">{roster.length}/8</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-gradient-primary py-3.5 font-display font-black uppercase text-primary-foreground shadow-glow"><Trophy className="mr-1 inline size-4" />League game</button>
            <button className="rounded-2xl border bg-surface py-3.5 font-display font-black uppercase"><Swords2 />Friendly</button>
          </div>

          {requests.length > 0 && (
            <>
              <SectionTitle title="Join requests" action={`${requests.length} pending`} />
              <div className="space-y-2">
                {requests.map((r) => (
                  <div key={r.id} className="flex animate-rise items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-3">
                    <Ovr v={r.ovr} />
                    <div className="flex-1"><div className="font-bold">{r.name}</div><div className="text-xs text-muted-foreground">{r.pos} · wants to sign</div></div>
                    <button aria-label="Decline" onClick={() => setRequests(requests.filter((x) => x.id !== r.id))} className="grid size-9 place-items-center rounded-xl bg-surface-2"><X className="size-4" /></button>
                    <button aria-label="Accept" disabled={roster.length >= 8} onClick={() => { setRoster([...roster, { ...r, bench: true }]); setRequests(requests.filter((x) => x.id !== r.id)); }} className="grid size-9 place-items-center rounded-xl bg-success text-background disabled:opacity-40"><Check className="size-4" strokeWidth={3} /></button>
                  </div>
                ))}
              </div>
            </>
          )}

          <SectionTitle title="Roster" action="You are the coach" />
          <div className="space-y-2">
            {roster.map((m, i) => (
              <div key={m.id}>
                {i === 5 && <div className="mb-2 mt-4 text-xs font-bold uppercase text-muted-foreground">Bench</div>}
                <div className="flex items-center gap-3 rounded-2xl border bg-surface p-3">
                  <div className="w-9 font-display text-lg font-black text-primary">{m.pos}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-bold">{m.name}{m.role === "coach" && <Crown className="size-3.5 fill-xp text-xp" />}</div>
                    <div className="text-xs text-muted-foreground">{m.role === "coach" ? "Coach · You" : m.bench ? "Bench" : "Starter"}</div>
                  </div>
                  <Ovr v={m.ovr} />
                  {m.role !== "coach" && (
                    <button aria-label={`Release ${m.name}`} onClick={() => setRoster(roster.filter((x) => x.id !== m.id))} className="grid size-9 place-items-center rounded-xl bg-destructive/15 text-destructive"><UserMinus className="size-4" /></button>
                  )}
                </div>
              </div>
            ))}
            {Array.from({ length: Math.max(0, 8 - roster.length) }).map((_, i) => (
              <div key={i} className="flex items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-xs font-bold text-muted-foreground"><Plus className="size-4" />Open slot · invite players</div>
            ))}
          </div>

          <button onClick={() => setConfirmLeave(true)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-bold text-destructive"><LogOut className="size-4" />Leave team</button>
        </>
      ) : (
        <div className="mt-6 text-center">
          <div className="mx-auto mb-4 grid size-24 place-items-center rounded-3xl bg-surface"><Users className="size-10 text-muted-foreground" /></div>
          <div className="font-display text-3xl font-black uppercase">No team yet</div>
          <p className="mb-6 text-sm text-muted-foreground">Create your own club as coach, or sign with an existing one.</p>
          <button onClick={() => { setHasTeam(true); setStudio(true); }} className="w-full rounded-2xl bg-gradient-primary py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-glow">Create team</button>
          <button onClick={() => setTab("find")} className="mt-2 w-full rounded-2xl border bg-surface py-4 font-display text-lg font-black uppercase">Find a team</button>
          <button className="mt-2 flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-accent"><Shuffle className="size-4" />Quick play with a random team</button>
        </div>
      ))}

      {tab === "find" && (
        <>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border bg-surface px-3 py-3"><Search className="size-4 text-muted-foreground" /><input placeholder="Search teams" className="flex-1 bg-transparent text-sm outline-none" /></div>
          <button className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-gold p-4 text-primary-foreground shine">
            <Shuffle className="size-7" />
            <div className="flex-1 text-left"><div className="font-display text-lg font-black uppercase leading-none">Random squad</div><div className="text-xs font-semibold">Get matched with 7 random players now</div></div>
          </button>
          <SectionTitle title="Recruiting" action="Coach approval needed" />
          <div className="space-y-2">
            {openTeams.map((t) => {
              const p = pending.includes(t.name);
              return (
                <div key={t.name} className="flex items-center gap-3 rounded-2xl border bg-surface p-3">
                  <TeamLogo spec={t.spec} size={52} />
                  <div className="flex-1">
                    <div className="font-display text-lg font-black uppercase leading-none">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.league} · OVR {t.ovr} · {t.slots} open</div>
                  </div>
                  <button onClick={() => setPending(p ? pending.filter((x) => x !== t.name) : [...pending, t.name])}
                    className={`rounded-xl px-3 py-2 text-xs font-black uppercase ${p ? "bg-surface-2 text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                    {p ? <><Clock className="mr-1 inline size-3" />Pending</> : "Request"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "league" && (
        <>
          <div className="mt-4 overflow-hidden rounded-3xl border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div><div className="text-xs font-bold uppercase text-primary">Season 1 · Week 9</div><div className="font-display text-2xl font-black uppercase">Cedar League</div></div>
              <Trophy className="size-10 text-xp" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-2 p-3">
              <div className="flex items-center gap-2"><TeamLogo spec={spec} size={40} /><span className="font-display font-black uppercase">{name.split(" ")[0]}</span></div>
              <div className="text-center"><div className="text-[10px] font-bold uppercase text-muted-foreground">Next</div><div className="font-display font-black">Fri 21:00</div></div>
              <div className="flex items-center gap-2"><span className="font-display font-black uppercase">Tripoli</span><TeamLogo spec={openTeams[2]!.spec} size={40} /></div>
            </div>
          </div>

          <SectionTitle title="Standings" />
          <div className="overflow-hidden rounded-2xl border bg-surface">
            {standings.map((s, i) => (
              <div key={s.name} className={`flex items-center gap-3 border-b px-3 py-2.5 last:border-0 ${s.me ? "bg-primary/10" : ""}`}>
                <span className={`w-5 font-display font-black ${i < 2 ? "text-xp" : "text-muted-foreground"}`}>{i + 1}</span>
                <TeamLogo spec={s.me ? spec : s.spec!} size={32} />
                <span className="flex-1 text-sm font-bold">{s.me ? name : s.name}</span>
                <span className="w-14 text-right font-display font-black">{s.w}–{s.l}</span>
              </div>
            ))}
          </div>

          <SectionTitle title="Join a league" />
          {[["Beirut Night League", "8 teams · Starts Mon", "Free"], ["Pro Cedar Cup", "16 teams · Knockout", "5 credits"]].map(([n, d, c]) => (
            <div key={n} className="mb-2 flex items-center gap-3 rounded-2xl border bg-surface p-3">
              <Trophy className="size-6 text-primary" />
              <div className="flex-1"><div className="font-bold">{n}</div><div className="text-xs text-muted-foreground">{d}</div></div>
              <button className="rounded-xl bg-surface-2 px-3 py-2 text-xs font-black uppercase">{c}</button>
            </div>
          ))}
          <button className="mt-2 w-full rounded-2xl border border-dashed py-3 text-sm font-bold text-primary"><Plus className="mr-1 inline size-4" />Create a league</button>
        </>
      )}

      {studio && <LogoStudio spec={spec} name={name} onSave={(s, n) => { setSpec(s); setName(n); setStudio(false); }} onClose={() => setStudio(false)} />}

      {confirmLeave && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm" onClick={() => setConfirmLeave(false)}>
          <div className="w-full max-w-[440px] animate-rise rounded-t-3xl border bg-surface p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-2xl font-black uppercase">Leave {name}?</div>
            <p className="mb-4 text-sm text-muted-foreground">As coach, leaving hands the coach role to the highest rated player.</p>
            <button onClick={() => { setHasTeam(false); setConfirmLeave(false); }} className="w-full rounded-2xl bg-destructive py-3.5 font-display text-lg font-black uppercase text-destructive-foreground">Leave team</button>
            <button onClick={() => setConfirmLeave(false)} className="mt-2 w-full py-2 text-sm font-bold text-muted-foreground">Stay</button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Swords2() { return <Shuffle className="mr-1 inline size-4" />; }
function Ovr({ v }: { v: number }) {
  return <div className="grid size-10 place-items-center rounded-xl bg-surface-2 font-display text-lg font-black">{v}</div>;
}

function LogoStudio({ spec: s0, name: n0, onSave, onClose }: { spec: LogoSpec; name: string; onSave: (s: LogoSpec, n: string) => void; onClose: () => void }) {
  const [s, setS] = useState(s0);
  const [n, setN] = useState(n0);
  const [tab, setTab] = useState<"shape" | "icon" | "color">("shape");
  const shuffle = () => {
    const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)]!;
    setS({ ...s, shape: pick(logoShapes), icon: pick(Object.keys(logoIcons) as (keyof typeof logoIcons)[]), primary: pick(logoColors), secondary: pick(logoColors) });
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-background">
      <div className="flex w-full max-w-[440px] flex-col overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <div className="font-display text-xl font-black uppercase">Logo studio</div>
          <button onClick={onClose} className="rounded-full bg-surface p-2"><X className="size-4" /></button>
        </div>
        <div className="relative my-6 grid place-items-center">
          <div className="absolute size-56 rounded-full opacity-30 blur-3xl" style={{ background: s.primary }} />
          <div className="relative transition-all"><TeamLogo spec={s} size={190} /></div>
          <button onClick={shuffle} className="absolute bottom-0 right-4 flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-bold"><Shuffle className="size-3.5" />Shuffle</button>
        </div>
        <div className="grid grid-cols-[1fr_90px] gap-2">
          <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Team name" className="rounded-xl border bg-surface px-3 py-3 font-bold outline-none focus:border-primary" />
          <input value={s.initials} maxLength={3} onChange={(e) => setS({ ...s, initials: e.target.value })} placeholder="ABC" className="rounded-xl border bg-surface px-3 py-3 text-center font-display font-black uppercase outline-none focus:border-primary" />
        </div>
        <div className="mt-4 grid grid-cols-3 rounded-2xl bg-surface p-1">
          {(["shape", "icon", "color"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-xl py-2 text-sm font-black uppercase ${tab === k ? "bg-surface-2 text-primary" : "text-muted-foreground"}`}>{k}</button>
          ))}
        </div>
        <div className="mt-3 min-h-40">
          {tab === "shape" && (
            <div className="grid grid-cols-4 gap-2">
              {logoShapes.map((sh) => <Opt key={sh} on={s.shape === sh} onClick={() => setS({ ...s, shape: sh })}><TeamLogo spec={{ ...s, shape: sh, initials: "" }} size={52} /></Opt>)}
            </div>
          )}
          {tab === "icon" && (
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(logoIcons) as (keyof typeof logoIcons)[]).map((ic) => {
                const I = logoIcons[ic];
                return <Opt key={ic} on={s.icon === ic} onClick={() => setS({ ...s, icon: ic })}><I className="size-7" /></Opt>;
              })}
            </div>
          )}
          {tab === "color" && (
            <div className="space-y-3">
              {(["primary", "secondary"] as const).map((k) => (
                <div key={k}>
                  <div className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">{k}</div>
                  <div className="grid grid-cols-10 gap-1.5">
                    {logoColors.map((c) => (
                      <button key={c} aria-label={c} onClick={() => setS({ ...s, [k]: c })} className={`aspect-square rounded-full border-2 ${s[k] === c ? "scale-110 border-primary" : "border-border"}`} style={{ background: c }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => onSave(s, n || "My Team")} className="mt-4 w-full rounded-2xl bg-gradient-primary py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-glow">Save team identity</button>
      </div>
    </div>
  );
}

function Opt({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`grid aspect-square place-items-center rounded-2xl border-2 bg-surface transition active:scale-95 ${on ? "border-primary text-primary shadow-glow" : "border-transparent"}`}>{children}</button>;
}
