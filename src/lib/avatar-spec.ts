import { z } from "zod";

export const sideEnum = z.enum(["none", "left", "right", "both"]);
export type Side = z.infer<typeof sideEnum>;

export const skinTones = [
  { id: "porcelain", label: "Porcelain", color: "#f1d3bd" },
  { id: "light", label: "Light", color: "#e0b393" },
  { id: "olive", label: "Olive", color: "#c49a6c" },
  { id: "medium", label: "Medium", color: "#a26e4a" },
  { id: "brown", label: "Brown", color: "#7a4a2c" },
  { id: "deep", label: "Deep", color: "#4b2c1a" },
] as const;

export const hairStyles = [
  { id: "buzz", label: "Buzz cut" },
  { id: "short-curls", label: "Short curls" },
  { id: "fade", label: "High fade" },
  { id: "afro", label: "Afro" },
  { id: "braids", label: "Cornrows" },
  { id: "dreads", label: "Dreads" },
  { id: "slick", label: "Slicked back" },
  { id: "bald", label: "Bald" },
] as const;

export const gearItems = [
  { id: "armSleeve", label: "Arm sleeve", kind: "arm" },
  { id: "wristband", label: "Wristband", kind: "arm" },
  { id: "fingerTape", label: "Finger tape", kind: "arm" },
  { id: "kneePad", label: "Knee pad", kind: "leg" },
  { id: "legSleeve", label: "Leg sleeve", kind: "leg" },
] as const;

export const avatarSpecSchema = z.object({
  kit: z.enum(["black", "white", "red"]),
  face: z.number().int().min(0).max(5).nullable(),
  skin: z.enum(skinTones.map((s) => s.id) as [string, ...string[]]),
  hair: z.enum(hairStyles.map((s) => s.id) as [string, ...string[]]),
  number: z.string().regex(/^\d{1,2}$/),
  jaw: z.number().min(0).max(100),
  beard: z.number().min(0).max(100),
  brows: z.number().min(0).max(100),
  headwear: z.enum(["none", "headband", "tied-headband"]),
  eyewear: z.enum(["none", "goggles"]),
  armSleeve: sideEnum,
  wristband: sideEnum,
  kneePad: sideEnum,
  legSleeve: sideEnum,
  fingerTape: sideEnum,
});
export type AvatarSpec = z.infer<typeof avatarSpecSchema>;

const kitText = {
  black: "black jersey and shorts with orange trim, black and orange sneakers",
  white: "white jersey and shorts with orange trim, white and orange sneakers",
  red: "deep red jersey and shorts with white trim and a white cedar emblem, red sneakers",
};

function sideText(side: Side, item: string, limb: "arm" | "leg") {
  if (side === "none") return `no ${item}`;
  if (side === "both") return `${item} on both ${limb}s`;
  return `${item} on his ${side} ${limb} only (the ${limb} on the viewer's ${side === "left" ? "right" : "left"})`;
}

const lvl = (v: number, lo: string, mid: string, hi: string) => (v < 34 ? lo : v > 66 ? hi : mid);

export function buildAvatarPrompt(s: AvatarSpec, hasFaceRef: boolean) {
  const skin = skinTones.find((t) => t.id === s.skin)!.label.toLowerCase();
  const hair = hairStyles.find((h) => h.id === s.hair)!.label.toLowerCase();
  return [
    "Edit the first image: keep the exact same full-body pose, framing, camera, studio lighting, dark background and reflective floor. Ultra realistic NBA 2K26 video game character render quality, photoreal skin and fabric.",
    hasFaceRef ? "Give the player the face and facial identity of the person in the second image." : "Keep the same face.",
    `Skin tone: ${skin}. Hairstyle: ${hair}.`,
    `Jawline ${lvl(s.jaw, "soft and rounded", "balanced", "very sharp and chiseled")}, ${lvl(s.beard, "clean shaven", "light stubble beard", "full thick beard")}, ${lvl(s.brows, "thin eyebrows", "natural eyebrows", "thick bold eyebrows")}.`,
    `Uniform: ${kitText[s.kit]}, jersey number ${s.number} clearly on the chest. No brand logos, no other text.`,
    s.headwear === "headband" ? "Wearing an athletic headband on the forehead." : s.headwear === "tied-headband" ? "Wearing a ninja-style tied headband with tails." : "No headband.",
    s.eyewear === "goggles" ? "Wearing black-framed sports goggles." : "No glasses.",
    `${sideText(s.armSleeve, "a compression arm sleeve", "arm")}; ${sideText(s.wristband, "a wristband", "arm")}; ${sideText(s.fingerTape, "white finger tape", "arm")}; ${sideText(s.kneePad, "a padded knee sleeve", "leg")}; ${sideText(s.legSleeve, "a full-length compression leg sleeve", "leg")}.`,
  ].join(" ");
}
