export const TTT_GROUPS = [
  { name: "Glasse 13 (メガネ13)", year: 2016 },
  { name: "Cirque du Soleil (太陽のサーカス団)", year: 2017 },
  { name: "Koju Ryoran (交樹繚乱)", year: 2018 },
  { name: "23Constellation (23星系)", year: 2018 },
  { name: "24SolarTerms (24節季)", year: 2019 },
  { name: "A Drop", year: 2019 },
  { name: "101+", year: 2020 },
  { name: "DreamShip15 (ドリームシップ15)", year: 2021 },
  { name: "FIreWorks (ファイヤーワークス)", year: 2024 },
  { name: "Dandelion (蒲公英)", year: 2025 },
  { name: "HUGMONSTER (ハグモン)", year: 2025 },
  { name: "Torch Knights (火把騎士)", year: 2026 },
] as const;

export const TTT_GROUP_NAMES = TTT_GROUPS.map((g) => g.name) as [string, ...string[]];

export function yearForTttGroup(name: string): number | undefined {
  return TTT_GROUPS.find((g) => g.name === name)?.year;
}
