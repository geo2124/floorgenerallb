import { Link, useRouterState } from "@tanstack/react-router";
import { Home, User, Target, Swords, Shield, Zap, Gem, Plus } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/player", label: "Player", icon: User },
  { to: "/play", label: "Play", icon: Swords, center: true },
  { to: "/predict", label: "Earn", icon: Target },
  { to: "/club", label: "Club", icon: Shield },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-[100dvh] justify-center overflow-hidden">
      <div className="relative flex h-full w-full max-w-[440px] flex-col bg-background shadow-card">
        <TopBar />
        <main className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 pb-32">{children}</main>
        <nav className="absolute inset-x-0 bottom-0 z-40 px-3 pb-3">
          <div className="glass flex items-end justify-between rounded-3xl border px-2 py-2">
            {tabs.map((t) => {
              const active = t.to === "/" ? path === "/" : path.startsWith(t.to) || (t.to === "/predict" && path.startsWith("/trivia"));
              const Icon = t.icon;
              if ("center" in t) {
                return (
                  <Link key={t.to} to={t.to} className="-mt-8 flex flex-col items-center gap-1">
                    <span className="grid size-16 place-items-center rounded-full border-4 border-background bg-gradient-primary text-primary-foreground shadow-glow">
                      <Icon className="size-7" strokeWidth={2.4} />
                    </span>
                    <span className="font-display text-xs font-bold uppercase text-primary">{t.label}</span>
                  </Link>
                );
              }
              return (
                <Link key={t.to} to={t.to} className={`flex w-14 flex-col items-center gap-1 py-1 transition ${active ? "text-primary" : "text-muted-foreground"}`}>
                  <Icon className="size-5" strokeWidth={active ? 2.6 : 2} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{t.label}</span>
                  <span className={`h-1 w-1 rounded-full ${active ? "bg-primary" : "bg-transparent"}`} />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="glass z-30 flex shrink-0 items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="grid size-9 place-items-center rounded-xl bg-gradient-primary font-display text-lg font-black text-primary-foreground">FG</div>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold uppercase">K. Ayoubi</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Lvl 18 · PG</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Pill icon={<Zap className="size-3.5 fill-xp text-xp" />} value="12,480" />
        <Pill icon={<Gem className="size-3.5 text-credit" />} value="3/5" sub="1:42" />
      </div>
    </header>
  );
}

function Pill({ icon, value, sub }: { icon: ReactNode; value: string; sub?: string }) {
  return (
    <button className="flex items-center gap-1.5 rounded-full border bg-surface-2 py-1 pl-2 pr-1 text-xs font-bold">
      {icon}
      <span>{value}</span>
      {sub && <span className="text-[10px] font-medium text-muted-foreground">{sub}</span>}
      <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="size-3" strokeWidth={3} /></span>
    </button>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-end justify-between">
      <h2 className="font-display text-xl font-extrabold uppercase">{title}</h2>
      {action && <span className="text-xs font-semibold text-primary">{action}</span>}
    </div>
  );
}

export function Bar({ value, className = "bg-gradient-primary" }: { value: number; className?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${value}%` }} />
    </div>
  );
}
