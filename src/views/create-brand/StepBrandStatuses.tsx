import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AUTO_REJECT_STATUS_INFO,
  REGISTRATION_STATUS_CANDIDATES,
  type BrandStatusAutoConfig,
  type BrandStatusCreationMode,
} from "@/types/brand-experience";
import { Checkbox } from "@/components/ui/checkbox";

interface StepBrandStatusesProps {
  auto: BrandStatusAutoConfig;
  onAutoChange: (patch: Partial<BrandStatusAutoConfig>) => void;
  regSelectableIds: string[];
  onRegSelectableIdsChange: (ids: string[]) => void;
}

export const StepBrandStatuses = ({
  auto,
  onAutoChange,
  regSelectableIds,
  onRegSelectableIdsChange,
}: StepBrandStatusesProps) => {
  const toggleReg = (id: string, checked: boolean) => {
    if (checked) onRegSelectableIdsChange([...new Set([...regSelectableIds, id])]);
    else onRegSelectableIdsChange(regSelectableIds.filter((x) => x !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Brand statuses</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure automatic status routing and which registration statuses are allowed. Auto-rejecting outcomes are fixed below.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-4">
        <h3 className="text-sm font-semibold text-foreground">Auto</h3>
        <p className="text-xs text-muted-foreground">Transfer → auto status</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["transferAutoBrand", "Brand"],
              ["transferAutoDepartment", "Department"],
              ["transferAutoDesk", "Desk"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2">
              <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                {label}
              </Label>
              <Switch
                id={key}
                checked={auto[key]}
                onCheckedChange={(v) => onAutoChange({ [key]: v })}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2">
          <Label htmlFor="allocPull" className="text-sm font-normal cursor-pointer">
            Alloc / pull
          </Label>
          <Switch id="allocPull" checked={auto.allocPull} onCheckedChange={(v) => onAutoChange({ allocPull: v })} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Creation</Label>
          <RadioGroup
            value={auto.creation}
            onValueChange={(v) => onAutoChange({ creation: v as BrandStatusCreationMode })}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="off" id="creation-off" />
              <Label htmlFor="creation-off" className="font-normal cursor-pointer">
                Off
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="creation-yes" />
              <Label htmlFor="creation-yes" className="font-normal cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mandatory_yes" id="creation-mandatory" />
              <Label htmlFor="creation-mandatory" className="font-normal cursor-pointer">
                Mandatory yes
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Transform (client → lead on approved)</span> is mandatory in the product and is not configurable here.
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border/50 bg-card/50 p-4">
        <h3 className="text-sm font-semibold text-foreground">Reg — allowed statuses</h3>
        <p className="text-xs text-muted-foreground">
          Select statuses that are allowed for registration. These exclude the auto-rejecting outcomes listed below.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {REGISTRATION_STATUS_CANDIDATES.map((s) => (
            <div key={s.id} className="flex items-center space-x-2">
              <Checkbox
                id={`reg-${s.id}`}
                checked={regSelectableIds.includes(s.id)}
                onCheckedChange={(c) => toggleReg(s.id, c === true)}
              />
              <Label htmlFor={`reg-${s.id}`} className="text-sm font-normal cursor-pointer">
                {s.label}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border/50 bg-muted/20 p-4">
        <h3 className="text-sm font-semibold text-foreground">Auto-rejecting statuses</h3>
        <p className="text-xs text-muted-foreground">These are always treated as rejections; they are not part of the selectable registration list.</p>
        <ul className="space-y-2">
          {AUTO_REJECT_STATUS_INFO.map((item) => (
            <li key={item.id} className="rounded-md border border-border/40 bg-background/80 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="text-muted-foreground"> — {item.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
