import { StepUploadLogo } from "@/views/create-brand";

export const StepUploadLogoDemo = () => (
  <StepUploadLogo brands={[{ name: "Demo Brand", domain: "demo.com" }, { name: "Brand 2", domain: "brand2.com" }]} />
);
