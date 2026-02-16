import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">CLIENT TAS</h2>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label>ALLOW MULTI TAS</Label>
        <Switch checked={allowMultiTas} onCheckedChange={onAllowMultiTasChange} />
      </div>
      <div className="space-y-2">
        <Label>MAX PER CLIENT</Label>
        <Input type="number" min={1} value={maxPerClient} onChange={(e) => onMaxPerClientChange(e.target.value)} />
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Leverage</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label>Allow client to select Leverage</Label>
            <p className="text-xs text-muted-foreground mt-0.5">When off, max leverage is fixed at 1</p>
          </div>
          <Switch checked={allowClientSelectLeverage} onCheckedChange={handleAllowLeverageChange} />
        </div>
        <div className="space-y-2">
          <Label>Max Leverage</Label>
          <Input
            type="number"
            min={1}
            value={allowClientSelectLeverage ? maxLeverage : "1"}
            onChange={(e) => onMaxLeverageChange(e.target.value)}
            disabled={!allowClientSelectLeverage}
            className={!allowClientSelectLeverage ? "opacity-60 cursor-not-allowed" : ""}
          />
          {!allowClientSelectLeverage && <p className="text-xs text-muted-foreground">Fixed at 1 when client cannot select leverage</p>}
        </div>
      </div>
    </div>
  );
};
