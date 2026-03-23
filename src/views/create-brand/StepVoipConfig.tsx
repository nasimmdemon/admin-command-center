import { VoipProviderSection } from "./communication/VoipProviderSection";

interface StepVoipConfigProps {
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
  voipAllocationModes?: { byBrand: boolean; byDesk: boolean; byWorker: boolean };
  onVoipAllocationModesChange?: (v: { byBrand: boolean; byDesk: boolean; byWorker: boolean }) => void;
  voipDeskConfigs?: import("@/types/voip-desk").VoipDeskConfig[];
  onVoipDeskConfigsChange?: (v: import("@/types/voip-desk").VoipDeskConfig[]) => void;
  voipQaDefault?: boolean;
  onVoipQaDefaultChange?: (v: boolean) => void;
  voipWorkerConfigs?: import("@/types/worker-comms").VoipWorkerConfigEntry[];
  onVoipWorkerConfigsChange?: (v: import("@/types/worker-comms").VoipWorkerConfigEntry[]) => void;
  uploadedWorkers?: Array<{ email: string; full_name: string; valid: boolean; brandName?: string }>;
  currentBrandName?: string;
}

export const StepVoipConfig = (props: StepVoipConfigProps) => (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-foreground">VoIP</h2>
    <p className="text-sm text-muted-foreground">Configure your VoIP provider for phone communications.</p>
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
      voipAllocationModes={props.voipAllocationModes}
      onVoipAllocationModesChange={props.onVoipAllocationModesChange}
      voipDeskConfigs={props.voipDeskConfigs}
      onVoipDeskConfigsChange={props.onVoipDeskConfigsChange}
      voipQaDefault={props.voipQaDefault}
      onVoipQaDefaultChange={props.onVoipQaDefaultChange}
      voipWorkerConfigs={props.voipWorkerConfigs}
      onVoipWorkerConfigsChange={props.onVoipWorkerConfigsChange}
      uploadedWorkers={props.uploadedWorkers}
      currentBrandName={props.currentBrandName}
    />
  </div>
);
