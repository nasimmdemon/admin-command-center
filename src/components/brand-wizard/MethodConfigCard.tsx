import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeeConfig, ApprovalConfig } from "@/types/brand-config";

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
    <div className={`rounded-xl border transition-all duration-300 ease-smooth shadow-widget hover:shadow-card ${enabled ? "border-primary/60 bg-tint-blue" : "bg-card border-border/50"}`}>
      {/* Toggle header */}
      <motion.button
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => onToggle(!enabled)}
        className="w-full p-3 flex items-center gap-3 text-left rounded-xl"
      >
        <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
          enabled ? "bg-primary border-primary" : "border-muted-foreground/30"
        }`}>
          {enabled && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
        <span className={`text-sm font-medium flex-1 ${enabled ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
        {enabled && <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </motion.button>

      {/* Expanded config */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border/50">
              {/* Fee config */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Fee Type</Label>
                  <Select value={fee.type} onValueChange={(v) => onFeeChange({ ...fee, type: v as FeeConfig["type"] })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="combined">Combined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {fee.type === "fixed" ? "Fee ($)" : "Fee (%)"}
                  </Label>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={fee.value}
                    onChange={(e) => onFeeChange({ ...fee, value: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {fee.type === "combined" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Percentage (%)</Label>
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      value={fee.percentage ?? 0}
                      onChange={(e) => onFeeChange({ ...fee, percentage: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Fixed ($)</Label>
                    <Input
                      type="number"
                      className="h-8 text-xs"
                      value={fee.fixed ?? 0}
                      onChange={(e) => onFeeChange({ ...fee, fixed: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Min Fee</Label>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    placeholder="None"
                    value={fee.min_fee ?? ""}
                    onChange={(e) => onFeeChange({ ...fee, min_fee: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Max Fee</Label>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    placeholder="None"
                    value={fee.max_fee ?? ""}
                    onChange={(e) => onFeeChange({ ...fee, max_fee: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
              </div>

              {/* Approval mode */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Approval Mode</Label>
                <Select value={approval.mode} onValueChange={(v) => onApprovalChange({ ...approval, mode: v as "auto" | "manual" })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min amount if applicable */}
              {minAmount !== undefined && onMinAmountChange && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Min Amount ($)</Label>
                  <Input
                    type="number"
                    className="h-8 text-xs"
                    value={minAmount}
                    onChange={(e) => onMinAmountChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MethodConfigCard;
