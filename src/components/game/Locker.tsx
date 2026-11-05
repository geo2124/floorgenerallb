import { useState } from "react";
import { X, Check, Shirt, Glasses } from "lucide-react";
import { accessories, kits, looks, setLook, useLook } from "@/lib/avatar-store";
import { Avatar } from "./Avatar";

export function Locker({ onClose }: { onClose: () => void }) {
  const look = useLook();
  const [tab, setTab] = useState<"kit" | "acc">("kit");
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-background">
      <div className="flex w-full max-w-[440px] flex-col">
        <Avatar className="h-[58vh]" priority>
          <div className="flex items-center justify-between p-4">
            <div className="glass rounded-full border px-3 py-1 font-display text-sm font-black uppercase">Locker room</div>
            <button onClick={onClose} className="glass rounded-full border p-2"><X className="size-4" /></button>
          </div>
          <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Drag to inspect</div>
        </Avatar>

        <div className="-mt-4 flex-1 rounded-t-3xl border-t bg-surface p-4">
          <div className="mb-4 grid grid-cols-2 rounded-2xl bg-surface-2 p-1">
            <button onClick={() => setTab("kit")} className={`flex items-center justify-center gap-1 rounded-xl py-2 font-display font-black uppercase ${tab === "kit" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}><Shirt className="size-4" />Attire</button>
            <button onClick={() => setTab("acc")} className={`flex items-center justify-center gap-1 rounded-xl py-2 font-display font-black uppercase ${tab === "acc" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}><Glasses className="size-4" />Accessories</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {tab === "kit"
              ? kits.map((k) => (
                  <Tile key={k.id} active={look.kit === k.id} onClick={() => setLook({ kit: k.id })} img={looks[k.id][look.acc]} label={k.name} />
                ))
              : accessories.map((a) => (
                  <Tile key={a.id} active={look.acc === a.id} onClick={() => setLook({ acc: a.id })} img={looks[look.kit][a.id]} label={a.name} sub={a.stat} zoom />
                ))}
          </div>

          <button onClick={onClose} className="mt-4 w-full rounded-2xl bg-gradient-primary py-4 font-display text-xl font-black uppercase text-primary-foreground shadow-glow">Save look</button>
        </div>
      </div>
    </div>
  );
}

function Tile({ active, onClick, img, label, sub, zoom }: { active: boolean; onClick: () => void; img: string; label: string; sub?: string | undefined; zoom?: boolean }) {
  return (
    <button onClick={onClick} className={`relative overflow-hidden rounded-2xl border-2 bg-surface-2 text-left transition active:scale-95 ${active ? "border-primary shadow-glow" : "border-transparent"}`}>
      <div className="aspect-square overflow-hidden">
        <img src={img} alt={label} loading="lazy" width={768} height={1152} className={`h-full w-full object-cover ${zoom ? "scale-[2.6] object-[50%_4%] origin-top" : "object-[50%_25%]"}`} />
      </div>
      {active && <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" strokeWidth={3} /></span>}
      <div className="p-2">
        <div className="text-xs font-bold leading-tight">{label}</div>
        {sub && <div className="text-[10px] font-semibold text-success">{sub}</div>}
      </div>
    </button>
  );
}
