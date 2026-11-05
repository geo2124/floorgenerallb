import { useSyncExternalStore } from "react";

export type Profile = { name: string; username: string; city: string; favTeam: string; bio: string; photo: string | null };

const initial: Profile = { name: "Khaled Ayoubi", username: "k.ayoubi", city: "Beirut", favTeam: "Al Riyadi", bio: "Floor general. Pass first, shoot when it matters.", photo: null };
const KEY = "fg-profile-v1";
let state = initial;
let loaded = false;
const subs = new Set<() => void>();

export function setProfile(p: Partial<Profile>) {
  state = { ...state, ...p };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  subs.forEach((f) => f());
}

export function shortName(n: string) {
  const parts = n.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]![0]}. ${parts.slice(1).join(" ")}` : n;
}

export function useProfile(): Profile {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      if (!loaded && typeof window !== "undefined") {
        loaded = true;
        try { const v = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (v?.name) state = { ...initial, ...v }; } catch {}
        cb();
      }
      return () => subs.delete(cb);
    },
    () => state,
    () => initial,
  );
}
