import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface StepClientTasProps {
  allowMultiTas: boolean;
  onAllowMultiTasChange: (v: boolean) => void;
  maxPerClient: string;
  onMaxPerClientChange: (v: string) => void;
  maxLeverage: string;
  onMaxLeverageChange: (v: string) => void;
}

export const StepClientTas = ({ allowMultiTas, onAllowMultiTasChange, maxPerClient, onMaxPerClientChange, maxLeverage, onMaxLeverageChange }: StepClientTasProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">CLIENT TAS</h2>
    <div className="flex items-center justify-between rounded-lg border p-4">
      <Label>ALLOW MULTI TAS</Label>
      <Switch checked={allowMultiTas} onCheckedChange={onAllowMultiTasChange} />
    </div>
    <div className="space-y-2">
      <Label>MAX PER CLIENT</Label>
      <Input type="number" value={maxPerClient} onChange={(e) => onMaxPerClientChange(e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>MAX LEVERAGE</Label>
      <Input type="number" value={maxLeverage} onChange={(e) => onMaxLeverageChange(e.target.value)} />
    </div>
  </div>
);
