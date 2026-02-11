import { useState } from "react";
import { StepKyc } from "@/views/create-brand";

export const StepKycDemo = () => {
  const [kycEnabled, setKycEnabled] = useState(true);
  const [kycDocs, setKycDocs] = useState<Record<string, boolean>>({ Passport: false, "ID": false, "Utility Bill": false, "Require Selfie": false });
  return (
    <StepKyc
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      kycEnabled={kycEnabled}
      onKycEnabledChange={setKycEnabled}
      kycDocs={kycDocs}
      onKycDocsChange={setKycDocs}
    />
  );
};
