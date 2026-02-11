import { useState } from "react";
import { StepTerms } from "@/views/create-brand";

export const StepTermsDemo = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");
  return (
    <StepTerms
      brandLabel="Demo Brand"
      brandDomain="demo.com"
      privacyPolicy={privacyPolicy}
      terms={terms}
      onPrivacyPolicyChange={setPrivacyPolicy}
      onTermsChange={setTerms}
    />
  );
};
