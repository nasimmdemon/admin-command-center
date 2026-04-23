import { Check, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeConfig, ApprovalConfig } from "@/types/brand-config";
import { motion, AnimatePresence } from "framer-motion";

interface MethodConfigCardProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  fee: FeeConfig;
  onFeeChange: (fee: FeeConfig) => void;
  approval: ApprovalConfig;
  onApprovalChange: (approval: ApprovalConfig) => void;
  minAmount?: number;
  onMinAmountChange?: (val: number) => void;
}

const MethodConfigCard = ({
  label, enabled, onToggle, fee, onFeeChange, approval, onApprovalChange, minAmount, onMinAmountChange,
}: MethodConfigCardProps) => {
  return (
    <div className={`rounded-2xl border transition-all duration-300 ease-out overflow-hidden ${
      enabled 
        ? "border-primary/40 bg-primary/[0.02] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]" 
        : "border-border/40 bg-white hover:border-border/80 shadow-sm"
    }`}>
      {/* Header Row */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => onToggle(!enabled)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            enabled ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-100" : "bg-muted text-muted-foreground scale-95"
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className={`text-[15px] font-bold ${enabled ? "text-primary" : "text-foreground"}`}>{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{enabled ? "Active and configured" : "Disabled"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {enabled && <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1.5"><Settings2 className="w-3 h-3" /> Configured</span>}
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {/* Expanded Config Dashboard */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-5 mx-4 mb-4 mt-1 bg-white rounded-xl shadow-sm border border-border/30 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fee Settings Column */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Fee Structure</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Calculation Type</Label>
                      <Select value={fee.type} onValueChange={(v) => onFeeChange({ ...fee, type: v as FeeConfig["type"] })}>
                        <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="percentage">Percentage Based</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="combined">Combined (%) + ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3">
                      <div className="space-y-1.5 flex-1">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          {fee.type === "fixed" ? "Fixed Fee ($)" : "Fee Value"}
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            className="h-10 rounded-xl bg-muted/20 border-border/50 pl-3 pr-8"
                            value={fee.value}
                            onChange={(e) => onFeeChange({ ...fee, value: parseFloat(e.target.value) || 0 })}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                            {fee.type === "percentage" ? "%" : "$"}
                          </span>
                        </div>
                      </div>
                      
                      {fee.type === "combined" && (
                        <div className="space-y-1.5 flex-1">
                          <Label className="text-xs font-semibold text-muted-foreground">Fixed portion ($)</Label>
                          <Input
                            type="number"
                            className="h-10 rounded-xl bg-muted/20 border-border/50"
                            value={fee.fixed ?? 0}
                            onChange={(e) => onFeeChange({ ...fee, fixed: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations & Limitations Column */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2">Operations & Limits</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Min Fee Cap</Label>
                      <Input
                        type="number"
                        className="h-10 rounded-xl bg-muted/20 border-border/50"
                        placeholder="No limit"
                        value={fee.min_fee ?? ""}
                        onChange={(e) => onFeeChange({ ...fee, min_fee: e.target.value ? parseFloat(e.target.value) : null })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Max Fee Cap</Label>
                      <Input
                        type="number"
                        className="h-10 rounded-xl bg-muted/20 border-border/50"
                        placeholder="No limit"
                        value={fee.max_fee ?? ""}
                        onChange={(e) => onFeeChange({ ...fee, max_fee: e.target.value ? parseFloat(e.target.value) : null })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Approval Mode</Label>
                      <Select value={approval.mode} onValueChange={(v) => onApprovalChange({ ...approval, mode: v as "auto" | "manual" })}>
                        <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="auto">Automatic</SelectItem>
                          <SelectItem value="manual">Manual Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {minAmount !== undefined && onMinAmountChange && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground">Min Transaction ($)</Label>
                        <Input
                          type="number"
                          className="h-10 rounded-xl bg-muted/20 border-border/50"
                          value={minAmount}
                          onChange={(e) => onMinAmountChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MethodConfigCard;
