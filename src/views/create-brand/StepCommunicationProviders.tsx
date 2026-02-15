import { Label } from "@/components/ui/label";
import { EmailProviderSection } from "./communication/EmailProviderSection";
import { EmailTemplatesSection } from "./communication/EmailTemplatesSection";
import { VoipProviderSection } from "./communication/VoipProviderSection";

interface StepCommunicationProvidersProps {
  emailProvider: "maileroo" | "alexders" | "other";
  onEmailProviderChange: (v: "maileroo" | "alexders" | "other") => void;
  mailerooApiKey?: string;
  mailerooFromEmail?: string;
  onMailerooApiKeyChange?: (v: string) => void;
  onMailerooFromEmailChange?: (v: string) => void;
  alexdersApiKey?: string;
  alexdersFromEmail?: string;
  onAlexdersApiKeyChange?: (v: string) => void;
  onAlexdersFromEmailChange?: (v: string) => void;
  selectedEmailTemplates: Record<string, boolean>;
  onEmailTemplatesChange: (t: Record<string, boolean>) => void;
  voipProvider: "voicex" | "other" | null;
  onVoipProviderChange: (v: "voicex" | "other" | null) => void;
  voipPhoneNumbers: string;
  voipCountries: string;
  voipCoverageMap: Record<string, string[]>;
  voipOriginCountryInput: string;
  voipAddOutboundFrom: string;
  voipOutboundCountryInput: string;
  providersMapData: string;
  onVoipPhoneNumbersChange: (v: string) => void;
  onVoipCountriesChange: (v: string) => void;
  onVoipCoverageMapChange: (m: Record<string, string[]>) => void;
  onVoipOriginCountryInputChange: (v: string) => void;
  onVoipAddOutboundFromChange: (v: string) => void;
  onVoipOutboundCountryInputChange: (v: string) => void;
  onProvidersMapDataChange: (v: string) => void;
}

export const StepCommunicationProviders = (props: StepCommunicationProvidersProps) => (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-foreground">Communication Providers</h2>
    <EmailProviderSection
      value={props.emailProvider}
      onChange={props.onEmailProviderChange}
      mailerooApiKey={props.mailerooApiKey}
      mailerooFromEmail={props.mailerooFromEmail}
      onMailerooApiKeyChange={props.onMailerooApiKeyChange}
      onMailerooFromEmailChange={props.onMailerooFromEmailChange}
      alexdersApiKey={props.alexdersApiKey}
      alexdersFromEmail={props.alexdersFromEmail}
      onAlexdersApiKeyChange={props.onAlexdersApiKeyChange}
      onAlexdersFromEmailChange={props.onAlexdersFromEmailChange}
    />
    <EmailTemplatesSection selected={props.selectedEmailTemplates} onToggle={(key, val) => props.onEmailTemplatesChange({ ...props.selectedEmailTemplates, [key]: val })} />
    <VoipProviderSection
      provider={props.voipProvider}
      onProviderChange={props.onVoipProviderChange}
      phoneNumbers={props.voipPhoneNumbers}
      onPhoneNumbersChange={props.onVoipPhoneNumbersChange}
      countries={props.voipCountries}
      onCountriesChange={props.onVoipCountriesChange}
      coverageMap={props.voipCoverageMap}
      onCoverageMapChange={props.onVoipCoverageMapChange}
      originCountryInput={props.voipOriginCountryInput}
      onOriginCountryInputChange={props.onVoipOriginCountryInputChange}
      addOutboundFrom={props.voipAddOutboundFrom}
      onAddOutboundFromChange={props.onVoipAddOutboundFromChange}
      outboundCountryInput={props.voipOutboundCountryInput}
      onOutboundCountryInputChange={props.onVoipOutboundCountryInputChange}
      providersMapData={props.providersMapData}
      onProvidersMapDataChange={props.onProvidersMapDataChange}
    />
  </div>
);
