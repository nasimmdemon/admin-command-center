import { useState } from "react";
import { StepClientTas } from "@/views/create-brand";

export const StepClientTasDemo = () => {
  const [allowMultiTas, setAllowMultiTas] = useState(true);
  const [maxPerClient, setMaxPerClient] = useState("3");
  const [allowClientSelectLeverage, setAllowClientSelectLeverage] = useState(true);
  const [maxLeverage, setMaxLeverage] = useState("100");
  return (
    <StepClientTas
      allowMultiTas={allowMultiTas}
      onAllowMultiTasChange={setAllowMultiTas}
      maxPerClient={maxPerClient}
      onMaxPerClientChange={setMaxPerClient}
      allowClientSelectLeverage={allowClientSelectLeverage}
      onAllowClientSelectLeverageChange={(v) => {
        setAllowClientSelectLeverage(v);
        if (!v) setMaxLeverage("1");
      }}
      maxLeverage={maxLeverage}
      onMaxLeverageChange={setMaxLeverage}
    />
  );
};
