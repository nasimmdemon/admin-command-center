export const IndexSymbols = {
  AEX25:'AEX25',
  AU200:'AU200',
  CAC40:'CAC40',
  DAX40:'DAX40',
  EU50:'EU50',
  FTSEA50:'FTSEA50',
  HK50:'HK50',
  IBEX35:'IBEX35',
  JP225:'JP225',
  NAS100:'NAS100',
  RUSSELL2000:'RUSSELL2000',
  SG20:'SG20',
  TWSECAP:'TWSECAP',
  UK100:'UK100',
  US30:'US30',
  US500:'US500',
  USDInd:'USDInd'
} as const;

export type IndexSymbolsEnum = typeof IndexSymbols[keyof typeof IndexSymbols];
