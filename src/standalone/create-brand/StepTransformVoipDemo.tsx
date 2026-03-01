import { useState } from "react";
import { StepTransformVoip } from "@/views/create-brand";

export const StepTransformVoipDemo = () => {
  const [phoneExtensionsAllowed, setPhoneExtensionsAllowed] = useState(true);
  const [allowedExtensionPhones, setAllowedExtensionPhones] = useState<string[]>([]);
  const [newAllowedExtensionPhone, setNewAllowedExtensionPhone] = useState("");
  return (
    <StepTransformVoip
      brandLabel="Demo Brand"
      voipCoverageMap={{ RU: ["RU"], US: ["US", "CA", "MX"] }}
      phoneExtensionsAllowed={phoneExtensionsAllowed}
      onPhoneExtensionsAllowedChange={setPhoneExtensionsAllowed}
      allowedExtensionPhones={allowedExtensionPhones}
      newAllowedExtensionPhone={newAllowedExtensionPhone}
      onAllowedExtensionPhonesChange={setAllowedExtensionPhones}
      onNewAllowedExtensionPhoneChange={setNewAllowedExtensionPhone}
    />
  );
};
