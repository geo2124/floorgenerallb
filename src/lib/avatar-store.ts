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
import face1 from "@/assets/faces/face-1.jpg";
import face2 from "@/assets/faces/face-2.jpg";
import face3 from "@/assets/faces/face-3.jpg";
import face4 from "@/assets/faces/face-4.jpg";
import face5 from "@/assets/faces/face-5.jpg";
import face6 from "@/assets/faces/face-6.jpg";
import type { AvatarSpec, Side } from "./avatar-spec";

export type { AvatarSpec, Side } from "./avatar-spec";
export type Kit = AvatarSpec["kit"];
export type Accessory = "none" | "headband" | "glasses";

export const looks: Record<Kit, Record<Accessory, string>> = {
  black: { none: blackNone, headband: blackHeadband, glasses: blackGlasses },
  white: { none: whiteNone, headband: whiteHeadband, glasses: whiteGlasses },
  red: { none: redNone, headband: redHeadband, glasses: redGlasses },
};
export const faces = [face1, face2, face3, face4, face5, face6];

export type Look = AvatarSpec & { render: string | null; dirty: boolean };

const initial: Look = {
  kit: "black", face: null, skin: "medium", hair: "short-curls", number: "7",
  jaw: 50, beard: 30, brows: 50,
  headwear: "none", eyewear: "none",
  armSleeve: "left", wristband: "none", kneePad: "none", legSleeve: "none", fingerTape: "none",
  render: null, dirty: false,
};

/** Best matching pre-rendered photo while no custom render exists. */
export function previewFor(l: Look) {
  const acc: Accessory = l.eyewear !== "none" ? "glasses" : l.headwear !== "none" ? "headband" : "none";
  return looks[l.kit][acc];
}

const KEY = "fg-look-v2";
let state: Look = initial;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (v?.kit) state = { ...initial, ...v };
  } catch {}
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { try { localStorage.setItem(KEY, JSON.stringify({ ...state, render: null })); } catch {} }
}

export function setLook(patch: Partial<Look>, markDirty = true) {
  state = { ...state, ...patch, dirty: markDirty ? true : (patch.dirty ?? state.dirty) };
  persist();
  subs.forEach((f) => f());
}

export function getLook() { return state; }

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

export const sides: Side[] = ["none", "left", "right", "both"];
