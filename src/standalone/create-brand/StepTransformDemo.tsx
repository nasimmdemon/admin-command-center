import { useState } from "react";
import { StepTransform } from "@/views/create-brand";

export const StepTransformDemo = () => {
  const [emailProvidersAllowed, setEmailProvidersAllowed] = useState({ maileroo: true, alexders: false });
  const [phoneExtensionsAllowed, setPhoneExtensionsAllowed] = useState(true);
  const [allowedExtensionPhones, setAllowedExtensionPhones] = useState<string[]>([]);
  const [newAllowedExtensionPhone, setNewAllowedExtensionPhone] = useState("");
  const [autoGenPasswordForLeads, setAutoGenPasswordForLeads] = useState(true);
  const [autoRejectNoInteractivity, setAutoRejectNoInteractivity] = useState(true);
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [newCountryCode, setNewCountryCode] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [rejectedCodes, setRejectedCodes] = useState(["+1", "+44"]);
  const [newPhoneCode, setNewPhoneCode] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [blockedEmailProviders, setBlockedEmailProviders] = useState(["tempmail.com", "guerrillamail.com"]);
  const [newEmailProvider, setNewEmailProvider] = useState("");
  return (
    <StepTransform
      brandLabel="Demo Brand"
      emailProvidersAllowed={emailProvidersAllowed}
      onEmailProvidersAllowedChange={setEmailProvidersAllowed}
      phoneExtensionsAllowed={phoneExtensionsAllowed}
      onPhoneExtensionsAllowedChange={setPhoneExtensionsAllowed}
      allowedExtensionPhones={allowedExtensionPhones}
      newAllowedExtensionPhone={newAllowedExtensionPhone}
      onAllowedExtensionPhonesChange={setAllowedExtensionPhones}
      onNewAllowedExtensionPhoneChange={setNewAllowedExtensionPhone}
      autoGenPasswordForLeads={autoGenPasswordForLeads}
      onAutoGenPasswordForLeadsChange={(v) => {
        setAutoGenPasswordForLeads(v);
        if (v) setAutoRejectNoInteractivity(true);
      }}
      autoRejectNoInteractivity={autoRejectNoInteractivity}
      onAutoRejectNoInteractivityChange={setAutoRejectNoInteractivity}
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
      blockedEmailProviders={blockedEmailProviders}
      onBlockedEmailProvidersChange={setBlockedEmailProviders}
      newEmailProvider={newEmailProvider}
      onNewEmailProviderChange={setNewEmailProvider}
    />
  );
};
