import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

      {/* Global Settings */}
      <div className="space-y-3 rounded-lg border p-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Global Withdrawal Settings</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Min Deposit ($)</Label>
            <Input type="number" className="h-8 text-xs" value={globalSettings.min_deposit_amount}
              onChange={(e) => onGlobalSettingsChange({ ...globalSettings, min_deposit_amount: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max Deposit ($)</Label>
            <Input type="number" className="h-8 text-xs" value={globalSettings.max_deposit_amount}
              onChange={(e) => onGlobalSettingsChange({ ...globalSettings, max_deposit_amount: parseFloat(e.target.value) || 0 })} />
          </div>
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
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Default Fee (%)</Label>
            <Input type="number" className="h-8 text-xs" value={globalSettings.default_fee_value}
              onChange={(e) => onGlobalSettingsChange({ ...globalSettings, default_fee_value: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalConfigStep;
