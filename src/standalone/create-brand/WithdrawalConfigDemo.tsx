import { useState } from "react";
import WithdrawalConfigStep from "@/components/brand-wizard/WithdrawalConfigStep";
import { DEFAULT_WITHDRAWAL_METHODS, DEFAULT_GLOBAL_SETTINGS } from "@/types/brand-config";

export const WithdrawalConfigDemo = () => {
  const [methods, setMethods] = useState({ ...DEFAULT_WITHDRAWAL_METHODS });
  const [globalSettings, setGlobalSettings] = useState({ ...DEFAULT_GLOBAL_SETTINGS });
  return (
    <WithdrawalConfigStep
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      methods={methods}
      onMethodsChange={setMethods}
      globalSettings={globalSettings}
      onGlobalSettingsChange={setGlobalSettings}
    />
  );
};
