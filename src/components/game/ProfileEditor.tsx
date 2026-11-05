import { useState } from "react";
import { X, Camera, Check } from "lucide-react";
import { setProfile, useProfile, type Profile } from "@/lib/profile-store";
import { useLook } from "@/lib/avatar-store";
import logo from "@/assets/tfg-logo.jpg.asset.json";

const teams = ["Al Riyadi", "Sagesse", "Beirut Club", "Homenetmen", "Dynamo", "Champville", "Antranik", "Hoops Club"];

export function ProfileEditor({ onClose }: { onClose: () => void }) {
  const p = useProfile();
  const look = useLook();
  const [d, setD] = useState<Profile>(p);
  const up = (k: keyof Profile, v: string | null) => setD((s) => ({ ...s, [k]: v }));

  function pick(f?: File) {
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 256;
      const s = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
      up("photo", c.toDataURL("image/jpeg", 0.85));
    };
    img.src = URL.createObjectURL(f);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-rise flex w-full max-w-[440px] flex-col bg-background">
        <div className="relative h-40 shrink-0 overflow-hidden">
          <img src={logo.url} alt="" className="absolute inset-0 h-full w-full scale-150 object-cover opacity-40 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          <div className="relative flex items-center justify-between p-4">
            <span className="glass rounded-full border px-3 py-1 font-display text-sm font-black uppercase">Edit profile</span>
            <button onClick={onClose} aria-label="Close" className="glass rounded-full border p-2"><X className="size-4" /></button>
          </div>
        </div>
        <div className="no-scrollbar -mt-16 flex-1 overflow-y-auto px-5 pb-28">
          <label className="relative mx-auto block size-28 cursor-pointer">
            <span className="block size-28 overflow-hidden rounded-full border-4 border-primary bg-surface-2 shadow-glow">
              {d.photo ? <img src={d.photo} alt="Profile" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center font-display text-4xl font-black">{d.name.slice(0, 1)}</span>}
            </span>
            <span className="absolute bottom-0 right-0 grid size-9 place-items-center rounded-full border-2 border-background bg-gradient-primary text-primary-foreground"><Camera className="size-4" /></span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <div className="mt-2 text-center text-xs text-muted-foreground">{look.position} · {look.height} cm · {look.weight} kg · #{look.number}</div>

          <Field label="Full name"><input value={d.name} maxLength={40} onChange={(e) => up("name", e.target.value)} className="inp" /></Field>
          <Field label="Username"><div className="flex items-center rounded-xl border bg-surface-2 px-3"><span className="text-muted-foreground">@</span><input value={d.username} maxLength={20} onChange={(e) => up("username", e.target.value.replace(/[^a-z0-9._]/gi, "").toLowerCase())} className="w-full bg-transparent py-3 pl-1 outline-none" /></div></Field>
          <Field label="City"><input value={d.city} maxLength={30} onChange={(e) => up("city", e.target.value)} className="inp" /></Field>
          <Field label="Favorite team">
            <div className="flex flex-wrap gap-2">
              {teams.map((t) => <button key={t} onClick={() => up("favTeam", t)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${d.favTeam === t ? "border-primary bg-primary/15 text-primary" : "bg-surface-2 text-muted-foreground"}`}>{t}</button>)}
            </div>
          </Field>
          <Field label={`Bio · ${d.bio.length}/120`}><textarea value={d.bio} maxLength={120} rows={3} onChange={(e) => up("bio", e.target.value)} className="inp resize-none" /></Field>
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[440px] p-4">
          <button disabled={!d.name.trim() || !d.username} onClick={() => { setProfile({ ...d, name: d.name.trim() }); onClose(); }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-display text-lg font-black uppercase text-primary-foreground shadow-glow disabled:opacity-50"><Check className="size-5" />Save profile</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-4"><div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>{children}</div>;
}
