import { useState } from "react";
import { StepCommunicationProviders } from "@/views/create-brand";

export const StepCommunicationDemo = () => {
  const [emailProvider, setEmailProvider] = useState<"maileroo" | "alexders" | "other">("maileroo");
  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState<Record<string, boolean>>({
    ClientAuth: false, LeadInitialDetails: false, ClientChangeCreds: false, UserChangeCreds: false,
  });
  const [emailTemplateContent, setEmailTemplateContent] = useState<Record<string, { subject: string; body: string }>>({
    ClientAuth: { subject: "", body: "" },
    LeadInitialDetails: { subject: "", body: "" },
    ClientChangeCreds: { subject: "", body: "" },
    UserChangeCreds: { subject: "", body: "" },
  });
  const [voipProvider, setVoipProvider] = useState<"voicex" | "other" | null>("voicex");
  const [voipPhoneNumbers, setVoipPhoneNumbers] = useState("50");
  const [voipCountries, setVoipCountries] = useState("25");
  const [voipCoverageMap, setVoipCoverageMap] = useState<Record<string, string[]>>({
    US: ["US", "CA", "MX", "GB"], GB: ["GB", "US", "FR", "DE"], FR: ["FR", "GB", "DE", "ES"],
  });
  const [providersMapData, setProvidersMapData] = useState(() =>
    JSON.stringify({ US: ["US", "CA", "MX"], GB: ["GB", "US", "FR"], FR: ["FR", "GB", "DE"] }, null, 2)
  );
  return (
    <StepCommunicationProviders
      emailProvider={emailProvider}
      onEmailProviderChange={setEmailProvider}
      selectedEmailTemplates={selectedEmailTemplates}
      onEmailTemplatesChange={setSelectedEmailTemplates}
      emailTemplateContent={emailTemplateContent}
      onEmailTemplateContentChange={(key, val) => setEmailTemplateContent((prev) => ({ ...prev, [key]: val }))}
      voipProvider={voipProvider}
      onVoipProviderChange={setVoipProvider}
      voipPhoneNumbers={voipPhoneNumbers}
      voipCountries={voipCountries}
      voipCoverageMap={voipCoverageMap}
      voipOriginCountryInput=""
      voipAddOutboundFrom=""
      voipOutboundCountryInput=""
      providersMapData={providersMapData}
      onVoipPhoneNumbersChange={setVoipPhoneNumbers}
      onVoipCountriesChange={setVoipCountries}
      onVoipCoverageMapChange={setVoipCoverageMap}
      onVoipOriginCountryInputChange={() => {}}
      onVoipAddOutboundFromChange={() => {}}
      onVoipOutboundCountryInputChange={() => {}}
      onProvidersMapDataChange={setProvidersMapData}
    />
  );
};
