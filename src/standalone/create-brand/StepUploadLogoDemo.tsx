import { useState } from "react";
import { StepUploadLogo } from "@/views/create-brand";

export const StepUploadLogoDemo = () => {
  const [logoUrl, setLogoUrl] = useState("");
  return (
    <StepUploadLogo
      brands={[{ name: "Demo Brand", domain: "demo.com" }, { name: "Brand 2", domain: "brand2.com" }]}
      logoUrl={logoUrl}
      onLogoChange={setLogoUrl}
    />
  );
};
