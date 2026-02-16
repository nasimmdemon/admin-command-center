export const CommoditiesSymbols = {
  ARABICA:'ARABICA',
  COCOA:'COCOA',
  COFFEE:'COFFEE',
  CORN:'CORN',
  COTTON:'COTTON',
  ROBUSTA:'ROBUSTA',
  SOYBEAN:'SOYBEAN',
  SUGAR:'SUGAR',
  WHEAT:'WHEAT'
} as const;

export type CommoditiesSymbolsEnum = typeof CommoditiesSymbols[keyof typeof CommoditiesSymbols];
