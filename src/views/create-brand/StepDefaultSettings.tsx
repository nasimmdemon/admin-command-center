import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepDefaultSettingsProps {
  timezone: string;
  onTimezoneChange: (v: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  currency: string;
  onCurrencyChange: (v: string) => void;
}

export const StepDefaultSettings = ({ timezone, onTimezoneChange, language, onLanguageChange, currency, onCurrencyChange }: StepDefaultSettingsProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Default Settings</h2>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>TIME ZONE WORKERS</Label>
        <Select value={timezone} onValueChange={onTimezoneChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="EST">EST</SelectItem>
            <SelectItem value="PST">PST</SelectItem>
            <SelectItem value="CET">CET</SelectItem>
            <SelectItem value="IST">IST</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>LANG WORKERS</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>MAIN CURRENCY</Label>
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="BTC">BTC</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);
