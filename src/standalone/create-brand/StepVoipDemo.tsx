import { useState } from "react";
import { StepVoipConfig } from "@/views/create-brand";

export const StepVoipDemo = () => {
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
    <StepVoipConfig
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
