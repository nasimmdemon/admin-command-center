import { useState } from "react";
import { StepTransform } from "@/views/create-brand";

export const StepTransformDemo = () => {
  const [emailProvidersAllowed, setEmailProvidersAllowed] = useState({ maileroo: true, alexders: false });
  const [phoneExtensionsAllowed, setPhoneExtensionsAllowed] = useState(true);
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
  const [autoGenPassword, setAutoGenPassword] = useState(false);
  const [recoverLeads, setRecoverLeads] = useState(true);
  return (
    <StepTransform
      brandLabel="Demo Brand"
      emailProvidersAllowed={emailProvidersAllowed}
      onEmailProvidersAllowedChange={setEmailProvidersAllowed}
      phoneExtensionsAllowed={phoneExtensionsAllowed}
      onPhoneExtensionsAllowedChange={setPhoneExtensionsAllowed}
      autoGenPasswordForLeads={autoGenPasswordForLeads}
      onAutoGenPasswordForLeadsChange={setAutoGenPasswordForLeads}
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
      autoGenPassword={autoGenPassword}
      onAutoGenPasswordChange={setAutoGenPassword}
      recoverLeads={recoverLeads}
      onRecoverLeadsChange={setRecoverLeads}
    />
  );
};
