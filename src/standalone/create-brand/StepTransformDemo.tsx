import { useState } from "react";
import { StepTransformVoip, StepTransformEmails } from "@/views/create-brand";

export const StepTransformDemo = () => {
  const [phoneExtensionsAllowed, setPhoneExtensionsAllowed] = useState(true);
  const [allowedExtensionPhones, setAllowedExtensionPhones] = useState<string[]>([]);
  const [newAllowedExtensionPhone, setNewAllowedExtensionPhone] = useState("");
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [newCountryCode, setNewCountryCode] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [rejectedCodes, setRejectedCodes] = useState(["+1", "+44"]);
  const [newPhoneCode, setNewPhoneCode] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [autoGenPasswordForLeads, setAutoGenPasswordForLeads] = useState(true);
  const [autoRejectNoInteractivity, setAutoRejectNoInteractivity] = useState(true);
  const [blockedEmailProviders, setBlockedEmailProviders] = useState(["tempmail.com", "guerrillamail.com"]);
  const [newEmailProvider, setNewEmailProvider] = useState("");
  return (
    <div className="space-y-12">
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
      <StepTransformEmails
        brandLabel="Demo Brand"
        autoGenPasswordForLeads={autoGenPasswordForLeads}
        onAutoGenPasswordForLeadsChange={(v) => {
          setAutoGenPasswordForLeads(v);
          if (v) setAutoRejectNoInteractivity(true);
        }}
        autoRejectNoInteractivity={autoRejectNoInteractivity}
        onAutoRejectNoInteractivityChange={setAutoRejectNoInteractivity}
        blockedEmailProviders={blockedEmailProviders}
        onBlockedEmailProvidersChange={setBlockedEmailProviders}
        newEmailProvider={newEmailProvider}
        onNewEmailProviderChange={setNewEmailProvider}
      />
    </div>
  );
};
