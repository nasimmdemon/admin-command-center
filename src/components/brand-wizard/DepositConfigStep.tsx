import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowDownToLine, WalletCards, Building } from "lucide-react";
import MethodConfigCard from "./MethodConfigCard";
import {
  DepositMethod, BankDetails, WireTransferDetails, METHOD_LABELS,
  ExternalProviderConfig, IpayProviderConfig, CryptoNowProviderConfig,
} from "@/types/brand-config";
import { StepShell, StepCard, SettingsRow } from "@/views/shared/StepShell";
import { Switch } from "@/components/ui/switch";

interface DepositConfigStepProps {
  brandLabel: string;
  brandDomain: string;
  methods: Record<string, DepositMethod>;
  onMethodsChange: (methods: Record<string, DepositMethod>) => void;
  bankDetails: BankDetails;
  onBankDetailsChange: (details: BankDetails) => void;
  wireDetails: WireTransferDetails;
  onWireDetailsChange: (details: WireTransferDetails) => void;
}

const FIAT_OUR_PROVIDER = "iPay";
const CRYPTO_OUR_PROVIDER = "Crypto Now";

const DepositConfigStep = ({
  brandLabel, brandDomain, methods, onMethodsChange, bankDetails, onBankDetailsChange, wireDetails, onWireDetailsChange,
}: DepositConfigStepProps) => {
  const updateMethod = (key: string, updates: Partial<DepositMethod>) => {
    onMethodsChange({ ...methods, [key]: { ...methods[key], ...updates } });
  };

  const updateIpayConfig = (updates: Partial<IpayProviderConfig>) => {
    const curr = methods.fiat?.ipay_config ?? {};
    updateMethod("fiat", { ipay_config: { ...curr, ...updates } });
  };

  const updateCryptoNowConfig = (updates: Partial<CryptoNowProviderConfig>) => {
    const curr = methods.crypto?.crypto_now_config ?? {};
    updateMethod("crypto", { crypto_now_config: { ...curr, ...updates } });
  };

  const isProviderMethod = (key: string) => key === "fiat" || key === "crypto";
  const isDuplicateProvider = (key: string) => key === "ipay" || key === "cryptopay"; // iPay/cryptopay configured in Fiat/Crypto sections
  const regularMethods = Object.entries(methods).filter(([key]) => !isProviderMethod(key) && !isDuplicateProvider(key));
  const providerMethods = Object.entries(methods).filter(([key]) => isProviderMethod(key));

  return (
    <StepShell
      icon={ArrowDownToLine}
      iconBg="bg-[hsl(160,60%,95%)]"
      iconColor="text-[hsl(160,65%,38%)]"
      title="Deposit Methods"
      subtitle={`${brandLabel} · ${brandDomain} — Configure available deposit methods, associated fees, and approval modes.`}
    >
      <div className="space-y-6">
        
        {/* Core Provider Methods (Fiat / Crypto) */}
        {providerMethods.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <WalletCards className="w-4 h-4" /> Provider Integrations
            </h3>
            <div className="space-y-3">
              {providerMethods.map(([key, method]) => {
                const isFiat = key === "fiat";
                const ourProvider = isFiat ? FIAT_OUR_PROVIDER : CRYPTO_OUR_PROVIDER;
                const source = method.provider_source ?? "ours";
                const ipay = method.ipay_config ?? {};
                const cryptoNow = method.crypto_now_config ?? {};
                return (
                  <StepCard key={key} className="overflow-hidden">
                    <div className={`p-4 flex items-center justify-between border-b ${method.enabled ? "bg-primary/5 border-primary/20" : "bg-card border-border/40"}`}>
                      <p className={`font-bold ${method.enabled ? "text-primary" : "text-foreground"}`}>
                        {METHOD_LABELS[key] || key}
                      </p>
                      <Switch checked={method.enabled} onCheckedChange={(v) => updateMethod(key, { enabled: v })} />
                    </div>

                    {method.enabled && (
                      <div className="p-4 space-y-5 bg-white">
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Provider Selection</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                const updates: Partial<DepositMethod> = { provider_source: "ours", external_config: undefined };
                                if (!isFiat) updates.approval = { ...method.approval, mode: "manual" };
                                updateMethod(key, updates);
                              }}
                              className={`rounded-xl border p-3 text-left transition-colors ${
                                source === "ours" ? "bg-primary/5 border-primary/50 text-primary" : "border-border/40 hover:border-border/80"
                              }`}
                            >
                              <p className="text-sm font-bold">Our solution</p>
                              <p className="text-xs opacity-80 mt-0.5">{ourProvider}</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateMethod(key, { provider_source: "other", external_config: {} })}
                              className={`rounded-xl border p-3 text-left transition-colors ${
                                source === "other" ? "bg-primary/5 border-primary/50 text-primary" : "border-border/40 hover:border-border/80"
                              }`}
                            >
                              <p className="text-sm font-bold">External APIs</p>
                              <p className="text-xs opacity-80 mt-0.5">Use your infrastructure</p>
                            </button>
                          </div>
                        </div>

                        {/* Provider Configs */}
                        {source === "ours" && isFiat && (
                          <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{ourProvider} Config</Label>
                            <div className="space-y-3">
                              <Input placeholder="Base URL (e.g. https://api.ipay.com)" value={ipay.base_url ?? ""} onChange={(e) => updateIpayConfig({ base_url: e.target.value })} className="rounded-xl border-border/50" />
                              <Input type="password" placeholder="API Key" value={ipay.api_key ?? ""} onChange={(e) => updateIpayConfig({ api_key: e.target.value })} className="rounded-xl border-border/50" />
                            </div>
                          </div>
                        )}

                        {source === "ours" && !isFiat && (
                          <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{ourProvider} Config</Label>
                            <div className="space-y-3">
                              <Input placeholder="Base URL" value={cryptoNow.base_url ?? ""} onChange={(e) => updateCryptoNowConfig({ base_url: e.target.value })} className="rounded-xl border-border/50" />
                              <Input placeholder="Checkout URL" value={cryptoNow.checkout_url ?? ""} onChange={(e) => updateCryptoNowConfig({ checkout_url: e.target.value })} className="rounded-xl border-border/50" />
                              <Input placeholder="Public Key" value={cryptoNow.public_key ?? ""} onChange={(e) => updateCryptoNowConfig({ public_key: e.target.value })} className="rounded-xl border-border/50" />
                              <Input type="password" placeholder="Private Key" value={cryptoNow.private_key ?? ""} onChange={(e) => updateCryptoNowConfig({ private_key: e.target.value })} className="rounded-xl border-border/50" />
                            </div>
                          </div>
                        )}

                        {source === "other" && (
                          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground mb-2">Please read the documentation to configure your custom external provider integration.</p>
                            <Link to="/providers?tab=payments" target="_blank" className="font-semibold text-primary underline text-sm inline-flex items-center gap-1">
                              <ExternalLink className="w-3.5 h-3.5" /> View Docs
                            </Link>
                          </div>
                        )}

                        {/* Read-only fees for 'ours' */}
                        {source === "ours" && (
                          <div className="pt-4 border-t border-border/30">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Hardcoded By Provider</Label>
                            <div className="grid grid-cols-2 gap-2 text-sm opacity-60">
                              <div className="rounded-lg bg-muted/60 p-2 text-center">Fee: {method.fee.value}{method.fee.type === "percentage" ? "%" : "$"} ({method.fee.type})</div>
                              <div className="rounded-lg bg-muted/60 p-2 text-center">Mode: {method.approval.mode}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </StepCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Standard Methods */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Building className="w-4 h-4" /> Standard Methods
          </h3>
          <div className="space-y-3">
            {regularMethods.map(([key, method]) => (
              <MethodConfigCard
                key={key}
                label={METHOD_LABELS[key] || key}
                enabled={method.enabled}
                onToggle={(enabled) => updateMethod(key, { enabled })}
                fee={method.fee}
                onFeeChange={(fee) => updateMethod(key, { fee })}
                approval={method.approval}
                onApprovalChange={(approval) => updateMethod(key, { approval })}
                minAmount={method.min_amount}
                onMinAmountChange={key === "bank_transfer" ? (v) => updateMethod(key, { min_amount: v }) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Bank & Wire Details */}
        {(methods.bank_transfer?.enabled || methods.wire_transfer?.enabled) && (
          <div className="space-y-4 pt-6 border-t border-border/40">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Bank & Wire Displays (Where to Pay)</h3>
            <StepCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground border-b border-border/40 pb-2">Bank Details</h4>
                  <div className="space-y-3">
                    <Input placeholder="Bank Name" value={bankDetails.bank_name} onChange={(e) => onBankDetailsChange({ ...bankDetails, bank_name: e.target.value })} className="rounded-xl border-border/50" />
                    <Input placeholder="Account Number" value={bankDetails.account_number} onChange={(e) => onBankDetailsChange({ ...bankDetails, account_number: e.target.value })} className="rounded-xl border-border/50" />
                    <Input placeholder="Routing Number (Optional)" value={bankDetails.routing_number} onChange={(e) => onBankDetailsChange({ ...bankDetails, routing_number: e.target.value })} className="rounded-xl border-border/50" />
                    <Input placeholder="Beneficiary Name" value={bankDetails.beneficiary_name} onChange={(e) => onBankDetailsChange({ ...bankDetails, beneficiary_name: e.target.value })} className="rounded-xl border-border/50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground border-b border-border/40 pb-2">Wire Details</h4>
                  <div className="space-y-3">
                    <Input placeholder="Wire Bank Name" value={wireDetails.bank_name} onChange={(e) => onWireDetailsChange({ ...wireDetails, bank_name: e.target.value })} className="rounded-xl border-border/50" />
                    <Input placeholder="SWIFT Code" value={wireDetails.swift_code} onChange={(e) => onWireDetailsChange({ ...wireDetails, swift_code: e.target.value })} className="rounded-xl border-border/50" />
                  </div>
                </div>
              </div>
            </StepCard>
          </div>
        )}

      </div>
    </StepShell>
  );
};

export default DepositConfigStep;
