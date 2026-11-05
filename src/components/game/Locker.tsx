import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X, Check, Sparkles, ScanFace, Shirt, Watch, User, Loader2, RotateCcw } from "lucide-react";
import { faces, getLook, looks, previewFor, setLook, sides, useLook, type Side } from "@/lib/avatar-store";
import { gearItems, hairStyles, skinTones, type AvatarSpec } from "@/lib/avatar-spec";
import { renderAvatar } from "@/lib/avatar.functions";
import { Avatar } from "./Avatar";

type Tab = "face" | "body" | "attire" | "gear";

async function toDataUrl(src: string) {
  const blob = await (await fetch(src)).blob();
  return await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(blob); });
}

export function Locker({ onClose }: { onClose: () => void }) {
  const look = useLook();
  const [tab, setTab] = useState<Tab>("face");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const render = useServerFn(renderAvatar);

  async function doRender() {
    setBusy(true); setErr(null);
    try {
      const l = getLook();
      const { render: _r, dirty: _d, ...spec } = l;
      const base = await toDataUrl(looks[l.kit].none);
      const face = l.face !== null ? await toDataUrl(faces[l.face]!) : null;
      const res = await render({ data: { spec: spec as AvatarSpec, base, face } });
      if (res.ok) setLook({ render: res.image, dirty: false }, false);
      else setErr(res.error);
    } catch {
      setErr("Render failed. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-background">
      <div className="flex w-full max-w-[440px] flex-col">
        <Avatar className="h-[46vh] shrink-0" priority>
          <div className="flex items-center justify-between p-4">
            <div className="glass rounded-full border px-3 py-1 font-display text-sm font-black uppercase">Locker room</div>
            <button onClick={onClose} aria-label="Close" className="glass rounded-full border p-2"><X className="size-4" /></button>
          </div>
          {look.render && !busy && (
            <button onClick={() => setLook({ render: null })} className="glass absolute left-4 top-14 flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase"><RotateCcw className="size-3" />Reset render</button>
          )}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-background/50 backdrop-blur-[2px]">
              <div className="scan-line absolute inset-x-0 h-24" />
              <div className="glass rounded-2xl border px-4 py-3 text-center">
                <Loader2 className="mx-auto mb-1 size-6 animate-spin text-primary" />
                <div className="font-display text-lg font-black uppercase">Building your player</div>
                <div className="text-[11px] text-muted-foreground">Scanning face · tailoring kit · ~20s</div>
              </div>
            </div>
          )}
          <div className="absolute bottom-3 right-4 font-display text-6xl font-black text-foreground/15">#{look.number}</div>
        </Avatar>

        <div className="-mt-4 flex min-h-0 flex-1 flex-col rounded-t-3xl border-t bg-surface">
          <div className="grid grid-cols-4 gap-1 p-3 pb-2">
            {([["face", "Face", ScanFace], ["body", "Body", User], ["attire", "Attire", Shirt], ["gear", "Gear", Watch]] as const).map(([k, l, I]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-black uppercase ${tab === k ? "bg-gradient-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"}`}>
                <I className="size-4" />{l}
              </button>
            ))}
          </div>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-3">
            {tab === "face" && (
              <>
                <Label>Face scan</Label>
                <div className="grid grid-cols-4 gap-2">
                  <FaceTile on={look.face === null} onClick={() => setLook({ face: null })}><img src={previewFor(look)} alt="Default" className="h-full w-full scale-[3] object-cover object-[50%_3%] origin-top" /></FaceTile>
                  {faces.map((f, i) => (
                    <FaceTile key={i} on={look.face === i} onClick={() => setLook({ face: i })}><img src={f} alt={`Face ${i + 1}`} loading="lazy" className="h-full w-full object-cover" /></FaceTile>
                  ))}
                </div>
                <Label>Sculpt</Label>
                <Slider label="Jawline" lo="Soft" hi="Sharp" v={look.jaw} on={(v) => setLook({ jaw: v })} />
                <Slider label="Beard" lo="Clean" hi="Full" v={look.beard} on={(v) => setLook({ beard: v })} />
                <Slider label="Eyebrows" lo="Thin" hi="Bold" v={look.brows} on={(v) => setLook({ brows: v })} />
              </>
            )}

            {tab === "body" && (
              <>
                <Label>Skin tone</Label>
                <div className="flex justify-between">
                  {skinTones.map((s) => (
                    <button key={s.id} aria-label={s.label} onClick={() => setLook({ skin: s.id })} className={`size-11 rounded-full border-2 transition ${look.skin === s.id ? "scale-110 border-primary shadow-glow" : "border-border"}`} style={{ background: s.color }} />
                  ))}
                </div>
                <Label>Hairstyle</Label>
                <div className="grid grid-cols-2 gap-2">
                  {hairStyles.map((h) => <Chip key={h.id} on={look.hair === h.id} onClick={() => setLook({ hair: h.id })}>{h.label}</Chip>)}
                </div>
              </>
            )}

            {tab === "attire" && (
              <>
                <Label>Kit</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["black", "white", "red"] as const).map((k) => (
                    <button key={k} onClick={() => setLook({ kit: k })} className={`overflow-hidden rounded-2xl border-2 bg-surface-2 ${look.kit === k ? "border-primary shadow-glow" : "border-transparent"}`}>
                      <img src={looks[k].none} alt={k} loading="lazy" className="aspect-square w-full object-cover object-[50%_28%]" />
                      <div className="py-1.5 text-[11px] font-bold">{{ black: "Away Ember", white: "Home Classic", red: "Cedar Pride" }[k]}</div>
                    </button>
                  ))}
                </div>
                <Label>Jersey number</Label>
                <div className="flex items-center gap-3">
                  <input inputMode="numeric" maxLength={2} value={look.number} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 2); setLook({ number: v || "0" }); }}
                    className="w-24 rounded-2xl border bg-surface-2 py-3 text-center font-display text-4xl font-black outline-none focus:border-primary" />
                  <div className="flex flex-wrap gap-1.5">
                    {["0", "3", "7", "10", "23", "30"].map((n) => <button key={n} onClick={() => setLook({ number: n })} className={`rounded-lg px-2.5 py-1.5 font-display font-black ${look.number === n ? "bg-primary text-primary-foreground" : "bg-surface-2"}`}>{n}</button>)}
                  </div>
                </div>
                <Label>Headwear</Label>
                <div className="grid grid-cols-3 gap-2">
                  {([["none", "None"], ["headband", "Headband"], ["tied-headband", "Tied band"]] as const).map(([v, l]) => <Chip key={v} on={look.headwear === v} onClick={() => setLook({ headwear: v })}>{l}</Chip>)}
                </div>
                <Label>Eyewear</Label>
                <div className="grid grid-cols-3 gap-2">
                  {([["none", "None"], ["goggles", "Sport goggles"]] as const).map(([v, l]) => <Chip key={v} on={look.eyewear === v} onClick={() => setLook({ eyewear: v })}>{l}</Chip>)}
                </div>
              </>
            )}

            {tab === "gear" && (
              <>
                <Label>Accessories · choose side</Label>
                <div className="space-y-2">
                  {gearItems.map((g) => (
                    <div key={g.id} className="rounded-2xl bg-surface-2 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-bold">{g.label}</span>
                        <BodyMini kind={g.kind} side={look[g.id]} />
                      </div>
                      <div className="grid grid-cols-4 gap-1 rounded-xl bg-background/50 p-1">
                        {sides.map((s) => (
                          <button key={s} onClick={() => setLook({ [g.id]: s } as Partial<AvatarSpec>)}
                            className={`rounded-lg py-1.5 text-[11px] font-black uppercase ${look[g.id] === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                            {s === "none" ? "Off" : s === "left" ? "L" : s === "right" ? "R" : "Both"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="border-t p-3">
            {err && <div className="mb-2 rounded-xl bg-destructive/15 px-3 py-2 text-xs font-semibold text-destructive">{err}</div>}
            <div className="flex gap-2">
              <button onClick={onClose} className="rounded-2xl bg-surface-2 px-5 font-display font-black uppercase">Done</button>
              <button onClick={doRender} disabled={busy || (!look.dirty && !!look.render)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 font-display text-lg font-black uppercase text-primary-foreground shadow-glow disabled:opacity-50">
                {busy ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                {busy ? "Rendering…" : look.dirty || !look.render ? "Render my player" : "Up to date"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground first:mt-1">{children}</div>;
}
function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-between rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition active:scale-95 ${on ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-surface-2"}`}>
      {children}{on && <Check className="size-4" strokeWidth={3} />}
    </button>
  );
}
function FaceTile({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className={`relative aspect-square overflow-hidden rounded-2xl border-2 ${on ? "border-primary shadow-glow" : "border-transparent"}`}>{children}{on && <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" strokeWidth={3} /></span>}</button>;
}
function Slider({ label, lo, hi, v, on }: { label: string; lo: string; hi: string; v: number; on: (n: number) => void }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs font-bold"><span>{label}</span><span className="text-muted-foreground">{lo} · {hi}</span></div>
      <input type="range" min={0} max={100} value={v} onChange={(e) => on(+e.target.value)} className="w-full accent-[var(--primary)]" />
    </div>
  );
}
/** Tiny body diagram highlighting the chosen limb(s). Player's left = viewer's right. */
function BodyMini({ kind, side }: { kind: "arm" | "leg"; side: Side }) {
  const L = side === "left" || side === "both", R = side === "right" || side === "both";
  const c = (on: boolean) => (on ? "var(--primary)" : "var(--muted)");
  return (
    <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden>
      <circle cx="17" cy="5" r="4" fill="var(--muted)" />
      <rect x="11" y="10" width="12" height="14" rx="3" fill="var(--muted)" />
      <rect x="5" y="11" width="5" height="13" rx="2.5" fill={kind === "arm" ? c(R) : "var(--muted)"} />
      <rect x="24" y="11" width="5" height="13" rx="2.5" fill={kind === "arm" ? c(L) : "var(--muted)"} />
      <rect x="11" y="25" width="5" height="14" rx="2.5" fill={kind === "leg" ? c(R) : "var(--muted)"} />
      <rect x="18" y="25" width="5" height="14" rx="2.5" fill={kind === "leg" ? c(L) : "var(--muted)"} />
    </svg>
  );
}
