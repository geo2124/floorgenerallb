import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, SectionTitle, Bar } from "@/components/game/Shell";
import { Avatar } from "@/components/game/Avatar";
import { attributes, games } from "@/lib/game-data";
import { Clock, Gift, Swords, Users, Target, Brain, ChevronRight, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Floor General — Build your baller" },
      { name: "description", content: "Train your player, predict Lebanese basketball, collect cards and dominate the court." },
      { property: "og:title", content: "The Floor General" },
      { property: "og:description", content: "Train your player, predict live games, collect cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Shell>
      {/* Hero player */}
      <Avatar className="-mx-4 h-[480px]" priority>
        <div className="absolute left-4 top-4 rounded-full glass border px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
          <span className="mr-1.5 inline-block size-2 animate-pulse rounded-full bg-success" />Next match in 12:40
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Point Guard · #7</div>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.9]">The Floor<br />General</h1>
          <div className="mt-3 flex items-center gap-4">
            <div className="font-display text-5xl font-black text-gradient-gold">78</div>
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted-foreground"><span>OVR → 79</span><span>2,140 / 3,000 XP</span></div>
              <Bar value={71} className="bg-gradient-gold" />
            </div>
          </div>
        </div>
      </Avatar>

      {/* Training in progress */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border bg-surface p-3">
        <div className="grid size-12 place-items-center rounded-xl bg-primary/15 font-display text-lg font-black text-primary">3PT</div>
        <div className="flex-1">
          <div className="text-sm font-bold">Training 3PT Shooting → 74</div>
          <div className="mb-1.5 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" /> 1h 24m left</div>
          <Bar value={38} />
        </div>
        <button className="rounded-xl bg-accent px-3 py-2 text-xs font-bold text-accent-foreground"><Play className="mr-1 inline size-3 fill-current" />Boost</button>
      </div>

      {/* Daily pack */}
      <Link to="/album" className="mt-3 flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-gold p-3 text-primary-foreground shine">
        <Gift className="size-8" />
        <div className="flex-1">
          <div className="font-display text-lg font-black uppercase leading-none">Daily packs ready</div>
          <div className="text-xs font-semibold opacity-80">5 cards waiting to be unpacked</div>
        </div>
        <ChevronRight />
      </Link>

      <SectionTitle title="Game modes" />
      <div className="grid grid-cols-2 gap-3">
        <Mode to="/play" icon={<Swords />} title="1 v 1" sub="Ranked duel" hot />
        <Mode to="/club" icon={<Users />} title="Club" sub="Team · Leagues" />
        <Mode to="/predict" icon={<Target />} title="Predict" sub="Live LBL games" />
        <Mode to="/trivia" icon={<Brain />} title="Trivia" sub="4 topics" />
      </div>

      <SectionTitle title="Live now" action={<Link to="/predict">All games</Link>} />
      {games.slice(0, 2).map((g) => (
        <Link to="/predict" key={g.id} className="mb-2 flex items-center justify-between rounded-2xl border bg-surface p-3">
          <span className="font-display text-lg font-black">{g.hs}</span>
          <div className="text-center">
            <div className="font-display text-xl font-black">{g.score ?? "vs"}</div>
            <div className={`text-[10px] font-bold uppercase ${g.live ? "text-destructive" : "text-muted-foreground"}`}>{g.time}</div>
          </div>
          <span className="font-display text-lg font-black">{g.as}</span>
        </Link>
      ))}

      <SectionTitle title="Top attributes" action={<Link to="/player">Upgrade</Link>} />
      <div className="grid grid-cols-4 gap-2">
        {attributes.slice(0, 4).map((a) => (
          <div key={a.key} className="rounded-xl border bg-surface p-2 text-center">
            <div className="font-display text-2xl font-black">{a.level}</div>
            <div className="text-[10px] font-bold uppercase text-muted-foreground">{a.key}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Mode({ to, icon, title, sub, hot }: { to: "/play" | "/predict" | "/trivia" | "/club"; icon: React.ReactNode; title: string; sub: string; hot?: boolean }) {
  return (
    <Link to={to} className="relative overflow-hidden rounded-2xl border bg-surface p-4 transition active:scale-95">
      {hot && <span className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-black uppercase">Hot</span>}
      <div className="mb-6 text-primary [&>svg]:size-7">{icon}</div>
      <div className="font-display text-2xl font-black uppercase leading-none">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </Link>
  );
}
