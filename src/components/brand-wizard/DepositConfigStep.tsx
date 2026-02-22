import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import MethodConfigCard from "./MethodConfigCard";
import {
  DepositMethod, BankDetails, WireTransferDetails, METHOD_LABELS,
  ExternalProviderConfig, IpayProviderConfig, CryptoNowProviderConfig,
} from "@/types/brand-config";

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

  const updateExternalConfig = (key: "fiat" | "crypto", updates: Partial<ExternalProviderConfig>) => {
    const method = methods[key];
    const curr = method.external_config ?? {};
    updateMethod(key, { external_config: { ...curr, ...updates } });
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
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Payment Deposit Providers</h2>
      <p className="text-sm text-muted-foreground">{brandLabel}: {brandDomain}</p>

      {/* Fiat & Crypto: provider choice (ours vs other) + config */}
      {providerMethods.length > 0 && (
        <div className="space-y-3">
          {providerMethods.map(([key, method]) => {
            const isFiat = key === "fiat";
            const ourProvider = isFiat ? FIAT_OUR_PROVIDER : CRYPTO_OUR_PROVIDER;
            const source = method.provider_source ?? "ours";
            const ipay = method.ipay_config ?? {};
            const cryptoNow = method.crypto_now_config ?? {};
            return (
              <div key={key} className="rounded-xl border border-border/50 p-4 space-y-3 bg-card shadow-widget">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">{METHOD_LABELS[key] || key}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Enabled</span>
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => updateMethod(key, { enabled: e.target.checked })}
                      className="w-4 h-4 rounded border-primary"
                    />
                  </div>
                </div>
                {method.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-2"
                  >
                    <Label className="text-xs text-muted-foreground">Provider</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`provider-${key}`}
                          checked={source === "ours"}
                          onChange={() => {
                            const updates: Partial<DepositMethod> = { provider_source: "ours", external_config: undefined };
                            if (!isFiat) updates.approval = { ...method.approval, mode: "manual" };
                            updateMethod(key, updates);
                          }}
                          className="rounded-full border-primary"
                        />
                        <span className="text-sm">Our solution ({ourProvider})</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`provider-${key}`}
                          checked={source === "other"}
                          onChange={() => updateMethod(key, { provider_source: "other", external_config: {} })}
                          className="rounded-full border-primary"
                        />
                        <span className="text-sm">Other (external)</span>
                      </label>
                    </div>

                    {/* iPay config (fiat, ours) */}
                    {source === "ours" && isFiat && (
                      <div className="rounded-xl border border-dashed border-border/60 p-4 space-y-3 bg-tint-blue/50">
                        <p className="text-xs text-muted-foreground">iPay configuration</p>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Base URL</Label>
                            <Input
                              placeholder="https://api.ipay.example.com"
                              value={ipay.base_url ?? ""}
                              onChange={(e) => updateIpayConfig({ base_url: e.target.value })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">IPAY API Key</Label>
                            <Input
                              type="password"
                              placeholder="API key from iPay"
                              value={ipay.api_key ?? ""}
                              onChange={(e) => updateIpayConfig({ api_key: e.target.value })}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/50 space-y-3">
                          <p className="text-xs text-muted-foreground">Fee & Approval <span className="text-muted-foreground/70">(fixed by iPay — not editable)</span></p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Fee Type</Label>
                              <Input
                                value={method.fee.type}
                                readOnly
                                disabled
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed capitalize"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">{method.fee.type === "fixed" ? "Fee ($)" : "Fee (%)"}</Label>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed"
                                value={method.fee.value}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Min Fee</Label>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed"
                                placeholder="None"
                                value={method.fee.min_fee ?? ""}
                                readOnly
                                disabled
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Max Fee</Label>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed"
                                placeholder="None"
                                value={method.fee.max_fee ?? ""}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Approval Mode</Label>
                            <Input
                              value={method.approval.mode}
                              readOnly
                              disabled
                              className="h-8 text-xs bg-muted/50 cursor-not-allowed capitalize"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Crypto Now config (crypto, ours) */}
                    {source === "ours" && !isFiat && (
                      <div className="rounded-xl border border-dashed border-border/60 p-4 space-y-3 bg-tint-blue/50">
                        <p className="text-xs text-muted-foreground">Crypto Now configuration</p>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Base URL</Label>
                            <Input
                              placeholder="https://api.cryptonow.example.com"
                              value={cryptoNow.base_url ?? ""}
                              onChange={(e) => updateCryptoNowConfig({ base_url: e.target.value })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Checkout URL</Label>
                            <Input
                              placeholder="https://checkout.cryptonow.example.com"
                              value={cryptoNow.checkout_url ?? ""}
                              onChange={(e) => updateCryptoNowConfig({ checkout_url: e.target.value })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Crypto Now Public Key</Label>
                            <Input
                              placeholder="Public key"
                              value={cryptoNow.public_key ?? ""}
                              onChange={(e) => updateCryptoNowConfig({ public_key: e.target.value })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Crypto Now Private Key</Label>
                            <Input
                              type="password"
                              placeholder="Private key"
                              value={cryptoNow.private_key ?? ""}
                              onChange={(e) => updateCryptoNowConfig({ private_key: e.target.value })}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/50 space-y-3">
                          <p className="text-xs text-muted-foreground">Fee & Approval <span className="text-muted-foreground/70">(fixed by Crypto Pay — not editable, manual approval only)</span></p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Fee Type</Label>
                              <Input
                                value={method.fee.type}
                                readOnly
                                disabled
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed capitalize"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">{method.fee.type === "fixed" ? "Fee ($)" : "Fee (%)"}</Label>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed"
                                value={method.fee.value}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Min Fee</Label>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed"
                                placeholder="None"
                                value={method.fee.min_fee ?? ""}
                                readOnly
                                disabled
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Max Fee</Label>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-muted/50 cursor-not-allowed"
                                placeholder="None"
                                value={method.fee.max_fee ?? ""}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Approval Mode</Label>
                            <Input
                              value="manual"
                              readOnly
                              disabled
                              className="h-8 text-xs bg-muted/50 cursor-not-allowed capitalize"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* External: read the docs */}
                    {source === "other" && (
                      <div className="rounded-xl border border-dashed border-border/60 p-4 space-y-3 bg-tint-blue/50">
                        <p className="text-sm text-muted-foreground">
                          For external providers, please read the documentation to configure your integration.
                        </p>
                        <Link
                          to="/providers?tab=payments"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Read provider docs & integration guides
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Regular methods with full config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* Bank Details - For client display (where to pay) */}
      {(methods.bank_transfer?.enabled || methods.wire_transfer?.enabled) && (
        <div className="space-y-3 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Bank & Wire Details (For Client Display - Where to Pay)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Bank Name</Label>
              <Input className="h-8 text-xs" value={bankDetails.bank_name} onChange={(e) => onBankDetailsChange({ ...bankDetails, bank_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account #</Label>
              <Input className="h-8 text-xs" value={bankDetails.account_number} onChange={(e) => onBankDetailsChange({ ...bankDetails, account_number: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Routing #</Label>
              <Input className="h-8 text-xs" value={bankDetails.routing_number} onChange={(e) => onBankDetailsChange({ ...bankDetails, routing_number: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Beneficiary</Label>
              <Input className="h-8 text-xs" value={bankDetails.beneficiary_name} onChange={(e) => onBankDetailsChange({ ...bankDetails, beneficiary_name: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Wire Bank Name</Label>
              <Input className="h-8 text-xs" value={wireDetails.bank_name} onChange={(e) => onWireDetailsChange({ ...wireDetails, bank_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">SWIFT Code</Label>
              <Input className="h-8 text-xs" value={wireDetails.swift_code} onChange={(e) => onWireDetailsChange({ ...wireDetails, swift_code: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositConfigStep;
