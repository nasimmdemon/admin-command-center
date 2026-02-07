import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MethodConfigCard from "./MethodConfigCard";
import {
  DepositMethod, BankDetails, WireTransferDetails, METHOD_LABELS,
} from "@/types/brand-config";

interface DepositConfigStepProps {
  brandLabel: string;
  brandDomain: string;
  methods: Record<string, DepositMethod>;
  onMethodsChange: (methods: Record<string, DepositMethod>) => void;
  bankDetails: BankDetails;
  onBankDetailsChange: (details: BankDetails) => void;
  wireDetails: WireTransferDetails;
  onWireDetailsChange: (details: WireTransferDetails) => void;
}

const DepositConfigStep = ({
  brandLabel, brandDomain, methods, onMethodsChange, bankDetails, onBankDetailsChange, wireDetails, onWireDetailsChange,
}: DepositConfigStepProps) => {
  const updateMethod = (key: string, updates: Partial<DepositMethod>) => {
    onMethodsChange({ ...methods, [key]: { ...methods[key], ...updates } });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Payment Deposit Providers</h2>
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
            minAmount={method.min_amount}
            onMinAmountChange={key === "bank_transfer" ? (v) => updateMethod(key, { min_amount: v }) : undefined}
          />
        ))}
      </div>

      {/* Bank Details */}
      {(methods.bank_transfer?.enabled || methods.wire_transfer?.enabled) && (
        <div className="space-y-3 rounded-lg border p-4">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Bank & Wire Details</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Bank Name</Label>
              <Input className="h-8 text-xs" value={bankDetails.bank_name} onChange={(e) => onBankDetailsChange({ ...bankDetails, bank_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account #</Label>
              <Input className="h-8 text-xs" value={bankDetails.account_number} onChange={(e) => onBankDetailsChange({ ...bankDetails, account_number: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Routing #</Label>
              <Input className="h-8 text-xs" value={bankDetails.routing_number} onChange={(e) => onBankDetailsChange({ ...bankDetails, routing_number: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Beneficiary</Label>
              <Input className="h-8 text-xs" value={bankDetails.beneficiary_name} onChange={(e) => onBankDetailsChange({ ...bankDetails, beneficiary_name: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Wire Bank Name</Label>
              <Input className="h-8 text-xs" value={wireDetails.bank_name} onChange={(e) => onWireDetailsChange({ ...wireDetails, bank_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">SWIFT Code</Label>
              <Input className="h-8 text-xs" value={wireDetails.swift_code} onChange={(e) => onWireDetailsChange({ ...wireDetails, swift_code: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositConfigStep;
