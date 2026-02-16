export const MetalsSymbols = {
  XAGUSD:'XAGUSD',
  XALUSD:'XALUSD',
  XAUUSD:'XAUUSD',
  XCPUSD:'XCPUSD',
  XPDUSD:'XPDUSD',
  XPTUSD:'XPTUSD',
  XZNUSD:'XZNUSD'
} as const;

export type MetalsSymbolsEnum = typeof MetalsSymbols[keyof typeof MetalsSymbols];
