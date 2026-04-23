import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepTermsProps {
  brandLabel: string;
  brandDomain: string;
  privacyPolicy: string;
  terms: string;
  onPrivacyPolicyChange: (v: string) => void;
  onTermsChange: (v: string) => void;
}

export const StepTerms = ({ brandLabel, brandDomain, privacyPolicy, terms, onPrivacyPolicyChange, onTermsChange }: StepTermsProps) => (
  <StepShell
    icon={FileText}
    iconBg="bg-[hsl(38,92%,95%)]"
    iconColor="text-[hsl(38,80%,45%)]"
    title="Auth Gate Terms & Conditions"
    subtitle={`${brandLabel} · ${brandDomain} — These legal texts appear during authentication gates for client onboarding.`}
  >
    <StepCard className="p-6 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Privacy Policy</Label>
        <Textarea
          placeholder="Enter your privacy policy text..."
          rows={5}
          value={privacyPolicy}
          onChange={(e) => onPrivacyPolicyChange(e.target.value)}
          className="rounded-xl border-border/50 focus:border-primary/50 resize-none text-sm leading-relaxed"
        />
      </div>
      <div className="border-t border-border/40" />
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Terms of Service</Label>
        <Textarea
          placeholder="Enter your terms of service text..."
          rows={5}
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
          className="rounded-xl border-border/50 focus:border-primary/50 resize-none text-sm leading-relaxed"
        />
      </div>
    </StepCard>
  </StepShell>
);
