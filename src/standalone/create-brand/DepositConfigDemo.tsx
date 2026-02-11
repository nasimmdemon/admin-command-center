import { useState } from "react";
import DepositConfigStep from "@/components/brand-wizard/DepositConfigStep";
import { DEFAULT_DEPOSIT_METHODS, DEFAULT_BANK_DETAILS, DEFAULT_WIRE_DETAILS } from "@/types/brand-config";

export const DepositConfigDemo = () => {
  const [methods, setMethods] = useState({ ...DEFAULT_DEPOSIT_METHODS });
  const [bankDetails, setBankDetails] = useState({ ...DEFAULT_BANK_DETAILS });
  const [wireDetails, setWireDetails] = useState({ ...DEFAULT_WIRE_DETAILS });
  return (
    <DepositConfigStep
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      methods={methods}
      onMethodsChange={setMethods}
      bankDetails={bankDetails}
      onBankDetailsChange={setBankDetails}
      wireDetails={wireDetails}
      onWireDetailsChange={setWireDetails}
    />
  );
};
