export const EnergySymbols = {
  XBRUSD:'XBRUSD',
  XNGUSD:'XNGUSD',
  XTIUSD:'XTIUSD'
} as const;

export type EnergySymbolsEnum = typeof EnergySymbols[keyof typeof EnergySymbols];
