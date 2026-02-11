import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCard } from "../shared/CheckCard";

interface StepKycProps {
  brandLabel: string;
  brandDomain: string;
  kycEnabled: boolean;
  onKycEnabledChange: (v: boolean) => void;
  kycDocs: Record<string, boolean>;
  onKycDocsChange: (docs: Record<string, boolean>) => void;
}

export const StepKyc = ({ brandLabel, brandDomain, kycEnabled, onKycEnabledChange, kycDocs, onKycDocsChange }: StepKycProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">KYC Settings</h2>
    <p className="text-sm text-muted-foreground">{brandLabel}: {brandDomain}</p>
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <Label>Require KYC to trade?</Label>
        <p className="text-xs text-muted-foreground mt-1">Manual approval is default when enabled</p>
      </div>
      <Switch checked={kycEnabled} onCheckedChange={onKycEnabledChange} />
    </div>
    {kycEnabled && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-4">
        <div className="rounded-lg border p-4">
          <Label className="text-sm font-medium">Documents (optional – select which the owner requires)</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {Object.entries(kycDocs).map(([key, val]) => (
              <CheckCard key={key} label={key} checked={val} onChange={(v) => onKycDocsChange({ ...kycDocs, [key]: v })} />
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
