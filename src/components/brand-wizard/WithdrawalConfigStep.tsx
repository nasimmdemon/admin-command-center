import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowUpFromLine, Settings2 } from "lucide-react";
import MethodConfigCard from "./MethodConfigCard";
import { WithdrawalMethod, GlobalSettings, METHOD_LABELS } from "@/types/brand-config";
import { StepShell, StepCard, SettingsRow } from "@/views/shared/StepShell";

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
    <StepShell
      icon={ArrowUpFromLine}
      iconBg="bg-[hsl(250,80%,96%)]"
      iconColor="text-[hsl(250,65%,58%)]"
      title="Withdrawal Methods"
      subtitle={`${brandLabel} · ${brandDomain} — Configure available withdrawal methods and global withdrawal thresholds.`}
    >
      <div className="space-y-6">
        
        {/* Method List */}
        <div className="space-y-3">
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
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Global Control
          </h3>

          <StepCard className="px-6 divide-y divide-border/30">
            {methods.bank_account?.enabled && (
              <SettingsRow label="Use credit data on withdrawal" description="Pre-fill client's bank details from deposit instead of asking" border={false}>
                <Switch
                  checked={globalSettings.useCreditDataOnWithdrawal ?? false}
                  onCheckedChange={(v) => onGlobalSettingsChange({ ...globalSettings, useCreditDataOnWithdrawal: v })}
                />
              </SettingsRow>
            )}

            <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Min Withdrawal ($)</Label>
                <Input
                  type="number"
                  className="rounded-xl border-border/50 h-10 max-w-xs"
                  value={globalSettings.min_withdrawal_amount}
                  onChange={(e) => onGlobalSettingsChange({ ...globalSettings, min_withdrawal_amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Withdrawal ($)</Label>
                <Input
                  type="number"
                  className="rounded-xl border-border/50 h-10 max-w-xs"
                  value={globalSettings.max_withdrawal_amount}
                  onChange={(e) => onGlobalSettingsChange({ ...globalSettings, max_withdrawal_amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </StepCard>
        </div>

      </div>
    </StepShell>
  );
};

export default WithdrawalConfigStep;
