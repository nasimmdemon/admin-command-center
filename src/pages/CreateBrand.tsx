import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { ArrowLeft, ArrowRight, Plus, Trash2, Upload, Globe, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TOTAL_STEPS = 13;

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

  // Step 2 state
  const [depositProviders, setDepositProviders] = useState<Record<string, boolean>>({
    "Fiat Payments": true, "Crypto Payments": false, "Wire Transfer": true,
    "Bank Deposit": false, "Loan": false, "iPay": false,
    "FUTURE PAY": false, "cryptopay": false, "TOKEN PAYMENTS": false,
  });

  // Step 3
  const [withdrawalMethods, setWithdrawalMethods] = useState<Record<string, boolean>>({
    "Wire Transfer": true, "Crypto Payments": true, "Bank Deposit": false,
  });

  // Step 4
  const [kycEnabled, setKycEnabled] = useState(true);
  const [requireDocs, setRequireDocs] = useState(true);
  const [kycDocs, setKycDocs] = useState<Record<string, boolean>>({
    "Passport": true, "ID": true, "Utility Bill": true, "Require Selfie": true,
  });

  // Step 5
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");

  // Step 9
  const [rejectedCodes, setRejectedCodes] = useState(["+1", "+44"]);
  const [newCode, setNewCode] = useState("");
  const [blockedEmails, setBlockedEmails] = useState<Record<string, boolean>>({
    "tempmail.com": true, "guerrillamail.com": true, "mailinator.com": true,
  });
  const [autoGenPassword, setAutoGenPassword] = useState(false);
  const [recoverLeads, setRecoverLeads] = useState(true);

  // Step 10
  const [traderPlatform, setTraderPlatform] = useState("MT5");

  // Step 11
  const [traderMarkets, setTraderMarkets] = useState<Record<string, boolean>>({
    "CRYPTO - CFD'S": true, "FOREX": true, "COMMODITIES": true,
  });

  // Step 12
  const [allowMultiTas, setAllowMultiTas] = useState(true);
  const [maxPerClient, setMaxPerClient] = useState("3");
  const [maxLeverage, setMaxLeverage] = useState("100");

  // Step 13
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Payment Deposit Providers</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}: {brands[0]?.domain || "domain.com"}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(depositProviders).map(([key, val]) => (
                <CheckCard key={key} label={key} checked={val} onChange={(v) => setDepositProviders({ ...depositProviders, [key]: v })} />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Withdrawal Methods</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}: {brands[0]?.domain || "domain.com"}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(withdrawalMethods).map(([key, val]) => (
                <CheckCard key={key} label={key} checked={val} onChange={(v) => setWithdrawalMethods({ ...withdrawalMethods, [key]: v })} />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">KYC Settings</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}: {brands[0]?.domain || "domain.com"}</p>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label>Include KYC with Manual Approving?</Label>
              <Switch checked={kycEnabled} onCheckedChange={setKycEnabled} />
            </div>
            {kycEnabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label>Require Documents</Label>
                  <Switch checked={requireDocs} onCheckedChange={setRequireDocs} />
                </div>
                {requireDocs && (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(kycDocs).map(([key, val]) => (
                      <CheckCard key={key} label={key} checked={val} onChange={(v) => setKycDocs({ ...kycDocs, [key]: v })} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {!kycEnabled && (
              <div className="rounded-lg border p-4 bg-secondary/50">
                <p className="text-sm text-muted-foreground">{brandLabel} - KYC: No</p>
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
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Communication Providers</h2>
            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Provider</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CheckCard label="Maileroo" checked={true} onChange={() => {}} />
                <CheckCard label="Alexders Moldova Solution" checked={false} onChange={() => {}} />
              </div>
              <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">With Alexnder: more cost per month, no spam risk. Free option may land in spam.</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">VoIP Provider</Label>
              <CheckCard label="VoiceX" checked={true} onChange={() => {}} />
              <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">You'll get from us the covering area of this service.</p>
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
            <h2 className="text-lg font-semibold text-foreground">TRANSFORM (Auto Rejection)</h2>
            <p className="text-sm text-muted-foreground">{brandLabel}</p>

            <div className="space-y-2">
              <Label>Reject clients from those countries</Label>
              <div className="rounded-lg border p-4 bg-secondary/30 flex items-center justify-center h-40">
                <div className="text-center text-muted-foreground">
                  <Globe className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-xs">Interactive world map — click countries to toggle</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reject clients with these country codes</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {rejectedCodes.map((code) => (
                  <span key={code} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                    {code}
                    <button onClick={() => setRejectedCodes(rejectedCodes.filter((c) => c !== code))} className="hover:text-destructive/70">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="+XX" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="w-24" />
                <Button variant="outline" size="sm" onClick={() => { if (newCode) { setRejectedCodes([...rejectedCodes, newCode]); setNewCode(""); } }}>Add</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reject clients with these email providers</Label>
              <div className="space-y-2">
                {Object.entries(blockedEmails).map(([key, val]) => (
                  <CheckCard key={key} label={key} checked={val} onChange={(v) => setBlockedEmails({ ...blockedEmails, [key]: v })} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Label>Auto gen password for leads</Label>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <Switch checked={autoGenPassword} onCheckedChange={setAutoGenPassword} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label>Recover Leads & Export Reports</Label>
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

      case 13:
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
