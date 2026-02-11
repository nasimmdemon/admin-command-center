import { useState } from "react";
import { StepTradingFees } from "@/views/create-brand";

export const StepTradingFeesDemo = () => {
  const [openPosition, setOpenPosition] = useState({ enabled: false, type: "fixed" as const, value: "0" });
  const [closePosition, setClosePosition] = useState({ enabled: false, type: "fixed" as const, value: "0" });
  return (
    <StepTradingFees
      openPosition={openPosition}
      onOpenPositionChange={(v) => setOpenPosition((p) => ({ ...p, ...v }))}
      closePosition={closePosition}
      onClosePositionChange={(v) => setClosePosition((p) => ({ ...p, ...v }))}
      currency="USD"
    />
  );
};
