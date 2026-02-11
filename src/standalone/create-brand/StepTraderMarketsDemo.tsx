import { useState } from "react";
import { StepTraderMarkets } from "@/views/create-brand";

export const StepTraderMarketsDemo = () => {
  const [markets, setMarkets] = useState<Record<string, boolean>>({
    "CRYPTO - CFD'S": true, FOREX: true, COMMODITIES: true,
  });
  return <StepTraderMarkets markets={markets} onChange={setMarkets} />;
};
