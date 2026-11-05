import card1 from "@/assets/card-1.jpg";
import card2 from "@/assets/card-2.jpg";
import card3 from "@/assets/card-3.jpg";

export type Rarity = "common" | "rare" | "epic" | "legend";

export const attributes = [
  { key: "3PT", name: "3PT Shooting", level: 72, max: 99, next: 74, cost: 450, time: "2h 10m", group: "Offense" },
  { key: "MID", name: "Mid-Range", level: 68, max: 99, next: 70, cost: 380, time: "1h 30m", group: "Offense" },
  { key: "BH", name: "Ball Handling", level: 81, max: 99, next: 82, cost: 620, time: "4h 00m", group: "Playmaking" },
  { key: "PAS", name: "Passing", level: 77, max: 99, next: 78, cost: 520, time: "3h 15m", group: "Playmaking" },
  { key: "SPD", name: "Speed", level: 84, max: 99, next: 85, cost: 700, time: "5h 20m", group: "Athletic" },
  { key: "DEF", name: "Perimeter D", level: 63, max: 99, next: 65, cost: 260, time: "35m", group: "Defense" },
  { key: "REB", name: "Rebounding", level: 48, max: 99, next: 51, cost: 120, time: "8m", group: "Defense" },
] as const;

export const games = [
  { id: 1, home: "Al Riyadi", away: "Sagesse", hs: "RIY", as: "SAG", time: "LIVE · Q2 4:12", live: true, score: "38 – 34", odds: [1.6, 2.3] },
  { id: 2, home: "Beirut Club", away: "Homenetmen", hs: "BEI", as: "HMN", time: "Today · 20:30", live: false, odds: [1.9, 1.9] },
  { id: 3, home: "Dynamo", away: "Champville", hs: "DYN", as: "CHV", time: "Today · 22:00", live: false, odds: [2.1, 1.7] },
  { id: 4, home: "Antranik", away: "Mayrouba", hs: "ANT", as: "MAY", time: "Tomorrow · 19:00", live: false, odds: [1.8, 2.0] },
];

export const cards = [
  { id: 1, name: "Wael Arakji", team: "Al Riyadi", pos: "PG", rarity: "epic" as Rarity, img: card1, boosts: [["+5", "3PT"], ["+2", "MID"], ["-1", "REB"]], owned: true },
  { id: 2, name: "Hayk Gyokchyan", team: "Sagesse", pos: "C", rarity: "rare" as Rarity, img: card2, boosts: [["+4", "REB"], ["+2", "DEF"], ["-2", "SPD"]], owned: true },
  { id: 3, name: "Head Coach", team: "Beirut Club", pos: "HC", rarity: "legend" as Rarity, img: card3, boosts: [["+3", "PAS"], ["+3", "DEF"]], owned: true },
  { id: 4, name: "Amir Saoud", team: "Al Riyadi", pos: "SG", rarity: "common" as Rarity, img: card1, boosts: [["+2", "MID"], ["-1", "DEF"]], owned: true },
  { id: 5, name: "Ali Haidar", team: "Homenetmen", pos: "SF", rarity: "rare" as Rarity, img: card2, boosts: [["+3", "SPD"]], owned: false },
  { id: 6, name: "Karim Zeinoun", team: "Dynamo", pos: "PF", rarity: "common" as Rarity, img: card2, boosts: [["+2", "REB"]], owned: false },
];

export const teams = [
  { name: "Al Riyadi", have: 11, total: 14 },
  { name: "Sagesse", have: 9, total: 14 },
  { name: "Beirut Club", have: 6, total: 14 },
  { name: "Homenetmen", have: 4, total: 14 },
  { name: "Dynamo", have: 7, total: 14 },
  { name: "Champville", have: 2, total: 14 },
];

export const triviaTopics = [
  { id: "lbn", name: "Lebanese League", level: 7, levels: 20, xp: 120, tint: "primary" },
  { id: "nba", name: "NBA", level: 12, levels: 30, xp: 100, tint: "accent" },
  { id: "eur", name: "EuroLeague", level: 3, levels: 25, xp: 110, tint: "epic" },
  { id: "fiba", name: "FIBA & Asia Cup", level: 1, levels: 15, xp: 140, tint: "xp" },
];

export const rarityStyle: Record<Rarity, string> = {
  common: "ring-common/60 text-common",
  rare: "ring-rare text-rare",
  epic: "ring-epic text-epic",
  legend: "ring-legend text-legend",
};
