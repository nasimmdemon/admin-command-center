/**
 * Maps trader market category labels to their symbol arrays.
 * Used for expandable category selection with per-symbol toggles.
 */
import { ForexSymbols } from "./forex_symbols";
import { CryptoSymbols } from "./crypto_symbols";
import { CommoditiesSymbols } from "./commodities_symbols";
import { IndexSymbols } from "./index_symbols";
import { MetalsSymbols } from "./metals_symbols";
import { EnergySymbols } from "./energy_symbols";
import { ShareSymbols } from "./share_symbols";

export const MARKET_SYMBOLS_MAP: Record<string, readonly string[]> = {
  "CRYPTO - CFD'S": Object.values(CryptoSymbols),
  FOREX: Object.values(ForexSymbols),
  COMMODITIES: Object.values(CommoditiesSymbols),
  INDICES: Object.values(IndexSymbols),
  METALS: Object.values(MetalsSymbols),
  ENERGY: Object.values(EnergySymbols),
  STOCKS: Object.values(ShareSymbols),
} as const;

/** Market category labels in display order */
export const MARKET_CATEGORY_LABELS = [
  "CRYPTO - CFD'S",
  "FOREX",
  "COMMODITIES",
  "INDICES",
  "METALS",
  "ENERGY",
  "STOCKS",
] as const;

/** Build default symbol selection: all symbols from given categories set to true */
export function buildDefaultTraderMarkets(categories: string[]): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const cat of categories) {
    const symbols = MARKET_SYMBOLS_MAP[cat];
    if (symbols) for (const s of symbols) out[s] = true;
  }
  return out;
}
