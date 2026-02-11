import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { ArrowLeft, ArrowRight, Plus, Trash2, Upload, Globe, Info, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DepositConfigStep from "@/components/brand-wizard/DepositConfigStep";
import WithdrawalConfigStep from "@/components/brand-wizard/WithdrawalConfigStep";
import InteractiveWorldMap from "@/components/brand-wizard/InteractiveWorldMap";
import { isValidISOCountryCode, isValidPhoneCountryCode, isValidPhoneCodeFormat } from "@/utils/countryCodes";
import {
  DepositMethod, WithdrawalMethod, BankDetails, WireTransferDetails, GlobalSettings,
  DEFAULT_DEPOSIT_METHODS, DEFAULT_WITHDRAWAL_METHODS, DEFAULT_BANK_DETAILS, DEFAULT_WIRE_DETAILS, DEFAULT_GLOBAL_SETTINGS,
} from "@/types/brand-config";

const TOTAL_STEPS = 14;

// Reusable checkbox card
const CheckCard = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.3 }}
    onClick={() => onChange(!checked)}
    className={`rounded-lg border p-3 text-sm font-medium text-left transition-colors duration-300 ${
      checked ? "bg-primary/10 border-primary text-foreground" : "bg-card text-muted-foreground hover:border-muted-foreground/50"
    }`}
  >
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
        checked ? "bg-primary border-primary" : "border-muted-foreground/30"
      }`}>
        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <span className="truncate">{label}</span>
    </div>
  </motion.button>
);

const CreateBrand = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState([{ name: "", domain: "" }]);

  // Step 2 state - Deposit config
  const [depositMethods, setDepositMethods] = useState<Record<string, DepositMethod>>({ ...DEFAULT_DEPOSIT_METHODS });
  const [bankDetails, setBankDetails] = useState<BankDetails>({ ...DEFAULT_BANK_DETAILS });
  const [wireDetails, setWireDetails] = useState<WireTransferDetails>({ ...DEFAULT_WIRE_DETAILS });

  // Step 3 - Withdrawal config
  const [withdrawalMethods, setWithdrawalMethods] = useState<Record<string, WithdrawalMethod>>({ ...DEFAULT_WITHDRAWAL_METHODS });
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ ...DEFAULT_GLOBAL_SETTINGS });
  const [withdrawalBankDetails, setWithdrawalBankDetails] = useState<BankDetails>({ ...DEFAULT_BANK_DETAILS });
  const [withdrawalWireDetails, setWithdrawalWireDetails] = useState<WireTransferDetails>({ ...DEFAULT_WIRE_DETAILS });

  // Step 4 - KYC: require to trade (yes/no), manual approval default when yes, documents optional per owner
  const [kycEnabled, setKycEnabled] = useState(true);
  const [kycDocs, setKycDocs] = useState<Record<string, boolean>>({
    "Passport": false, "ID": false, "Utility Bill": false, "Require Selfie": false,
  });

  // Step 5
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");

  // Step 6 - Communication Providers
  const [emailProvider, setEmailProvider] = useState<"maileroo" | "alexders" | "other">("maileroo");
  const [voipProvider, setVoipProvider] = useState<"voicex" | "other" | null>("voicex");
  const [voipPhoneNumbers, setVoipPhoneNumbers] = useState("50");
  const [voipCountries, setVoipCountries] = useState("25");
  const [voipCoverageMap, setVoipCoverageMap] = useState<Record<string, string[]>>({
    "US": ["US", "CA", "MX", "GB", "FR", "DE"],
    "GB": ["GB", "US", "FR", "DE", "ES", "IT"],
    "FR": ["FR", "GB", "DE", "ES", "IT", "BE"],
  }); // Format: { "from_country": ["to_country1", "to_country2", ...] } - includes same country for quick calls
  const [voipOriginCountryInput, setVoipOriginCountryInput] = useState("");
  const [voipAddOutboundFrom, setVoipAddOutboundFrom] = useState("");
  const [voipOutboundCountryInput, setVoipOutboundCountryInput] = useState("");
  const [providersMapData, setProvidersMapData] = useState(() => {
    return JSON.stringify({
      "US": ["US", "CA", "MX", "GB", "FR", "DE"],
      "GB": ["GB", "US", "FR", "DE", "ES", "IT"],
      "FR": ["FR", "GB", "DE", "ES", "IT", "BE"],
    }, null, 2);
  });
  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState<Record<string, boolean>>({
    "ClientAuth": true, // Client signup from auth gate (Classic)
    "LeadInitialDetails": true, // Lead -> Client (auto gen password and lead info used for sending initial password)
    "ClientChangeCreds": true, // Change client credentials
    "UserChangeCreds": true, // Change user credentials
  });

  // Step 9 - TRANSFORM (actual config + Auto Rejection)
  const [emailProvidersAllowed, setEmailProvidersAllowed] = useState<Record<string, boolean>>({
    maileroo: true, alexders: false,
  });
  const [phoneExtensionsAllowed, setPhoneExtensionsAllowed] = useState(true);
  const [autoGenPasswordForLeads, setAutoGenPasswordForLeads] = useState(true);
  const [autoRejectNoInteractivity, setAutoRejectNoInteractivity] = useState(true);
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]); // Array of country codes like ["US", "CA"]
  const [newCountryCode, setNewCountryCode] = useState(""); // Input for adding country codes
  const [countryCodeError, setCountryCodeError] = useState(""); // Error message for invalid country code

  // Clean up any invalid country codes - filter out invalid codes (only run once on mount)
  useEffect(() => {
    const validCountries = blockedCountries.filter(code => {
      const normalized = code.toUpperCase().trim();
      return normalized.length === 2 && isValidISOCountryCode(normalized);
    });
    if (validCountries.length !== blockedCountries.length) {
      setBlockedCountries(validCountries);
    }
    
    // Also clean up invalid phone codes
    const validPhoneCodes = rejectedCodes.filter(code => {
      const normalized = code.trim();
      return isValidPhoneCodeFormat(normalized) && isValidPhoneCountryCode(normalized);
    });
    if (validPhoneCodes.length !== rejectedCodes.length) {
      setRejectedCodes(validPhoneCodes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to clean up any pre-existing invalid codes
  const [rejectedCodes, setRejectedCodes] = useState(["+1", "+44"]); // Phone country codes to reject
  const [newPhoneCode, setNewPhoneCode] = useState(""); // Input for adding phone country codes
  const [phoneCodeError, setPhoneCodeError] = useState(""); // Error message for invalid phone code
  const [blockedEmailProviders, setBlockedEmailProviders] = useState<string[]>([
    "tempmail.com", "guerrillamail.com", "mailinator.com"
  ]); // Array of email provider domains
  const [newEmailProvider, setNewEmailProvider] = useState("");
  const [autoGenPassword, setAutoGenPassword] = useState(false);
  const [recoverLeads, setRecoverLeads] = useState(true);

  // Step 10
  const [traderPlatform, setTraderPlatform] = useState("MT5");

  // Step 11
  const [traderMarkets, setTraderMarkets] = useState<Record<string, boolean>>({
    "CRYPTO - CFD'S": true, "FOREX": true, "COMMODITIES": true,
  });

  // Step 12 - Trading Fees
  const [openPositionFeeEnabled, setOpenPositionFeeEnabled] = useState(false);
  const [openPositionFeeType, setOpenPositionFeeType] = useState<"fixed" | "percentage">("fixed");
  const [openPositionFeeValue, setOpenPositionFeeValue] = useState("0");
  const [closePositionFeeEnabled, setClosePositionFeeEnabled] = useState(false);
  const [closePositionFeeType, setClosePositionFeeType] = useState<"fixed" | "percentage">("fixed");
  const [closePositionFeeValue, setClosePositionFeeValue] = useState("0");

  // Step 13
  const [allowMultiTas, setAllowMultiTas] = useState(true);
  const [maxPerClient, setMaxPerClient] = useState("3");
  const [maxLeverage, setMaxLeverage] = useState("100");

  // Step 14
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");

  const addBrand = () => setBrands([...brands, { name: "", domain: "" }]);
  const removeBrand = (i: number) => setBrands(brands.filter((_, idx) => idx !== i));
  const updateBrand = (i: number, field: "name" | "domain", value: string) => {
    const updated = [...brands];
    updated[i][field] = value;
    setBrands(updated);
  };

  const brandLabel = brands[0]?.name || brands[0]?.domain || "Brand 1";

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Which Brands</h2>
            {brands.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex gap-3 items-end"
              >
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Brand {i + 1} Name</Label>
                  <Input placeholder="Brand name" value={b.name} onChange={(e) => updateBrand(i, "name", e.target.value)} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Domain</Label>
                  <Input placeholder="domain.com" value={b.domain} onChange={(e) => updateBrand(i, "domain", e.target.value)} />
                </div>
                {brands.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeBrand(i)} className="text-destructive flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
            <Button variant="outline" size="sm" onClick={addBrand} className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Add Brand
            </Button>
          </div>
        );

      case 2:
        return (
          <DepositConfigStep
            brandLabel={brandLabel}
            brandDomain={brands[0]?.domain || "domain.com"}
            methods={depositMethods}
            onMethodsChange={setDepositMethods}
            bankDetails={bankDetails}
            onBankDetailsChange={setBankDetails}
            wireDetails={wireDetails}
            onWireDetailsChange={setWireDetails}
          />
        );

      case 3:
        return (
          <WithdrawalConfigStep
            brandLabel={brandLabel}
            brandDomain={brands[0]?.domain || "domain.com"}
            methods={withdrawalMethods}
            onMethodsChange={setWithdrawalMethods}
            globalSettings={globalSettings}
            onGlobalSettingsChange={setGlobalSettings}
            withdrawalBankDetails={withdrawalBankDetails}
            onWithdrawalBankDetailsChange={setWithdrawalBankDetails}
            withdrawalWireDetails={withdrawalWireDetails}
            onWithdrawalWireDetailsChange={setWithdrawalWireDetails}
          />
        );

      case 4:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">KYC Settings</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}: {brands[0]?.domain || "domain.com"}</p>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Require KYC to trade?</Label>
                <p className="text-xs text-muted-foreground mt-1">Manual approval is default when enabled</p>
              </div>
              <Switch checked={kycEnabled} onCheckedChange={setKycEnabled} />
            </div>
            {kycEnabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-4">
                <div className="rounded-lg border p-4">
                  <Label className="text-sm font-medium">Documents (optional – select which the owner requires)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {Object.entries(kycDocs).map(([key, val]) => (
                      <CheckCard key={key} label={key} checked={val} onChange={(v) => setKycDocs({ ...kycDocs, [key]: v })} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {!kycEnabled && (
              <div className="rounded-lg border p-4 bg-secondary/50">
                <p className="text-sm text-muted-foreground">{brandLabel} – KYC: No</p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Auth Gate Terms & Conditions</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}: {brands[0]?.domain || "domain.com"}</p>
            <div className="space-y-2">
              <Label>Privacy Policy</Label>
              <Textarea placeholder="Enter your privacy policy text..." rows={5} value={privacyPolicy} onChange={(e) => setPrivacyPolicy(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Terms Of Service Agreed By Client</Label>
              <Textarea placeholder="Enter your terms of service text..." rows={5} value={terms} onChange={(e) => setTerms(e.target.value)} />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Communication Providers</h2>
            
            {/* Email Provider Selection */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Provider</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setEmailProvider("maileroo")}
                  className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                    emailProvider === "maileroo"
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      emailProvider === "maileroo" ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {emailProvider === "maileroo" && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Maileroo</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Lower cost</p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setEmailProvider("alexders")}
                  className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                    emailProvider === "alexders"
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      emailProvider === "alexders" ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {emailProvider === "alexders" && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Alexders Moldova Solution</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Higher cost per month</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setEmailProvider("other")}
                  className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                    emailProvider === "other"
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      emailProvider === "other" ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {emailProvider === "other" && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Other (external)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Connect your own provider</p>
                    </div>
                  </div>
                </motion.button>
              </div>
              {emailProvider === "other" && (
                <div className="rounded-lg border border-dashed p-4 bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-2">Email provider is not ours — use our docs to connect external provider.</p>
                  <Link to="/providers?tab=email" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                    <ExternalLink className="w-4 h-4" />
                    View provider docs (Email)
                  </Link>
                </div>
              )}
              {(emailProvider === "maileroo" || emailProvider === "alexders") && (
              <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">With Alexders: higher cost per month, no spam risk. Lower-cost option may land in spam.</p>
              </div>
              )}
            </div>

            {/* Email Templates Section */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Templates</Label>
              <p className="text-sm text-muted-foreground">Select which email templates to enable for this brand</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries({
                  "ClientAuth": {
                    label: "Client Authentication",
                    description: "Client signup from auth gate (Classic)",
                    path: "BLAPI\\EmailsUsecases\\ClientAuth"
                  },
                  "LeadInitialDetails": {
                    label: "Lead Initial Details",
                    description: "Lead → Client (auto gen password and lead info used for sending initial password)",
                    path: "BLAPI\\EmailsUsecases\\LeadInitialDeatils"
                  },
                  "ClientChangeCreds": {
                    label: "Client Change Credentials",
                    description: "Change client credentials",
                    path: "BLAPI\\EmailsUsecases\\ClientChangeCreds"
                  },
                  "UserChangeCreds": {
                    label: "User Change Credentials",
                    description: "Change user credentials",
                    path: "BLAPI\\EmailsUsecases\\UserChangeCreds"
                  },
                }).map(([key, template]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-lg border p-4 bg-card transition-all ${
                      selectedEmailTemplates[key] 
                        ? "border-primary/50 bg-primary/5" 
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          selectedEmailTemplates[key] 
                            ? "bg-primary border-primary" 
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {selectedEmailTemplates[key] && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setSelectedEmailTemplates({ 
                            ...selectedEmailTemplates, 
                            [key]: !selectedEmailTemplates[key] 
                          })}
                          className="text-left w-full"
                        >
                          <p className="font-medium text-foreground">{template.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1 font-mono break-all">{template.path}</p>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* VoIP Provider Selection */}
            <div className="space-y-4">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">VoIP Provider</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setVoipProvider(voipProvider === "voicex" ? null : "voicex")}
                  className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                    voipProvider === "voicex"
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      voipProvider === "voicex" ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {voipProvider === "voicex" && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">VoiceX</p>
                    <p className="text-xs text-muted-foreground mt-0.5">VoIP communication service</p>
                  </div>
                </div>
              </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setVoipProvider(voipProvider === "other" ? null : "other")}
                  className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                    voipProvider === "other"
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      voipProvider === "other" ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {voipProvider === "other" && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Other (external)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Connect your own provider</p>
                  </div>
                </div>
              </motion.button>
              </div>
              {voipProvider === "other" && (
                <div className="rounded-lg border border-dashed p-4 bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-2">VoIP provider is not ours — use our docs to connect external provider.</p>
                  <Link to="/providers?tab=voip" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                    <ExternalLink className="w-4 h-4" />
                    View provider docs (VoIP)
                  </Link>
                </div>
              )}
              {voipProvider === "voicex" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* VoIP Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3 bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Phone Numbers</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={voipPhoneNumbers}
                          onChange={(e) => setVoipPhoneNumbers(e.target.value)}
                          className="h-8 text-lg font-semibold"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="rounded-lg border p-3 bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Countries</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={voipCountries}
                          onChange={(e) => setVoipCountries(e.target.value)}
                          className="h-8 text-lg font-semibold"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VoIP Coverage Map - Click countries to select origin countries */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">VoIP Coverage (select origin countries)</Label>
                    <p className="text-xs text-muted-foreground">
                      Click countries on the map to toggle. Selected countries are highlighted. Use manual input below to add outbound routes.
                    </p>
                    <div className="rounded-lg border p-4 bg-secondary/30 min-h-[280px] max-h-[400px] overflow-auto">
                      <InteractiveWorldMap
                        variant="select"
                        selectedCountries={Object.keys(voipCoverageMap).filter(c => isValidISOCountryCode(c))}
                        onCountryToggle={(countryCode) => {
                          const code = countryCode.toUpperCase().trim();
                          if (!isValidISOCountryCode(code)) return;
                          const next = { ...voipCoverageMap };
                          if (next[code]) {
                            delete next[code];
                          } else {
                            next[code] = [code];
                          }
                          setVoipCoverageMap(next);
                          setProvidersMapData(JSON.stringify(next, null, 2));
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Origin & Outbound Countries - From country → To same country (quick call) */}
                  <div className="space-y-4 rounded-lg border p-4 bg-card/50">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Origin Countries (where calls can originate)</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        From country → to same country: Select USA as outbound = you can quick call from USA to USA
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.keys(voipCoverageMap).map((country) => (
                        <motion.span
                          key={country}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                        >
                          {country}
                          <button
                            onClick={() => {
                              const next = { ...voipCoverageMap };
                              delete next[country];
                              setVoipCoverageMap(next);
                              setProvidersMapData(JSON.stringify(next, null, 2));
                            }}
                            className="hover:text-primary/70 ml-1"
                          >
                            ×
                          </button>
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Origin country (e.g., US, GB)"
                        value={voipOriginCountryInput}
                        onChange={(e) => setVoipOriginCountryInput(e.target.value.toUpperCase().trim().slice(0, 2))}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && voipOriginCountryInput && isValidISOCountryCode(voipOriginCountryInput)) {
                            const code = voipOriginCountryInput.toUpperCase();
                            if (!voipCoverageMap[code]) {
                              const next = { ...voipCoverageMap, [code]: [code] };
                              setVoipCoverageMap(next);
                              setProvidersMapData(JSON.stringify(next, null, 2));
                              setVoipOriginCountryInput("");
                            }
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (voipOriginCountryInput && isValidISOCountryCode(voipOriginCountryInput)) {
                            const code = voipOriginCountryInput.toUpperCase();
                            if (!voipCoverageMap[code]) {
                              const next = { ...voipCoverageMap, [code]: [code] };
                              setVoipCoverageMap(next);
                              setProvidersMapData(JSON.stringify(next, null, 2));
                              setVoipOriginCountryInput("");
                            }
                          }
                        }}
                      >
                        Add Origin
                      </Button>
                    </div>

                    {/* Add outbound country to origin */}
                    {Object.keys(voipCoverageMap).length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        <Label className="text-xs text-muted-foreground">Add outbound country to origin</Label>
                        <div className="flex flex-wrap gap-2">
                          <Select value={voipAddOutboundFrom} onValueChange={setVoipAddOutboundFrom}>
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="From" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(voipCoverageMap).map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="To country"
                            value={voipOutboundCountryInput}
                            onChange={(e) => setVoipOutboundCountryInput(e.target.value.toUpperCase().trim().slice(0, 2))}
                            className="w-24"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const from = voipAddOutboundFrom || Object.keys(voipCoverageMap)[0];
                              if (from && voipOutboundCountryInput && isValidISOCountryCode(voipOutboundCountryInput)) {
                                const toCode = voipOutboundCountryInput.toUpperCase();
                                const current = voipCoverageMap[from] || [from];
                                if (!current.includes(toCode)) {
                                  const next = { ...voipCoverageMap, [from]: [...current, toCode] };
                                  setVoipCoverageMap(next);
                                  setProvidersMapData(JSON.stringify(next, null, 2));
                                  setVoipOutboundCountryInput("");
                                }
                              }
                            }}
                          >
                            Add Outbound
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coverage Map Visualization */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Calling Coverage Map</Label>
                        <p className="text-xs text-muted-foreground">From Country → To Countries (includes same country for quick calls)</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(voipCoverageMap).length} origin countries
                      </span>
                    </div>
                    <div className="rounded-lg border p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 min-h-[280px]">
                      {/* World Map Background */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <Globe className="w-40 h-40 text-foreground" />
                      </div>
                      
                      {/* Coverage Grid */}
                      <div className="relative z-10 space-y-3">
                        {Object.entries(voipCoverageMap).length > 0 ? (
                          Object.entries(voipCoverageMap).map(([fromCountry, toCountries], idx) => (
                            <motion.div
                              key={fromCountry}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              className="rounded-lg border bg-card/80 backdrop-blur-sm p-3 hover:shadow-sm transition-shadow duration-300"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                  <span className="text-sm font-bold text-primary">{fromCountry}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground mb-1.5">
                                    Can call to {toCountries.length} {toCountries.length === 1 ? "country" : "countries"}:
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {toCountries.map((country) => (
                                      <span
                                        key={country}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success border border-success/20"
                                      >
                                        {country}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No coverage data yet</p>
                            <p className="text-xs mt-1">Add coverage in Providers Map below</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Providers Map Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Providers Map</Label>
                        <p className="text-xs text-muted-foreground">
                          Input coverage data in JSON format: {"{"}"FROM_COUNTRY_CODE": ["TO_COUNTRY_CODE1", "TO_COUNTRY_CODE2"]{"}"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProvidersMapData(JSON.stringify(voipCoverageMap, null, 2));
                        }}
                        className="text-xs"
                      >
                        Load Current
                      </Button>
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder={`{\n  "US": ["US", "CA", "MX", "GB"],\n  "GB": ["GB", "US", "FR", "DE"],\n  "CA": ["CA", "US", "MX"]\n}`}
                        value={providersMapData || JSON.stringify(voipCoverageMap, null, 2)}
                        onChange={(e) => {
                          setProvidersMapData(e.target.value);
                        }}
                        rows={10}
                        className="font-mono text-xs"
                      />
                      {providersMapData && (() => {
                        try {
                          JSON.parse(providersMapData);
                          return null;
                        } catch {
                          return (
                            <div className="absolute top-2 right-2 bg-destructive/10 border border-destructive/20 rounded px-2 py-1">
                              <p className="text-xs text-destructive">Invalid JSON</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          try {
                            const parsed = JSON.parse(providersMapData || "{}");
                            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                              // Validate structure: all values should be arrays
                              const isValid = Object.values(parsed).every(
                                (val) => Array.isArray(val) && val.every((item) => typeof item === "string")
                              );
                              
                              if (isValid) {
                                // Enforce: from country -> to same country (each origin includes itself for quick calls)
                                const normalized: Record<string, string[]> = {};
                                for (const [from, toList] of Object.entries(parsed)) {
                                  const arr = toList as string[];
                                  const fromUpper = from.toUpperCase();
                                  const unique = [...new Set([fromUpper, ...arr.map((c) => c.toUpperCase())])];
                                  normalized[fromUpper] = unique;
                                }
                                setVoipCoverageMap(normalized);
                                setProvidersMapData(JSON.stringify(normalized, null, 2));
                                const uniqueCountries = new Set([
                                  ...Object.keys(normalized),
                                  ...Object.values(normalized).flat()
                                ]);
                                setVoipCountries(uniqueCountries.size.toString());
                                const estimatedPhones = Math.max(uniqueCountries.size * 2, 10);
                                setVoipPhoneNumbers(estimatedPhones.toString());
                              } else {
                                alert("Invalid format: All values must be arrays of country codes (strings)");
                              }
                            } else {
                              alert("Invalid format: Expected an object with country codes as keys");
                            }
                          } catch (e) {
                            alert(`Invalid JSON format: ${e instanceof Error ? e.message : "Please check your input"}`);
                          }
                        }}
                        className="flex-1"
                      >
                        Apply & Update Coverage
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setVoipCoverageMap({});
                          setProvidersMapData("");
                          setVoipCountries("0");
                          setVoipPhoneNumbers("0");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="rounded-lg border p-2 bg-primary/5">
                      <p className="text-xs text-muted-foreground">
                        <strong>Format:</strong> Country codes (ISO 2-letter) as keys, arrays of destination country codes as values.
                        <strong> From country → to same country:</strong> Each origin automatically includes itself (e.g. US→US for quick calls).
                        Example: {"{"}"US": ["US", "CA", "MX"]{"}"} = calls from US to US, Canada, Mexico.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  From country → to same country: when you select USA as outbound, you can quick call from USA to USA. Add origin countries above or edit the Providers Map JSON.
                </p>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Upload Workers</h2>
            {brands.slice(0, 2).map((b, i) => (
              <div key={i} className="space-y-2">
                <Label>Your Workers On {b.name || `Brand ${i + 1}`} Accounts</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-3">Upload Users</Button>
                </div>
              </div>
            ))}
          </div>
        );

      case 8:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Upload Logo</h2>
            {brands.slice(0, 2).map((b, i) => (
              <div key={i} className="space-y-2">
                <Label>Your Logo On {b.name || `Brand ${i + 1}`}</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <Button variant="outline" size="sm" className="mt-3">Upload Logo</Button>
                  <p className="text-xs text-muted-foreground mt-2">PNG, SVG, JPG (max 2MB)</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 9:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">TRANSFORM</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}</p>

            {/* Transform actual config */}
            <div className="space-y-4 rounded-lg border p-4 bg-card">
              <Label className="text-sm font-medium">Email providers allowed</Label>
              <div className="flex flex-wrap gap-3">
                {["maileroo", "alexders"].map((provider) => (
                  <label key={provider} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailProvidersAllowed[provider] ?? false}
                      onChange={(e) => setEmailProvidersAllowed({ ...emailProvidersAllowed, [provider]: e.target.checked })}
                      className="rounded border-primary"
                    />
                    <span className="text-sm capitalize">{provider}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>Phone extensions allowed</Label>
                <Switch checked={phoneExtensionsAllowed} onCheckedChange={setPhoneExtensionsAllowed} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Auto gen password for leads with welcome email</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Generate password automatically when converting lead to client</p>
                </div>
                <Switch checked={autoGenPasswordForLeads} onCheckedChange={setAutoGenPasswordForLeads} />
              </div>

              {autoGenPasswordForLeads && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center justify-between rounded-lg border p-3 bg-muted/30"
                >
                  <div>
                    <Label>Auto reject for no interactivity</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Reject clients who don&apos;t interact after receiving welcome email</p>
                  </div>
                  <Switch checked={autoRejectNoInteractivity} onCheckedChange={setAutoRejectNoInteractivity} />
                </motion.div>
              )}
            </div>

            {/* Reject clients from those countries (manual input only – map is in VoIP) */}
            <div className="space-y-2">
              <Label>Reject clients from those countries:</Label>
              {blockedCountries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex flex-wrap gap-2 p-2 bg-secondary/50 rounded-lg"
                >
                  {blockedCountries
                    .filter(code => isValidISOCountryCode(code.toUpperCase().trim())) // Only show valid codes
                    .map((country) => {
                      const normalized = country.toUpperCase().trim();
                      return (
                        <motion.span
                          key={normalized}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
                        >
                          {normalized}
                          <button
                            onClick={() => setBlockedCountries(blockedCountries.filter((c) => c.toUpperCase().trim() !== normalized))}
                            className="hover:text-destructive/70 ml-1"
                          >
                            ×
                          </button>
                        </motion.span>
                      );
                    })}
                </motion.div>
              )}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Country code (e.g., US, CA, GB, BD)"
                    value={newCountryCode}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().trim().slice(0, 2); // Limit to 2 characters
                      setNewCountryCode(value);
                      if (value.length === 2) {
                        if (isValidISOCountryCode(value)) {
                          setCountryCodeError("");
                        } else {
                          setCountryCodeError("Invalid country code. Please use a valid ISO 3166-1 alpha-2 code (e.g., US, BD, GB)");
                        }
                      } else {
                        setCountryCodeError("");
                      }
                    }}
                    className={`flex-1 ${countryCodeError ? "border-destructive" : ""}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newCountryCode && !countryCodeError) {
                        if (isValidISOCountryCode(newCountryCode) && !blockedCountries.includes(newCountryCode)) {
                          setBlockedCountries([...blockedCountries, newCountryCode]);
                          setNewCountryCode("");
                          setCountryCodeError("");
                        }
                      }
                    }}
                  />
                  {countryCodeError && (
                    <p className="text-xs text-destructive mt-1">{countryCodeError}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const code = newCountryCode.toUpperCase().trim();
                    // Double-check validation before adding
                    if (code && code.length === 2 && isValidISOCountryCode(code) && !blockedCountries.includes(code)) {
                      setBlockedCountries([...blockedCountries, code]);
                      setNewCountryCode("");
                      setCountryCodeError("");
                    } else if (code && !isValidISOCountryCode(code)) {
                      setCountryCodeError("Invalid country code. Please use a valid ISO 3166-1 alpha-2 code (e.g., US, BD, GB)");
                    }
                  }}
                  disabled={
                    !newCountryCode || 
                    newCountryCode.length !== 2 || 
                    !!countryCodeError || 
                    !isValidISOCountryCode(newCountryCode.toUpperCase().trim()) || 
                    blockedCountries.includes(newCountryCode.toUpperCase().trim())
                  }
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Add valid ISO country codes manually (2 letters, e.g., US, BD, GB). Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">country_criteria</code> with <code className="text-xs bg-secondary px-1 py-0.5 rounded">blocked_countries</code>.
              </p>
            </div>

            {/* Reject clients with these country codes (phone) */}
            <div className="space-y-2">
              <Label>Reject clients with these country codes:</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {rejectedCodes
                  .filter(code => isValidPhoneCodeFormat(code.trim()) && isValidPhoneCountryCode(code.trim())) // Only show valid codes
                  .map((code) => {
                    const normalized = code.trim();
                    return (
                      <motion.span
                        key={normalized}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
                      >
                        {normalized}
                        <button
                          onClick={() => setRejectedCodes(rejectedCodes.filter((c) => c.trim() !== normalized))}
                          className="hover:text-destructive/70 ml-1"
                        >
                          ×
                        </button>
                      </motion.span>
                    );
                  })}
              </div>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="+XX"
                    value={newPhoneCode}
                    onChange={(e) => {
                      let value = e.target.value.trim();
                      
                      // Only allow + followed by digits
                      if (value && !value.startsWith("+")) {
                        // If user types without +, add it
                        if (/^\d/.test(value)) {
                          value = "+" + value;
                        } else {
                          // If it's not a digit, don't allow it
                          return;
                        }
                      }
                      
                      // After +, only allow digits (max 4 digits for country codes)
                      if (value.startsWith("+")) {
                        const afterPlus = value.slice(1);
                        // Remove any non-digit characters
                        const digitsOnly = afterPlus.replace(/\D/g, "");
                        // Limit to 4 digits max
                        const limited = digitsOnly.slice(0, 4);
                        value = "+" + limited;
                      }
                      
                      setNewPhoneCode(value);
                      
                      // Validate format and existence
                      if (value.length > 1) {
                        if (!isValidPhoneCodeFormat(value)) {
                          setPhoneCodeError("Invalid format. Use + followed by 1-4 digits (e.g., +1, +44, +880)");
                        } else if (!isValidPhoneCountryCode(value)) {
                          setPhoneCodeError("Phone country code not recognized. Use a valid dial code (e.g., +1, +44, +880)");
                        } else {
                          setPhoneCodeError("");
                        }
                      } else if (value === "+") {
                        setPhoneCodeError("");
                      } else {
                        setPhoneCodeError("");
                      }
                    }}
                    className={`w-24 ${phoneCodeError ? "border-destructive" : ""}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newPhoneCode && !phoneCodeError) {
                        if (isValidPhoneCountryCode(newPhoneCode) && !rejectedCodes.includes(newPhoneCode)) {
                          setRejectedCodes([...rejectedCodes, newPhoneCode]);
                          setNewPhoneCode("");
                          setPhoneCodeError("");
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const code = newPhoneCode.trim();
                      // Double-check validation before adding
                      if (code && isValidPhoneCodeFormat(code) && isValidPhoneCountryCode(code) && !rejectedCodes.includes(code)) {
                        setRejectedCodes([...rejectedCodes, code]);
                        setNewPhoneCode("");
                        setPhoneCodeError("");
                      } else if (code && !isValidPhoneCodeFormat(code)) {
                        setPhoneCodeError("Invalid format. Use + followed by 1-4 digits (e.g., +1, +44, +880)");
                      } else if (code && !isValidPhoneCountryCode(code)) {
                        setPhoneCodeError("Phone country code not recognized. Use a valid dial code (e.g., +1, +44, +880)");
                      }
                    }}
                    disabled={
                      !newPhoneCode || 
                      !isValidPhoneCodeFormat(newPhoneCode.trim()) ||
                      !isValidPhoneCountryCode(newPhoneCode.trim()) ||
                      !!phoneCodeError || 
                      rejectedCodes.includes(newPhoneCode.trim())
                    }
                  >
                    Add
                  </Button>
                </div>
                {phoneCodeError && (
                  <p className="text-xs text-destructive">{phoneCodeError}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Reject clients whose phone numbers have these country codes. Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">phone_country_match_criteria</code> or <code className="text-xs bg-secondary px-1 py-0.5 rounded">phone_format_criteria</code>.
              </p>
            </div>

            {/* Reject clients with these email providers */}
            <div className="space-y-2">
              <Label>Reject clients with these email providers:</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {blockedEmailProviders.map((provider) => (
                  <motion.span
                    key={provider}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
                  >
                    {provider}
                    <button
                      onClick={() => setBlockedEmailProviders(blockedEmailProviders.filter((p) => p !== provider))}
                      className="hover:text-destructive/70 ml-1"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="tempmail.com"
                  value={newEmailProvider}
                  onChange={(e) => setNewEmailProvider(e.target.value.toLowerCase().trim())}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newEmailProvider && !blockedEmailProviders.includes(newEmailProvider)) {
                      setBlockedEmailProviders([...blockedEmailProviders, newEmailProvider]);
                      setNewEmailProvider("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newEmailProvider && !blockedEmailProviders.includes(newEmailProvider)) {
                      setBlockedEmailProviders([...blockedEmailProviders, newEmailProvider]);
                      setNewEmailProvider("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Reject clients using these email provider domains. Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">email_provider_criteria</code> with <code className="text-xs bg-secondary px-1 py-0.5 rounded">blocked_providers</code>.
              </p>
            </div>

            {/* Auto gen password for leads */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Label>Auto gen password for leads</Label>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-popover border rounded-lg shadow-lg text-xs text-muted-foreground z-50">
                    If auto-gen is marked False, then interactivity is False and there is a mark of security concerns and no ability to auto reject based on inactivity. Uses <code className="text-xs">generate_password_if_missing</code> in transform config.
                  </div>
                </div>
              </div>
              <Switch checked={autoGenPassword} onCheckedChange={setAutoGenPassword} />
            </div>

            {/* Recover Leads & Export Reports */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Label>Recover Leads & Export Reports</Label>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-popover border rounded-lg shadow-lg text-xs text-muted-foreground z-50">
                    This allows for Client → Lead if not logged in for 14 days since Lead was approved by either auto approve or manual. Uses <code className="text-xs">interactivity_check</code> in transform config.
                  </div>
                </div>
              </div>
              <Switch checked={recoverLeads} onCheckedChange={setRecoverLeads} />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">TRADER Platform</h2>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                onClick={() => setTraderPlatform("MT5")}
                className={`w-full rounded-lg border p-5 text-left transition-colors duration-300 ${
                  traderPlatform === "MT5" ? "bg-primary/10 border-primary" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${traderPlatform === "MT5" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {traderPlatform === "MT5" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">HOUSE MT5</p>
                    <p className="text-xs text-muted-foreground">Full MetaTrader 5 platform</p>
                  </div>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                onClick={() => setTraderPlatform("NONE")}
                className={`w-full rounded-lg border p-5 text-left transition-colors duration-300 ${
                  traderPlatform === "NONE" ? "bg-warning/10 border-warning" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${traderPlatform === "NONE" ? "border-warning" : "border-muted-foreground/30"}`}>
                    {traderPlatform === "NONE" && <div className="w-2.5 h-2.5 rounded-full bg-warning" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">NO TRADER</p>
                    <p className="text-xs text-warning">Still able to trade but no WebTrader</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">TRADER MARKETS</h2>
            <div className="grid gap-3">
              {Object.entries(traderMarkets).map(([key, val]) => (
                <CheckCard key={key} label={key} checked={val} onChange={(v) => setTraderMarkets({ ...traderMarkets, [key]: v })} />
              ))}
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Trading Fees</h2>
            
            {/* Open Position Fees */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Open Position Fees</Label>
                <Switch checked={openPositionFeeEnabled} onCheckedChange={setOpenPositionFeeEnabled} />
              </div>
              {openPositionFeeEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOpenPositionFeeType("fixed")}
                      className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-300 ${
                        openPositionFeeType === "fixed"
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-card text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      Fixed Amount
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOpenPositionFeeType("percentage")}
                      className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-300 ${
                        openPositionFeeType === "percentage"
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-card text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      Percentage
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    <Label>Fee Value</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={openPositionFeeValue}
                        onChange={(e) => setOpenPositionFeeValue(e.target.value)}
                        placeholder={openPositionFeeType === "fixed" ? "0.00" : "0.00"}
                        className="flex-1"
                      />
                      <span className="flex items-center text-muted-foreground">
                        {openPositionFeeType === "percentage" ? "%" : currency}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Close Position Fees */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Close Position Fees</Label>
                <Switch checked={closePositionFeeEnabled} onCheckedChange={setClosePositionFeeEnabled} />
              </div>
              {closePositionFeeEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setClosePositionFeeType("fixed")}
                      className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-300 ${
                        closePositionFeeType === "fixed"
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-card text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      Fixed Amount
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setClosePositionFeeType("percentage")}
                      className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-300 ${
                        closePositionFeeType === "percentage"
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-card text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      Percentage
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    <Label>Fee Value</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={closePositionFeeValue}
                        onChange={(e) => setClosePositionFeeValue(e.target.value)}
                        placeholder={closePositionFeeType === "fixed" ? "0.00" : "0.00"}
                        className="flex-1"
                      />
                      <span className="flex items-center text-muted-foreground">
                        {closePositionFeeType === "percentage" ? "%" : currency}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 13:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">CLIENT TAS</h2>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label>ALLOW MULTI TAS</Label>
              <Switch checked={allowMultiTas} onCheckedChange={setAllowMultiTas} />
            </div>
            <div className="space-y-2">
              <Label>MAX PER CLIENT</Label>
              <Input type="number" value={maxPerClient} onChange={(e) => setMaxPerClient(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>MAX LEVERAGE</Label>
              <Input type="number" value={maxLeverage} onChange={(e) => setMaxLeverage(e.target.value)} />
            </div>
          </div>
        );

      case 14:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Default Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>TIME ZONE WORKERS</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST</SelectItem>
                    <SelectItem value="PST">PST</SelectItem>
                    <SelectItem value="CET">CET</SelectItem>
                    <SelectItem value="IST">IST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>LANG WORKERS</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>MAIN CURRENCY</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
          {/* Progress */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-foreground">Create New Brand</h1>
              <span className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="p-6 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="p-6 border-t flex justify-between">
            <Button variant="outline" onClick={prev} disabled={step === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            {step === TOTAL_STEPS ? (
              <Button onClick={() => { alert("Brand created! (mock)"); navigate("/"); }}>
                Finish Setup
              </Button>
            ) : (
              <Button onClick={next}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default CreateBrand;
