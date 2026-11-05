import { useSyncExternalStore } from "react";
import blackNone from "@/assets/avatar/black-none.jpg";
import blackHeadband from "@/assets/avatar/black-headband.jpg";
import blackGlasses from "@/assets/avatar/black-glasses.jpg";
import whiteNone from "@/assets/avatar/white-none.jpg";
import whiteHeadband from "@/assets/avatar/white-headband.jpg";
import whiteGlasses from "@/assets/avatar/white-glasses.jpg";
import redNone from "@/assets/avatar/red-none.jpg";
import redHeadband from "@/assets/avatar/red-headband.jpg";
import redGlasses from "@/assets/avatar/red-glasses.jpg";

export type Kit = "black" | "white" | "red";
export type Accessory = "none" | "headband" | "glasses";
export type Look = { kit: Kit; acc: Accessory };

export const looks: Record<Kit, Record<Accessory, string>> = {
  black: { none: blackNone, headband: blackHeadband, glasses: blackGlasses },
  white: { none: whiteNone, headband: whiteHeadband, glasses: whiteGlasses },
  red: { none: redNone, headband: redHeadband, glasses: redGlasses },
};

export const kits: { id: Kit; name: string; swatch: string }[] = [
  { id: "black", name: "Away Ember", swatch: "bg-background ring-primary" },
  { id: "white", name: "Home Classic", swatch: "bg-foreground ring-primary" },
  { id: "red", name: "Cedar Pride", swatch: "bg-destructive ring-foreground" },
];

export const accessories: { id: Accessory; name: string; stat?: string }[] = [
  { id: "none", name: "None" },
  { id: "headband", name: "Headband", stat: "+1 Stamina" },
  { id: "glasses", name: "Sport goggles", stat: "+1 Focus" },
];

const KEY = "fg-look";
const initial: Look = { kit: "black", acc: "none" };
let state: Look = initial;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (v?.kit && v?.acc) state = v;
  } catch {}
}

export function setLook(patch: Partial<Look>) {
  state = { ...state, ...patch };
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((f) => f());
}

export function useLook(): Look {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      if (!loaded) { load(); cb(); }
      return () => subs.delete(cb);
    },
    () => state,
    () => initial,
  );
}
