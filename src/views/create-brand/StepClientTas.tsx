import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { StepShell, StepCard, SettingsRow } from "@/views/shared/StepShell";

interface StepClientTasProps {
  allowMultiTas: boolean;
  onAllowMultiTasChange: (v: boolean) => void;
  maxPerClient: string;
  onMaxPerClientChange: (v: string) => void;
  allowClientSelectLeverage: boolean;
  onAllowClientSelectLeverageChange: (v: boolean) => void;
  maxLeverage: string;
  onMaxLeverageChange: (v: string) => void;
}

export const StepClientTas = ({
  allowMultiTas,
  onAllowMultiTasChange,
  maxPerClient,
  onMaxPerClientChange,
  allowClientSelectLeverage,
  onAllowClientSelectLeverageChange,
  maxLeverage,
  onMaxLeverageChange,
}: StepClientTasProps) => {
  const handleAllowLeverageChange = (v: boolean) => {
    onAllowClientSelectLeverageChange(v);
    if (!v) onMaxLeverageChange("1");
  };

  return (
    <StepShell
      icon={BarChart2}
      iconBg="bg-[hsl(38,92%,95%)]"
      iconColor="text-[hsl(38,80%,45%)]"
      title="Client TAS"
      subtitle="Configure trading account settings — multi-account support and leverage limits for clients."
    >
      <div className="space-y-4">
        {/* Toggle row */}
        <StepCard className="px-6 divide-y divide-border/40">
          <SettingsRow
            label="Allow multi TAS"
            description="Clients can open multiple trading accounts"
            border={false}
          >
            <Switch checked={allowMultiTas} onCheckedChange={onAllowMultiTasChange} />
          </SettingsRow>
        </StepCard>

        {/* Max per client */}
        <StepCard className="p-6 space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Max accounts per client
          </Label>
          <Input
            type="number"
            min={1}
            value={maxPerClient}
            onChange={(e) => onMaxPerClientChange(e.target.value)}
            className="rounded-xl border-border/50 focus:border-primary/50 h-10 w-full"
          />
        </StepCard>

        {/* Leverage */}
        <StepCard className="px-6 divide-y divide-border/40">
          <SettingsRow
            label="Allow client to select leverage"
            description="When off, max leverage is fixed at 1"
            border={false}
          >
            <Switch checked={allowClientSelectLeverage} onCheckedChange={handleAllowLeverageChange} />
          </SettingsRow>

          {allowClientSelectLeverage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="py-4"
            >
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                Max leverage
              </Label>
              <Input
                type="number"
                min={1}
                value={maxLeverage}
                onChange={(e) => onMaxLeverageChange(e.target.value)}
                className="rounded-xl border-border/50 focus:border-primary/50 h-10 w-full"
              />
            </motion.div>
          )}
        </StepCard>
      </div>
    </StepShell>
  );
};
