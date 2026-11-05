import type { Rarity } from "@/lib/game-data";
import { rarityStyle } from "@/lib/game-data";

type Props = { name: string; team: string; pos: string; rarity: Rarity; img: string; boosts: readonly (readonly string[])[]; owned?: boolean; selected?: boolean; small?: boolean };

export function PlayerCard({ name, team, pos, rarity, img, boosts, owned = true, selected, small }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface ring-2 shadow-card transition ${rarityStyle[rarity]} ${rarity !== "common" ? "shine" : ""} ${selected ? "scale-[1.02] ring-4" : ""} ${owned ? "" : "opacity-40 grayscale"}`}>
      <img src={img} alt={name} loading="lazy" width={720} height={928} className={`w-full object-cover ${small ? "aspect-[3/4]" : "aspect-[3/4]"}`} />
      <div className="absolute inset-0 bg-fade" />
      <div className="absolute left-2 top-2 rounded-md bg-background/80 px-1.5 py-0.5 font-display text-xs font-black">{pos}</div>
      <div className="absolute right-2 top-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">{rarity}</div>
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <div className="font-display text-base font-black uppercase leading-none text-foreground">{name}</div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase text-muted-foreground">{team}</div>
        {!small && (
          <div className="flex flex-wrap gap-1">
            {boosts.map(([v, k]) => (
              <span key={k} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${v.startsWith("-") ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>{v} {k}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
