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
  emailTemplateContent: Record<string, { subject: string; body: string }>;
  onEmailTemplateContentChange: (key: string, value: { subject: string; body: string }) => void;
  logoUrl?: string;
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
  <div className="space-y-8">
    <h2 className="text-lg font-semibold text-foreground">Communication Providers</h2>

    {/* Email section */}
    <div className="rounded-2xl border border-border/50 p-6 bg-card shadow-widget space-y-6">
      <h3 className="text-base font-semibold text-foreground">Email</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <EmailTemplatesSection
          selected={props.selectedEmailTemplates}
          onToggle={(key, val) => props.onEmailTemplatesChange({ ...props.selectedEmailTemplates, [key]: val })}
          content={props.emailTemplateContent}
          onContentChange={(key, val) => props.onEmailTemplateContentChange(key, val)}
          logoUrl={props.logoUrl}
        />
      </div>
    </div>

    {/* VoIP section */}
    <div className="rounded-2xl border border-border/50 p-6 bg-card shadow-widget">
      <h3 className="text-base font-semibold text-foreground mb-4">VoIP</h3>
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
  </div>
);
