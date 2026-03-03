import { useState } from "react";
import { StepTraderPlatform } from "@/views/create-brand";

export const StepTraderPlatformDemo = () => {
  const [value, setValue] = useState("DEALING_MENU_WEBTRADER");
  return <StepTraderPlatform value={value} onChange={setValue} />;
};
