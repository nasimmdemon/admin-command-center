import { useState } from "react";
import { StepTransformVoip } from "@/views/create-brand";

export const StepTransformVoipDemo = () => {
  const [phoneExtensionsAllowed, setPhoneExtensionsAllowed] = useState(true);
  const [allowedExtensionPhones, setAllowedExtensionPhones] = useState<string[]>([]);
  const [newAllowedExtensionPhone, setNewAllowedExtensionPhone] = useState("");
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [newCountryCode, setNewCountryCode] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [rejectedCodes, setRejectedCodes] = useState(["+1", "+44"]);
  const [newPhoneCode, setNewPhoneCode] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
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
      blockedCountries={blockedCountries}
      onBlockedCountriesChange={setBlockedCountries}
      newCountryCode={newCountryCode}
      onNewCountryCodeChange={setNewCountryCode}
      countryCodeError={countryCodeError}
      onCountryCodeErrorChange={setCountryCodeError}
      rejectedCodes={rejectedCodes}
      onRejectedCodesChange={setRejectedCodes}
      newPhoneCode={newPhoneCode}
      onNewPhoneCodeChange={setNewPhoneCode}
      phoneCodeError={phoneCodeError}
      onPhoneCodeErrorChange={setPhoneCodeError}
    />
  );
};
