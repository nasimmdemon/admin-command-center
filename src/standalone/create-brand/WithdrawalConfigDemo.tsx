import { useState } from "react";
import WithdrawalConfigStep from "@/components/brand-wizard/WithdrawalConfigStep";
import { DEFAULT_WITHDRAWAL_METHODS, DEFAULT_GLOBAL_SETTINGS, DEFAULT_BANK_DETAILS, DEFAULT_WIRE_DETAILS } from "@/types/brand-config";

export const WithdrawalConfigDemo = () => {
  const [methods, setMethods] = useState({ ...DEFAULT_WITHDRAWAL_METHODS });
  const [globalSettings, setGlobalSettings] = useState({ ...DEFAULT_GLOBAL_SETTINGS });
  const [bankDetails, setBankDetails] = useState({ ...DEFAULT_BANK_DETAILS });
  const [wireDetails, setWireDetails] = useState({ ...DEFAULT_WIRE_DETAILS });
  return (
    <WithdrawalConfigStep
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      methods={methods}
      onMethodsChange={setMethods}
      globalSettings={globalSettings}
      onGlobalSettingsChange={setGlobalSettings}
      withdrawalBankDetails={bankDetails}
      onWithdrawalBankDetailsChange={setBankDetails}
      withdrawalWireDetails={wireDetails}
      onWithdrawalWireDetailsChange={setWireDetails}
    />
  );
};
