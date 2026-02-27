import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCard } from "../shared/CheckCard";

interface StepKycProps {
  brandLabel: string;
  brandDomain: string;
  kycEnabled: boolean;
  onKycEnabledChange: (v: boolean) => void;
  kycRequireSelfie: boolean;
  onKycRequireSelfieChange: (v: boolean) => void;
  kycDocs: Record<string, boolean>;
  onKycDocsChange: (docs: Record<string, boolean>) => void;
}

export const StepKyc = ({ brandLabel, brandDomain, kycEnabled, onKycEnabledChange, kycRequireSelfie, onKycRequireSelfieChange, kycDocs, onKycDocsChange }: StepKycProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">KYC Settings</h2>
    <p className="text-sm text-muted-foreground">{brandLabel}: {brandDomain}</p>
    <p className="text-xs text-muted-foreground">KYC with or without; when enabled, documents are allowed but not required.</p>
    <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <div>
        <Label>Require KYC to trade?</Label>
        <p className="text-xs text-muted-foreground mt-1">Manual approval is default when enabled</p>
      </div>
      <Switch checked={kycEnabled} onCheckedChange={onKycEnabledChange} />
    </div>
    {kycEnabled && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <div>
            <Label>Require selfie?</Label>
            <p className="text-xs text-muted-foreground mt-1">Documents only, or documents + selfie for KYC</p>
          </div>
          <Switch checked={kycRequireSelfie} onCheckedChange={onKycRequireSelfieChange} />
        </div>
        <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <Label className="text-sm font-medium">Documents (allowed, not required – select which the owner accepts)</Label>
          <p className="text-xs text-muted-foreground mt-1">KYC with or without; documents are optional. Check to allow each type.</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {Object.entries(kycDocs).map(([key, val]) => (
              <CheckCard key={key} label={key} checked={val} onChange={(v) => onKycDocsChange({ ...kycDocs, [key]: v })} />
            ))}
          </div>
        </div>
      </motion.div>
    )}
    {!kycEnabled && (
      <div className="rounded-xl border border-border/50 p-4 bg-muted/40">
        <p className="text-sm text-muted-foreground">{brandLabel} – KYC: No</p>
      </div>
    )}
  </div>
);
