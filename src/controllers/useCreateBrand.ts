import { useState, useEffect } from "react";
import { isValidISOCountryCode, isValidPhoneCountryCode, isValidPhoneCodeFormat } from "@/utils/countryCodes";
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
} from "@/types/brand-config";
import { TOTAL_BRAND_WIZARD_STEPS } from "@/models/brand-wizard-steps";

export interface BrandEntry {
  name: string;
  domain: string;
}

export interface CreateBrandState {
  step: number;
  brands: BrandEntry[];
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
  maxLeverage: string;
  timezone: string;
  language: string;
  currency: string;
}

const getInitialState = (): CreateBrandState => ({
  step: 1,
  brands: [{ name: "", domain: "" }],
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
  voipCoverageMap: { US: ["US", "CA", "MX", "GB", "FR", "DE"], GB: ["GB", "US", "FR", "DE", "ES", "IT"], FR: ["FR", "GB", "DE", "ES", "IT", "BE"] },
  voipOriginCountryInput: "",
  voipAddOutboundFrom: "",
  voipOutboundCountryInput: "",
  providersMapData: JSON.stringify({ US: ["US", "CA", "MX", "GB", "FR", "DE"], GB: ["GB", "US", "FR", "DE", "ES", "IT"], FR: ["FR", "GB", "DE", "ES", "IT", "BE"] }, null, 2),
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
  traderMarkets: { "CRYPTO - CFD'S": true, FOREX: true, COMMODITIES: true },
  openPositionFeeEnabled: false,
  openPositionFeeType: "fixed",
  openPositionFeeValue: "0",
  closePositionFeeEnabled: false,
  closePositionFeeType: "fixed",
  closePositionFeeValue: "0",
  allowMultiTas: true,
  maxPerClient: "3",
  maxLeverage: "100",
  timezone: "UTC",
  language: "English",
  currency: "USD",
});

export function useCreateBrand() {
  const [state, setState] = useState<CreateBrandState>(getInitialState);

  useEffect(() => {
    setState((prev) => {
      const validCountries = prev.blockedCountries.filter((c) => {
        const n = c.toUpperCase().trim();
        return n.length === 2 && isValidISOCountryCode(n);
      });
      const validPhoneCodes = prev.rejectedCodes.filter((c) => {
        const n = c.trim();
        return isValidPhoneCodeFormat(n) && isValidPhoneCountryCode(n);
      });
      const changed = validCountries.length !== prev.blockedCountries.length || validPhoneCodes.length !== prev.rejectedCodes.length;
      if (!changed) return prev;
      return { ...prev, blockedCountries: validCountries, rejectedCodes: validPhoneCodes };
    });
  }, []);

  const update = <K extends keyof CreateBrandState>(key: K, value: CreateBrandState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const addBrand = () => setState((s) => ({ ...s, brands: [...s.brands, { name: "", domain: "" }] }));
  const removeBrand = (i: number) => setState((s) => ({ ...s, brands: s.brands.filter((_, idx) => idx !== i) }));
  const updateBrand = (i: number, field: "name" | "domain", value: string) => {
    setState((s) => {
      const updated = [...s.brands];
      updated[i] = { ...updated[i], [field]: value };
      return { ...s, brands: updated };
    });
  };

  const next = () => setState((s) => ({ ...s, step: Math.min(s.step + 1, TOTAL_BRAND_WIZARD_STEPS) }));
  const prev = () => setState((s) => ({ ...s, step: Math.max(s.step - 1, 1) }));

  const brandLabel = state.brands[0]?.name || state.brands[0]?.domain || "Brand 1";

  return {
    state,
    update,
    addBrand,
    removeBrand,
    updateBrand,
    next,
    prev,
    brandLabel,
    totalSteps: TOTAL_BRAND_WIZARD_STEPS,
  };
}
