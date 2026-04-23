import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { CheckCard } from "../shared/CheckCard";
import { StepShell, StepCard, SettingsRow } from "@/views/shared/StepShell";

interface StepKycProps {
  brandLabel: string;
  brandDomain: string;
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

export const StepKyc = ({
  brandLabel,
  brandDomain,
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
}: StepKycProps) => (
  <StepShell
    icon={ShieldCheck}
    iconBg="bg-[hsl(250,80%,96%)]"
    iconColor="text-[hsl(250,65%,58%)]"
    title="KYC Settings"
    subtitle={`${brandLabel} · ${brandDomain} — Configure identity verification requirements for this brand.`}
  >
    <div className="space-y-4">
      {/* Toggle settings */}
      <StepCard className="px-6 divide-y divide-border/40">
        <SettingsRow
          label="Brand has KYC"
          description="Enable identity verification for this brand"
          border={false}
        >
          <Switch checked={brandHasKyc} onCheckedChange={onBrandHasKycChange} />
        </SettingsRow>

        {brandHasKyc && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
          >
            <SettingsRow
              label="Requires KYC to trade"
              description="Client must complete KYC before trading. Manual approval is default when enabled."
              border={false}
            >
              <Switch checked={brandRequiresKycToTrade} onCheckedChange={onBrandRequiresKycToTradeChange} />
            </SettingsRow>
          </motion.div>
        )}

        <SettingsRow
          label="Require selfie"
          description="Documents only, or documents + selfie for KYC verification"
          border={false}
        >
          <Switch checked={kycRequireSelfie} onCheckedChange={onKycRequireSelfieChange} />
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
            <CheckCard key={key} label={key} checked={val} onChange={(v) => onKycDocsChange({ ...kycDocs, [key]: v })} />
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
