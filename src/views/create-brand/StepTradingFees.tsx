import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign, AlertTriangle } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";
import type { UseCase } from "@/types/brand-config-per-brand";

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
  useCase?: UseCase | null;
}

const FeeSection = ({
  label,
  fee,
  onChange,
  currency,
  disabled = false,
}: {
  label: string;
  fee: FeeConfig;
  onChange: (v: Partial<FeeConfig>) => void;
  currency: string;
  disabled?: boolean;
}) => (
  <StepCard className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-[14px] font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Fee charged on this position event</p>
      </div>
      <Switch
        checked={fee.enabled}
        onCheckedChange={(v) => onChange({ enabled: v })}
        disabled={disabled}
      />
    </div>

    {fee.enabled && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.28 }}
        className="space-y-4 pt-4 border-t border-border/40"
      >
        {/* Type selector */}
        <div className="flex gap-2">
          {(["fixed", "percentage"] as const).map((type) => (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ type })}
              className={[
                "flex-1 rounded-xl border-2 py-2.5 px-4 text-sm font-semibold transition-all duration-200",
                fee.type === type
                  ? "border-primary/60 bg-primary/5 text-primary"
                  : "border-border/40 bg-white text-muted-foreground hover:border-border/80",
                disabled ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {type === "fixed" ? "Fixed Amount" : "Percentage"}
            </button>
          ))}
        </div>

        {/* Value input */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fee value</Label>
          <div className="flex items-center gap-2 w-full">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={fee.value}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder="0.00"
              disabled={disabled}
              className="rounded-xl border-border/50 focus:border-primary/50 h-10 w-full"
            />
            <span className="text-sm font-semibold text-muted-foreground w-10 text-center shrink-0">
              {fee.type === "percentage" ? "%" : currency}
            </span>
          </div>
        </div>
      </motion.div>
    )}
  </StepCard>
);

export const StepTradingFees = ({
  openPosition,
  onOpenPositionChange,
  closePosition,
  onClosePositionChange,
  currency,
  useCase,
}: StepTradingFeesProps) => {
  const isBrandRecovery = useCase === "brand_recovery";

  return (
    <StepShell
      icon={DollarSign}
      iconBg="bg-[hsl(160,60%,95%)]"
      iconColor="text-[hsl(160,65%,38%)]"
      title="Trading Fees"
      subtitle="Configure fees applied when clients open or close trading positions on this brand."
    >
      <div className="space-y-4">
        {/* Brand Recovery lock banner */}
        {isBrandRecovery && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-800 mb-0.5">Brand Recovery Mode — Fees Locked</p>
              <p className="text-xs text-rose-700 leading-relaxed">
                Trading Fees are not applicable in Brand Recovery mode. No internal dealing or
                position trading is available in this use case.
              </p>
            </div>
          </motion.div>
        )}

        {/* Fee sections with disabled state for Brand Recovery */}
        <div className={isBrandRecovery ? "relative" : undefined}>
          {isBrandRecovery && (
            <div
              className="absolute inset-0 z-10 rounded-xl cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.65)" }}
              title="Locked in Brand Recovery mode"
            />
          )}
          <div className="space-y-4">
            <FeeSection
              label="Open Position Fee"
              fee={openPosition}
              onChange={onOpenPositionChange}
              currency={currency}
              disabled={isBrandRecovery}
            />
            <FeeSection
              label="Close Position Fee"
              fee={closePosition}
              onChange={onClosePositionChange}
              currency={currency}
              disabled={isBrandRecovery}
            />
          </div>
        </div>
      </div>
    </StepShell>
  );
};
