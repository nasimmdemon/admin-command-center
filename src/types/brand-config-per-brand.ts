import {
  DepositMethod,
  WithdrawalMethod,
  BankDetails,
  WireTransferDetails,
  GlobalSettings,
  DEFAULT_DEPOSIT_METHODS,
  DEFAULT_WITHDRAWAL_METHODS,
  DEFAULT_BANK_DETAILS,
  DEFAULT_WIRE_DETAILS,
  DEFAULT_GLOBAL_SETTINGS,
} from "./brand-config";
import { buildDefaultTraderMarkets } from "@/lib/symbol-enums/market_symbols_map";
import type { VoipDeskConfig } from "./voip-desk";
import type { BrandDesk } from "./brand-desk";

/** Per-brand configuration - each brand has its own full config */
export interface BrandConfig {
  depositMethods: Record<string, DepositMethod>;
  bankDetails: BankDetails;
  wireDetails: WireTransferDetails;
  withdrawalMethods: Record<string, WithdrawalMethod>;
  globalSettings: GlobalSettings;
  withdrawalBankDetails: BankDetails;
  withdrawalWireDetails: WireTransferDetails;
  /** Brand has KYC at all? */
  brandHasKyc: boolean;
  /** If brand has KYC: must complete KYC to trade? */
  brandRequiresKycToTrade: boolean;
  /** @deprecated use brandHasKyc + brandRequiresKycToTrade */
  kycEnabled: boolean;
  /** Regardless: require selfie? */
  kycRequireSelfie: boolean;
  /** Regardless: which documents (allowed) */
  kycDocs: Record<string, boolean>;
  /** Specific document(s) client needs (e.g. "Passport + Proof of address") */
  kycSpecificDocumentClientNeeds: string;
  privacyPolicy: string;
  terms: string;
  emailProvider: "maileroo" | "alexders" | "other";
  mailerooApiKey: string;
  mailerooFromEmail: string;
  alexdersApiKey: string;
  alexdersFromEmail: string;
  voipProvider: "voicex" | "other" | null;
  voipPhoneNumbers: string;
  voipCountries: string;
  voipCoverageMap: Record<string, string[]>;
  /** Multi-toggle: brand, desk, worker can all be enabled at once. Each adds its destinations to the union. */
  voipAllocationModes: { byBrand: boolean; byDesk: boolean; byWorker: boolean };
  /** @deprecated use voipAllocationModes. Kept for migration. */
  voipMode?: "legacy" | "desk" | "worker";
  /** Per-desk VoIP: phone count + origin→destinations per desk. Desks can exist without VoIP (needsVoip=false). */
  voipDeskConfigs: VoipDeskConfig[];
  /** Brand-level desks (org structure). Separate from VoIP. Desk can be shared across depts; VoIP optional per desk. */
  brandDesks: BrandDesk[];
  /** QA default: 1 number, all origins → all destinations. When true, QA can call all desks regardless of desk config. */
  voipQaDefault: boolean;
  /** Per-worker VoIP (when voipMode=worker). Each worker has own origin→destinations. */
  voipWorkerConfigs: Array<{ workerEmail: string; coverageMap: Record<string, string[]> }>;
  voipOriginCountryInput: string;
  voipAddOutboundFrom: string;
  voipOutboundCountryInput: string;
  providersMapData: string;
  selectedEmailTemplates: Record<string, boolean>;
  /** Subject and body per template */
  emailTemplateContent: Record<string, { subject: string; body: string }>;
  /** Brand logo URL (base64 or uploaded URL) – used in emails */
  logoUrl: string;
  emailProvidersAllowed: Record<string, boolean>;
  phoneExtensionsAllowed: boolean;
  allowedExtensionPhones: string[];
  newAllowedExtensionPhone: string;
  autoGenPasswordForLeads: boolean;
  /** When true, welcome email includes link for client to change password */
  includePasswordChangeLinkInEmail: boolean;
  autoRejectNoInteractivity: boolean;
  /** Days of no interaction before auto-reject (when autoRejectNoInteractivity is on) */
  autoRejectDaysAfterWelcome: number;
  /** Require standard email format (user@domain.com) for client signup */
  emailFormatValidation: boolean;
  blockedCountries: string[];
  newCountryCode: string;
  countryCodeError: string;
  rejectedCodes: string[];
  newPhoneCode: string;
  phoneCodeError: string;
  blockedEmailProviders: string[];
  newEmailProvider: string;
  traderPlatform: string;
  traderMarkets: Record<string, boolean>;
  openPositionFeeEnabled: boolean;
  openPositionFeeType: "fixed" | "percentage";
  openPositionFeeValue: string;
  closePositionFeeEnabled: boolean;
  closePositionFeeType: "fixed" | "percentage";
  closePositionFeeValue: string;
  allowMultiTas: boolean;
  maxPerClient: string;
  allowClientSelectLeverage: boolean;
  maxLeverage: string;
  timezone: string;
  language: string;
  currency: string;
  /** Include WhatsApp Business for sending messages from admin account */
  includeWhatsApp: boolean;
  /** Default: by desk (RE US, CO US sit on same number). Additional cases: by brand, by worker */
  whatsappConnectionMode: "by_desk";
  /** Additional cases to include (coming soon) */
  whatsappAdditionalModes: { by_brand: boolean; by_worker: boolean };
  /** QR code data URL or pairing URL for WhatsApp Business connection (from backend) */
  whatsappQrCode: string;
}

const defaultVoipCoverage = { US: ["US", "CA", "MX", "GB", "FR", "DE"], GB: ["GB", "US", "FR", "DE", "ES", "IT"], FR: ["FR", "GB", "DE", "ES", "IT", "BE"] };

export const getDefaultBrandConfig = (): BrandConfig => ({
  depositMethods: { ...DEFAULT_DEPOSIT_METHODS },
  bankDetails: { ...DEFAULT_BANK_DETAILS },
  wireDetails: { ...DEFAULT_WIRE_DETAILS },
  withdrawalMethods: { ...DEFAULT_WITHDRAWAL_METHODS },
  globalSettings: { ...DEFAULT_GLOBAL_SETTINGS },
  withdrawalBankDetails: { ...DEFAULT_BANK_DETAILS },
  withdrawalWireDetails: { ...DEFAULT_WIRE_DETAILS },
  brandHasKyc: true,
  brandRequiresKycToTrade: true,
  kycEnabled: true,
  kycRequireSelfie: false,
  kycDocs: { Passport: false, "ID": false, "Utility Bill": false, "Driver Licence": false },
  kycSpecificDocumentClientNeeds: "",
  privacyPolicy: "",
  terms: "",
  emailProvider: "maileroo",
  mailerooApiKey: "",
  mailerooFromEmail: "",
  alexdersApiKey: "",
  alexdersFromEmail: "",
  voipProvider: "voicex",
  voipPhoneNumbers: "50",
  voipCountries: "25",
  voipCoverageMap: defaultVoipCoverage,
  voipAllocationModes: { byBrand: true, byDesk: false, byWorker: false },
  voipDeskConfigs: [],
  brandDesks: [],
  voipQaDefault: false,
  voipWorkerConfigs: [],
  voipOriginCountryInput: "",
  voipAddOutboundFrom: "",
  voipOutboundCountryInput: "",
  providersMapData: JSON.stringify(defaultVoipCoverage, null, 2),
  selectedEmailTemplates: { ClientCardEmailFromUser: false, ClientAuth: false, LeadInitialDetails: false, ClientChangeCreds: false, UserChangeCreds: false },
  emailTemplateContent: {
    ClientCardEmailFromUser: { subject: "", body: "" },
    ClientAuth: { subject: "", body: "" },
    LeadInitialDetails: { subject: "", body: "" },
    ClientChangeCreds: { subject: "", body: "" },
    UserChangeCreds: { subject: "", body: "" },
  },
  logoUrl: "",
  emailProvidersAllowed: { maileroo: true, alexders: false },
  phoneExtensionsAllowed: true,
  allowedExtensionPhones: [],
  newAllowedExtensionPhone: "",
  autoGenPasswordForLeads: true,
  includePasswordChangeLinkInEmail: true,
  autoRejectNoInteractivity: true,
  autoRejectDaysAfterWelcome: 7,
  emailFormatValidation: true,
  blockedCountries: [],
  newCountryCode: "",
  countryCodeError: "",
  rejectedCodes: ["+1", "+44"],
  newPhoneCode: "",
  phoneCodeError: "",
  blockedEmailProviders: ["tempmail.com", "guerrillamail.com", "mailinator.com"],
  newEmailProvider: "",
  traderPlatform: "DEALING_MENU_WEBTRADER",
  traderMarkets: buildDefaultTraderMarkets(["CRYPTO - CFD'S", "FOREX", "COMMODITIES"]),
  openPositionFeeEnabled: false,
  openPositionFeeType: "fixed",
  openPositionFeeValue: "0",
  closePositionFeeEnabled: false,
  closePositionFeeType: "fixed",
  closePositionFeeValue: "0",
  allowMultiTas: true,
  maxPerClient: "3",
  allowClientSelectLeverage: true,
  maxLeverage: "100",
  timezone: "UTC",
  language: "English",
  currency: "USD",
  includeWhatsApp: false,
  whatsappConnectionMode: "by_desk",
  whatsappAdditionalModes: { by_brand: false, by_worker: false },
  whatsappQrCode: "",
});

/** Merge config with defaults to ensure all fields are present in export (handles newly added fields). Skips undefined to avoid overwriting with empty. */
export function buildExportConfig(config: Partial<BrandConfig> | undefined): BrandConfig {
  const defaults = getDefaultBrandConfig();
  if (!config) return defaults;
  const defined = Object.fromEntries(
    Object.entries(config).filter(([, v]) => v !== undefined)
  ) as Partial<BrandConfig>;
  return { ...defaults, ...defined } as BrandConfig;
}

/** Fields that are UI-only transient state, excluded from export */
const TRANSIENT_UI_FIELDS: (keyof BrandConfig)[] = [
  "voipOriginCountryInput",
  "voipAddOutboundFrom",
  "voipOutboundCountryInput",
  "newCountryCode",
  "countryCodeError",
  "newPhoneCode",
  "phoneCodeError",
  "newAllowedExtensionPhone",
  "newEmailProvider",
];

/** Build clean config for export (all required fields, no transient UI state) */
export function buildCleanExportConfig(config: Partial<BrandConfig> | undefined): Omit<BrandConfig, (typeof TRANSIENT_UI_FIELDS)[number]> {
  const full = buildExportConfig(config);
  const clean = { ...full };
  for (const key of TRANSIENT_UI_FIELDS) {
    delete (clean as Record<string, unknown>)[key];
  }
  return clean as Omit<BrandConfig, (typeof TRANSIENT_UI_FIELDS)[number]>;
}
