import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepDefaultSettingsProps {
  timezone: string;
  onTimezoneChange: (v: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
}

const SelectField = ({
  label,
  description,
  value,
  onChange,
  children,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-6 py-4 border-b border-border/40 last:border-0">
    <div className="min-w-0">
      <p className="text-[14px] font-semibold text-foreground">{label}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
    <div className="shrink-0 w-44">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl border-border/50 h-10 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  </div>
);

export const StepDefaultSettings = ({ timezone, onTimezoneChange, language, onLanguageChange, currency, onCurrencyChange }: StepDefaultSettingsProps) => (
  <StepShell
    icon={Settings2}
    iconBg="bg-[hsl(250,80%,96%)]"
    iconColor="text-[hsl(250,65%,58%)]"
    title="Default Settings"
    subtitle="Set global defaults for timezone, language, and currency. These apply to worker accounts on this brand."
  >
    <StepCard className="px-6 divide-y divide-border/40">
      <SelectField
        label="Worker timezone"
        description="Default timezone for all workers on this brand"
        value={timezone}
        onChange={onTimezoneChange}
      >
        <SelectItem value="UTC">UTC</SelectItem>
        <SelectItem value="EST">EST</SelectItem>
        <SelectItem value="PST">PST</SelectItem>
        <SelectItem value="CET">CET</SelectItem>
        <SelectItem value="IST">IST</SelectItem>
      </SelectField>
      <SelectField
        label="Worker language"
        description="Primary language for the worker interface"
        value={language}
        onChange={onLanguageChange}
      >
        <SelectItem value="English">English</SelectItem>
        <SelectItem value="Spanish">Spanish</SelectItem>
        <SelectItem value="French">French</SelectItem>
        <SelectItem value="German">German</SelectItem>
      </SelectField>
      <SelectField
        label="Main currency"
        description="Base currency used across this brand"
        value={currency}
        onChange={onCurrencyChange}
      >
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="EUR">EUR</SelectItem>
        <SelectItem value="GBP">GBP</SelectItem>
        <SelectItem value="BTC">BTC</SelectItem>
      </SelectField>
    </StepCard>
  </StepShell>
);
