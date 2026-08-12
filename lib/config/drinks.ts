export interface SignatureDrink {
  readonly id: string;
  readonly name: string;
}

export const SIGNATURE_DRINKS: readonly SignatureDrink[] = [
  { id: 'hibiscus-blossom', name: 'Hibiscus Blossom' },
  { id: 'ginger-dragon', name: 'Ginger Dragon' },
  { id: 'garden-sparkler', name: 'Garden Sparkler' },
  { id: 'pineapple-sunrise', name: 'Pineapple Sunrise' },
] as const;

export const SIGNATURE_DRINK_IDS = SIGNATURE_DRINKS.map((d) => d.id);

export const BASES = ['Lemonade', 'Tea', 'Soda', 'Juice'] as const;
export const PUREES = ['Mango', 'Strawberry', 'Raspberry', 'Banana', 'Peach', 'Passionfruit'] as const;
export const SYRUPS = ['Rose', 'Lavender', 'Mint', 'Vanilla', 'Dragonfruit'] as const;
export const GARNISHES = ['Dried Fruit', 'Flowers', 'Coconut Shreds', 'Fresh Fruit', 'Candied Ginger', 'Herbs', 'Glitter'] as const;

export type Base = typeof BASES[number];
export type Puree = typeof PUREES[number];
export type Syrup = typeof SYRUPS[number];
export type Garnish = typeof GARNISHES[number];
