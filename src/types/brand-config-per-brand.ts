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
  voipOriginCountryInput: string;
  voipAddOutboundFrom: string;
  voipOutboundCountryInput: string;
  providersMapData: string;
  selectedEmailTemplates: Record<string, boolean>;
  emailProvidersAllowed: Record<string, boolean>;
  phoneExtensionsAllowed: boolean;
  allowedExtensionPhones: string[];
  newAllowedExtensionPhone: string;
  autoGenPasswordForLeads: boolean;
  autoRejectNoInteractivity: boolean;
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
  kycDocs: { Passport: false, "ID": false, "Utility Bill": false, "Require Selfie": false },
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
  voipOriginCountryInput: "",
  voipAddOutboundFrom: "",
  voipOutboundCountryInput: "",
  providersMapData: JSON.stringify(defaultVoipCoverage, null, 2),
  selectedEmailTemplates: { ClientAuth: true, LeadInitialDetails: true, ClientChangeCreds: true, UserChangeCreds: true },
  emailProvidersAllowed: { maileroo: true, alexders: false },
  phoneExtensionsAllowed: true,
  allowedExtensionPhones: [],
  newAllowedExtensionPhone: "",
  autoGenPasswordForLeads: true,
  autoRejectNoInteractivity: true,
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
});
