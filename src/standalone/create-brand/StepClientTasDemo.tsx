import { useState } from "react";
import { StepClientTas } from "@/views/create-brand";

export const StepClientTasDemo = () => {
  const [allowMultiTas, setAllowMultiTas] = useState(true);
  const [maxPerClient, setMaxPerClient] = useState("3");
  const [maxLeverage, setMaxLeverage] = useState("100");
  return (
    <StepClientTas
      allowMultiTas={allowMultiTas}
      onAllowMultiTasChange={setAllowMultiTas}
      maxPerClient={maxPerClient}
      onMaxPerClientChange={setMaxPerClient}
      maxLeverage={maxLeverage}
      onMaxLeverageChange={setMaxLeverage}
    />
  );
};
