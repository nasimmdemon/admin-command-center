import { useState } from "react";
import { StepTraderMarkets } from "@/views/create-brand";
import { buildDefaultTraderMarkets } from "@/lib/symbol-enums/market_symbols_map";

export const StepTraderMarketsDemo = () => {
  const [markets, setMarkets] = useState<Record<string, boolean>>(
    buildDefaultTraderMarkets(["CRYPTO - CFD'S", "FOREX", "COMMODITIES"])
  );
  return <StepTraderMarkets markets={markets} onChange={setMarkets} />;
};
