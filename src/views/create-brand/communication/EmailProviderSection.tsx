import { Link } from "react-router-dom";
import { ExternalLink, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProviderOptionCard } from "./ProviderOptionCard";

interface EmailProviderSectionProps {
  value: "maileroo" | "alexders" | "other";
  onChange: (v: "maileroo" | "alexders" | "other") => void;
}

export const EmailProviderSection = ({ value, onChange }: EmailProviderSectionProps) => (
  <div className="space-y-3">
    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Provider</Label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <ProviderOptionCard label="Maileroo" sublabel="Lower cost" selected={value === "maileroo"} onClick={() => onChange("maileroo")} />
      <ProviderOptionCard label="Alexders Moldova Solution" sublabel="Higher cost per month" selected={value === "alexders"} onClick={() => onChange("alexders")} />
      <ProviderOptionCard label="Other (external)" sublabel="Connect your own provider" selected={value === "other"} onClick={() => onChange("other")} />
    </div>
    {value === "other" && (
      <div className="rounded-lg border border-dashed p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground mb-2">Email provider is not ours — use our docs to connect external provider.</p>
        <Link to="/providers?tab=email" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
          <ExternalLink className="w-4 h-4" />
          View provider docs (Email)
        </Link>
      </div>
    )}
    {(value === "maileroo" || value === "alexders") && (
      <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">With Alexders: higher cost per month, no spam risk. Lower-cost option may land in spam.</p>
      </div>
    )}
  </div>
);
