import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepTermsProps {
  brandLabel: string;
  brandDomain: string;
  privacyPolicy: string;
  terms: string;
  onPrivacyPolicyChange: (v: string) => void;
  onTermsChange: (v: string) => void;
}

export const StepTerms = ({ brandLabel, brandDomain, privacyPolicy, terms, onPrivacyPolicyChange, onTermsChange }: StepTermsProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Auth Gate Terms & Conditions</h2>
    <p className="text-sm text-muted-foreground">{brandLabel}: {brandDomain}</p>
    <div className="space-y-2">
      <Label>Privacy Policy</Label>
      <Textarea placeholder="Enter your privacy policy text..." rows={5} value={privacyPolicy} onChange={(e) => onPrivacyPolicyChange(e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Terms Of Service Agreed By Client</Label>
      <Textarea placeholder="Enter your terms of service text..." rows={5} value={terms} onChange={(e) => onTermsChange(e.target.value)} />
    </div>
  </div>
);
