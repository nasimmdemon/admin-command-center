import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MethodConfigCard from "./MethodConfigCard";
import { WithdrawalMethod, GlobalSettings, METHOD_LABELS, BankDetails, WireTransferDetails } from "@/types/brand-config";

interface WithdrawalConfigStepProps {
  brandLabel: string;
  brandDomain: string;
  methods: Record<string, WithdrawalMethod>;
  onMethodsChange: (methods: Record<string, WithdrawalMethod>) => void;
  globalSettings: GlobalSettings;
  onGlobalSettingsChange: (settings: GlobalSettings) => void;
  withdrawalBankDetails?: BankDetails;
  onWithdrawalBankDetailsChange?: (details: BankDetails) => void;
  withdrawalWireDetails?: WireTransferDetails;
  onWithdrawalWireDetailsChange?: (details: WireTransferDetails) => void;
}

const WithdrawalConfigStep = ({
  brandLabel, brandDomain, methods, onMethodsChange, globalSettings, onGlobalSettingsChange,
  withdrawalBankDetails, onWithdrawalBankDetailsChange, withdrawalWireDetails, onWithdrawalWireDetailsChange,
}: WithdrawalConfigStepProps) => {
  const [localBankDetails, setLocalBankDetails] = useState<BankDetails>(
    withdrawalBankDetails || { bank_name: "", account_number: "", routing_number: "", beneficiary_name: "" }
  );
  const [localWireDetails, setLocalWireDetails] = useState<WireTransferDetails>(
    withdrawalWireDetails || { bank_name: "", account_number: "", swift_code: "" }
  );

  const updateMethod = (key: string, updates: Partial<WithdrawalMethod>) => {
    onMethodsChange({ ...methods, [key]: { ...methods[key], ...updates } });
  };

  const updateBankDetails = (updates: Partial<BankDetails>) => {
    const newDetails = { ...localBankDetails, ...updates };
    setLocalBankDetails(newDetails);
    onWithdrawalBankDetailsChange?.(newDetails);
  };

  const updateWireDetails = (updates: Partial<WireTransferDetails>) => {
    const newDetails = { ...localWireDetails, ...updates };
    setLocalWireDetails(newDetails);
    onWithdrawalWireDetailsChange?.(newDetails);
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

      {/* Bank Account Details - For client input (where to send money) */}
      {(methods.bank_account?.enabled || methods.wire_transfer?.enabled) && (
        <div className="space-y-3 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Bank & Wire Details (For Client Input - Where to Send Money)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Bank Name</Label>
              <Input className="h-8 text-xs" value={localBankDetails.bank_name} onChange={(e) => updateBankDetails({ bank_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account #</Label>
              <Input className="h-8 text-xs" value={localBankDetails.account_number} onChange={(e) => updateBankDetails({ account_number: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Routing #</Label>
              <Input className="h-8 text-xs" value={localBankDetails.routing_number} onChange={(e) => updateBankDetails({ routing_number: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Beneficiary</Label>
              <Input className="h-8 text-xs" value={localBankDetails.beneficiary_name} onChange={(e) => updateBankDetails({ beneficiary_name: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Wire Bank Name</Label>
              <Input className="h-8 text-xs" value={localWireDetails.bank_name} onChange={(e) => updateWireDetails({ bank_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">SWIFT Code</Label>
              <Input className="h-8 text-xs" value={localWireDetails.swift_code} onChange={(e) => updateWireDetails({ swift_code: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Wire Account #</Label>
              <Input className="h-8 text-xs" value={localWireDetails.account_number} onChange={(e) => updateWireDetails({ account_number: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {/* Global Settings */}
      <div className="space-y-3 rounded-lg border p-4">
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
