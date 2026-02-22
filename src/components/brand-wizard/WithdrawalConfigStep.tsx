import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MethodConfigCard from "./MethodConfigCard";
import { WithdrawalMethod, GlobalSettings, METHOD_LABELS } from "@/types/brand-config";

interface WithdrawalConfigStepProps {
  brandLabel: string;
  brandDomain: string;
  methods: Record<string, WithdrawalMethod>;
  onMethodsChange: (methods: Record<string, WithdrawalMethod>) => void;
  globalSettings: GlobalSettings;
  onGlobalSettingsChange: (settings: GlobalSettings) => void;
}

const WithdrawalConfigStep = ({
  brandLabel, brandDomain, methods, onMethodsChange, globalSettings, onGlobalSettingsChange,
}: WithdrawalConfigStepProps) => {
  const updateMethod = (key: string, updates: Partial<WithdrawalMethod>) => {
    onMethodsChange({ ...methods, [key]: { ...methods[key], ...updates } });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Withdrawal Methods</h2>
      <p className="text-sm text-muted-foreground">{brandLabel}: {brandDomain}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(methods).map(([key, method]) => (
          <MethodConfigCard
            key={key}
            label={METHOD_LABELS[key] || key}
            enabled={method.enabled}
            onToggle={(enabled) => updateMethod(key, { enabled })}
            fee={method.fee}
            onFeeChange={(fee) => updateMethod(key, { fee })}
            approval={method.approval}
            onApprovalChange={(approval) => updateMethod(key, { approval })}
          />
        ))}
      </div>

      {/* Use credit data on withdrawal - when bank transfer is enabled */}
      {methods.bank_account?.enabled && (
        <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <div>
            <Label className="text-sm font-medium">Use credit data on withdrawal</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Use client&apos;s bank details from deposit/credit instead of asking</p>
          </div>
          <Switch
            checked={globalSettings.useCreditDataOnWithdrawal ?? false}
            onCheckedChange={(v) => onGlobalSettingsChange({ ...globalSettings, useCreditDataOnWithdrawal: v })}
          />
        </div>
      )}

      {/* Global Settings */}
      <div className="space-y-3 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Global Withdrawal Settings</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Min Withdrawal ($)</Label>
            <Input type="number" className="h-8 text-xs" value={globalSettings.min_withdrawal_amount}
              onChange={(e) => onGlobalSettingsChange({ ...globalSettings, min_withdrawal_amount: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max Withdrawal ($)</Label>
            <Input type="number" className="h-8 text-xs" value={globalSettings.max_withdrawal_amount}
              onChange={(e) => onGlobalSettingsChange({ ...globalSettings, max_withdrawal_amount: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Note: Fee min/max are configured per withdrawal method above. Each method supports minimum and maximum fee limits.
        </p>
      </div>
    </div>
  );
};

export default WithdrawalConfigStep;
