export enum Rarity {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
  ULTRA_RARE = "Ultra Rare",
  SECRET_RARE = "Secret Rare",
}

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  description: string;
  type: "Fire" | "Water" | "Grass" | "Electric" | "Psychic" | "Fighting" | "Dark" | "Steel" | "Dragon" | "Normal";
  hp: number;
}

export interface Pack {
  id: string;
  name: string;
  cards: Card[];
}

export interface Collection {
  [cardId: string]: number; // cardId -> count
}
