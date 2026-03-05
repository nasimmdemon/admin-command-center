import { useState } from "react";
import { StepKyc } from "@/views/create-brand";

export const StepKycDemo = () => {
  const [brandHasKyc, setBrandHasKyc] = useState(true);
  const [brandRequiresKycToTrade, setBrandRequiresKycToTrade] = useState(true);
  const [kycRequireSelfie, setKycRequireSelfie] = useState(false);
  const [kycDocs, setKycDocs] = useState<Record<string, boolean>>({ Passport: false, "ID": false, "Utility Bill": false, "Driver Licence": false });
  const [kycSpecificDocumentClientNeeds, setKycSpecificDocumentClientNeeds] = useState("");
  return (
    <StepKyc
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      brandHasKyc={brandHasKyc}
      onBrandHasKycChange={setBrandHasKyc}
      brandRequiresKycToTrade={brandRequiresKycToTrade}
      onBrandRequiresKycToTradeChange={setBrandRequiresKycToTrade}
      kycRequireSelfie={kycRequireSelfie}
      onKycRequireSelfieChange={setKycRequireSelfie}
      kycDocs={kycDocs}
      onKycDocsChange={setKycDocs}
      kycSpecificDocumentClientNeeds={kycSpecificDocumentClientNeeds}
      onKycSpecificDocumentClientNeedsChange={setKycSpecificDocumentClientNeeds}
    />
  );
};
