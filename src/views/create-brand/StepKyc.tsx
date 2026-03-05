import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { CheckCard } from "../shared/CheckCard";

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
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">KYC Settings</h2>
    <p className="text-sm text-muted-foreground">{brandLabel}: {brandDomain}</p>

    {/* 1. Brand has KYC? yes / no */}
    <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <div>
        <Label>Brand has KYC?</Label>
        <p className="text-xs text-muted-foreground mt-1">Does this brand use KYC at all?</p>
      </div>
      <Switch checked={brandHasKyc} onCheckedChange={onBrandHasKycChange} />
    </div>

    {/* 2. If yes: Brand requires KYC to trade? yes / no */}
    {brandHasKyc && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
        <div>
          <Label>Brand requires KYC to trade?</Label>
          <p className="text-xs text-muted-foreground mt-1">Must client complete KYC before trading? Manual approval is default when enabled</p>
        </div>
        <Switch checked={brandRequiresKycToTrade} onCheckedChange={onBrandRequiresKycToTradeChange} />
      </motion.div>
    )}

    {/* 3. Regardless: Required Selfie? */}
    <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <div>
        <Label>Required selfie?</Label>
        <p className="text-xs text-muted-foreground mt-1">Documents only, or documents + selfie for KYC</p>
      </div>
      <Switch checked={kycRequireSelfie} onCheckedChange={onKycRequireSelfieChange} />
    </div>

    {/* 4. Regardless: Which documents? + specific document client needs */}
    <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-4">
      <div>
        <Label className="text-sm font-medium">Which documents?</Label>
        <p className="text-xs text-muted-foreground mt-1">Select which document types the owner accepts (allowed, not required)</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {Object.entries(kycDocs).map(([key, val]) => (
            <CheckCard key={key} label={key} checked={val} onChange={(v) => onKycDocsChange({ ...kycDocs, [key]: v })} />
          ))}
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium">Specific document client needs</Label>
        <p className="text-xs text-muted-foreground mt-1">e.g. &quot;Passport + Proof of address&quot; or custom requirement per client</p>
        <Input
          placeholder="e.g. Passport + Utility Bill"
          value={kycSpecificDocumentClientNeeds}
          onChange={(e) => onKycSpecificDocumentClientNeedsChange(e.target.value)}
          className="mt-2"
        />
      </div>
    </div>

    {!brandHasKyc && (
      <div className="rounded-xl border border-dashed border-border/50 p-4 bg-muted/40">
        <p className="text-sm text-muted-foreground">{brandLabel} – KYC: No</p>
      </div>
    )}
  </div>
);
