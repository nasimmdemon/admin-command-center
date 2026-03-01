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

/** Per-brand configuration - each brand has its own full config */
export interface BrandConfig {
  depositMethods: Record<string, DepositMethod>;
  bankDetails: BankDetails;
  wireDetails: WireTransferDetails;
  withdrawalMethods: Record<string, WithdrawalMethod>;
  globalSettings: GlobalSettings;
  withdrawalBankDetails: BankDetails;
  withdrawalWireDetails: WireTransferDetails;
  kycEnabled: boolean;
  kycRequireSelfie: boolean;
  kycDocs: Record<string, boolean>;
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
  /** "legacy" = brand-level phones; "desk" = per-desk allocation (Brand→Dept→Desk) */
  voipMode: "legacy" | "desk";
  /** Per-desk VoIP: phone count + origin→destinations per desk */
  voipDeskConfigs: VoipDeskConfig[];
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
  kycEnabled: true,
  kycRequireSelfie: false,
  kycDocs: { Passport: false, "ID": false, "Utility Bill": false, "Driver Licence": false },
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
  voipMode: "legacy",
  voipDeskConfigs: [],
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
  traderPlatform: "MT5",
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
  whatsappQrCode: "",
});
