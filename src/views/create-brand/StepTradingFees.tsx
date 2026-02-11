import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FeeConfig {
  enabled: boolean;
  type: "fixed" | "percentage";
  value: string;
}

interface StepTradingFeesProps {
  openPosition: FeeConfig;
  onOpenPositionChange: (v: Partial<FeeConfig>) => void;
  closePosition: FeeConfig;
  onClosePositionChange: (v: Partial<FeeConfig>) => void;
  currency: string;
}

const FeeSection = ({
  label,
  fee,
  onChange,
  currency,
}: {
  label: string;
  fee: FeeConfig;
  onChange: (v: Partial<FeeConfig>) => void;
  currency: string;
}) => (
  <div className="space-y-4 rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <Label className="text-base font-medium">{label}</Label>
      <Switch checked={fee.enabled} onCheckedChange={(v) => onChange({ enabled: v })} />
    </div>
    {fee.enabled && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-3 pt-2">
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ type: "fixed" })}
            className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-300 ${
              fee.type === "fixed" ? "bg-primary/10 border-primary text-foreground" : "bg-card text-muted-foreground hover:border-muted-foreground/50"
            }`}
          >
            Fixed Amount
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ type: "percentage" })}
            className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors duration-300 ${
              fee.type === "percentage" ? "bg-primary/10 border-primary text-foreground" : "bg-card text-muted-foreground hover:border-muted-foreground/50"
            }`}
          >
            Percentage
          </motion.button>
        </div>
        <div className="space-y-2">
          <Label>Fee Value</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={fee.value}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder={fee.type === "fixed" ? "0.00" : "0.00"}
              className="flex-1"
            />
            <span className="flex items-center text-muted-foreground">{fee.type === "percentage" ? "%" : currency}</span>
          </div>
        </div>
      </motion.div>
    )}
  </div>
);

export const StepTradingFees = ({ openPosition, onOpenPositionChange, closePosition, onClosePositionChange, currency }: StepTradingFeesProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Trading Fees</h2>
    <FeeSection label="Open Position Fees" fee={openPosition} onChange={onOpenPositionChange} currency={currency} />
    <FeeSection label="Close Position Fees" fee={closePosition} onChange={onClosePositionChange} currency={currency} />
  </div>
);
