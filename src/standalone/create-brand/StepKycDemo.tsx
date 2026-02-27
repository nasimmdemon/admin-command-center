import { useState } from "react";
import { StepKyc } from "@/views/create-brand";

export const StepKycDemo = () => {
  const [kycEnabled, setKycEnabled] = useState(true);
  const [kycRequireSelfie, setKycRequireSelfie] = useState(false);
  const [kycDocs, setKycDocs] = useState<Record<string, boolean>>({ Passport: false, "ID": false, "Utility Bill": false, "Driver Licence": false });
  return (
    <StepKyc
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      kycEnabled={kycEnabled}
      onKycEnabledChange={setKycEnabled}
      kycRequireSelfie={kycRequireSelfie}
      onKycRequireSelfieChange={setKycRequireSelfie}
      kycDocs={kycDocs}
      onKycDocsChange={setKycDocs}
    />
  );
};
