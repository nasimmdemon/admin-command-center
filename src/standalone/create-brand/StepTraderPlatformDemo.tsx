import { useState } from "react";
import { StepTraderPlatform } from "@/views/create-brand";

export const StepTraderPlatformDemo = () => {
  const [value, setValue] = useState("MT5");
  return <StepTraderPlatform value={value} onChange={setValue} />;
};
