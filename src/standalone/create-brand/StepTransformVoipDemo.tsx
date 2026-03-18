import { StepTransformVoip } from "@/views/create-brand";

export const StepTransformVoipDemo = () => (
  <StepTransformVoip
    brandLabel="Demo Brand"
    voipCoverageMap={{ RU: ["RU"], US: ["US", "CA", "MX"] }}
  />
);
