import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ShieldCheck, CheckCircle2, Lock, AlertTriangle, Info } from "lucide-react";
import { CheckCard } from "../shared/CheckCard";
import { StepShell, StepCard, SettingsRow } from "@/views/shared/StepShell";
import type { UseCase } from "@/types/brand-config-per-brand";

interface StepKycProps {
  brandLabel: string;
  brandDomain: string;
  useCase?: UseCase | null;
  brandHasKyc: boolean;
  onBrandHasKycChange: (v: boolean) => void;
  brandRequiresKycToTrade: boolean;
  onBrandRequiresKycToTradeChange: (v: boolean) => void;
  kycRequireSelfie: boolean;
  onKycRequireSelfieChange: (v: boolean) => void;
  kycDocs: Record<string, boolean>;
  onKycDocsChange: (docs: Record<string, boolean>) => void;
  kycSpecificDocumentClientNeeds: string;
  onKycSpecificDocumentClientNeedsChange: (v: string) => void;
}

function UseCaseBanner({ useCase }: { useCase: UseCase | null | undefined }) {
  if (!useCase) return null;

  if (useCase === "regulated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
      >
        <Lock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-800 mb-0.5">Regulated Mode — KYC Enforced</p>
          <p className="text-xs text-emerald-700 leading-relaxed">
            KYC is required to trade in regulated mode. The <strong>"Requires KYC to trade"</strong>{" "}
            toggle is locked ON and cannot be disabled. This is enforced by your compliance
            configuration.
          </p>
        </div>
      </motion.div>
    );
  }

  if (useCase === "unregulated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3"
      >
        <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
        <p className="text-xs text-sky-700 leading-relaxed">
          <strong>Unregulated Mode:</strong> KYC is optional. You may enable or disable KYC and
          trading requirements freely. Clients may trade without completing KYC if configured.
        </p>
      </motion.div>
    );
  }

  if (useCase === "brand_recovery") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
      >
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Brand Recovery Mode:</strong> This brand does not include internal dealing. KYC
          settings here are informational only — they do not gate trading since no trading is
          available in this use case.
        </p>
      </motion.div>
    );
  }

  return null;
}

export const StepKyc = ({
  brandLabel,
  brandDomain,
  useCase,
  brandHasKyc,
  onBrandHasKycChange,
  brandRequiresKycToTrade,
  onBrandRequiresKycToTradeChange,
  kycRequireSelfie,
  onKycRequireSelfieChange,
  kycDocs,
  onKycDocsChange,
  kycSpecificDocumentClientNeeds,
  onKycSpecificDocumentClientNeedsChange,
}: StepKycProps) => {
  const isRegulated = useCase === "regulated";
  const isBrandRecovery = useCase === "brand_recovery";

  return (
    <StepShell
      icon={ShieldCheck}
      iconBg="bg-[hsl(250,80%,96%)]"
      iconColor="text-[hsl(250,65%,58%)]"
      title="KYC Settings"
      subtitle={`${brandLabel} · ${brandDomain} — Configure identity verification requirements for this brand.`}
    >
      <div className="space-y-4">
        {/* Use case banner */}
        <UseCaseBanner useCase={useCase} />

        {/* Toggle settings */}
        <StepCard className="px-6 divide-y divide-border/40">
          <SettingsRow
            label="Brand has KYC"
            description="Enable identity verification for this brand"
            border={false}
          >
            <Switch
              checked={brandHasKyc}
              onCheckedChange={onBrandHasKycChange}
              disabled={isBrandRecovery}
            />
          </SettingsRow>

          {brandHasKyc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
            >
              <SettingsRow
                label={
                  <span className="flex items-center gap-2">
                    Requires KYC to trade
                    {isRegulated && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" /> Locked ON
                      </span>
                    )}
                  </span>
                }
                description={
                  isRegulated
                    ? "Locked: regulated brands must require KYC before trading."
                    : "Client must complete KYC before trading. Manual approval is default when enabled."
                }
                border={false}
              >
                <Switch
                  checked={isRegulated ? true : brandRequiresKycToTrade}
                  onCheckedChange={
                    isRegulated
                      ? () => {} // no-op; show warning instead
                      : onBrandRequiresKycToTradeChange
                  }
                  disabled={isRegulated}
                />
              </SettingsRow>

              {isRegulated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 pb-3 px-0"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <p className="text-[11px] text-emerald-700">
                    This setting is enforced by the <strong>Regulated</strong> use case and cannot
                    be disabled here.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          <SettingsRow
            label="Require selfie"
            description="Documents only, or documents + selfie for KYC verification"
            border={false}
          >
            <Switch
              checked={kycRequireSelfie}
              onCheckedChange={onKycRequireSelfieChange}
              disabled={isBrandRecovery}
            />
          </SettingsRow>
        </StepCard>

        {/* Document types */}
        <StepCard className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Accepted documents</p>
            <p className="text-xs text-muted-foreground">Select which document types are accepted (allowed, not required)</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(kycDocs).map(([key, val]) => (
              <CheckCard
                key={key}
                label={key}
                checked={val}
                onChange={(v) => onKycDocsChange({ ...kycDocs, [key]: v })}
              />
            ))}
          </div>
          <div className="border-t border-border/40 pt-4 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Specific requirement note
            </Label>
            <p className="text-xs text-muted-foreground">e.g. "Passport + Proof of address" or custom per-client requirement</p>
            <Input
              placeholder="e.g. Passport + Utility Bill"
              value={kycSpecificDocumentClientNeeds}
              onChange={(e) => onKycSpecificDocumentClientNeedsChange(e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 h-10 mt-1"
            />
          </div>
        </StepCard>

        {!brandHasKyc && (
          <div className="rounded-xl border border-dashed border-border/50 p-4 bg-muted/30 text-sm text-muted-foreground text-center">
            KYC is disabled for {brandLabel}. Toggle "Brand has KYC" above to configure verification.
          </div>
        )}
      </div>
    </StepShell>
  );
};
