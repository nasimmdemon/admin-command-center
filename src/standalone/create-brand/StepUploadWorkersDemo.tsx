import { StepUploadWorkers } from "@/views/create-brand";

export const StepUploadWorkersDemo = () => (
  <StepUploadWorkers brands={[{ name: "Demo Brand", domain: "demo.com", substituteDomain: "demo.com" }, { name: "Brand 2", domain: "brand2.com", substituteDomain: "brand2.com" }]} />
);
