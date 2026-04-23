import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, Info } from "lucide-react";
import {
  AUTO_REJECT_STATUS_INFO,
  REGISTRATION_STATUS_CANDIDATES,
  type BrandStatusAutoConfig,
  type BrandStatusCreationMode,
} from "@/types/brand-experience";
import { StepShell, StepCard, SettingsRow } from "@/views/shared/StepShell";

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
    <StepShell
      icon={Activity}
      iconBg="bg-[hsl(217,91%,96%)]"
      iconColor="text-[hsl(217,80%,55%)]"
      title="Brand Statuses"
      subtitle="Configure automatic status routing and which registration statuses are available. Auto-rejecting outcomes are fixed and cannot be changed."
    >
      <div className="space-y-4">
        {/* Auto routing */}
        <StepCard className="px-6 pb-0">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground pt-6 pb-3">
            Auto routing
          </p>
          <div className="divide-y divide-border/40">
            {(
              [
                ["transferAutoBrand", "Brand", "Automatically set status on brand transfer"],
                ["transferAutoDepartment", "Department", "Automatically set status on department transfer"],
                ["transferAutoDesk", "Desk", "Automatically set status on desk transfer"],
                ["allocPull", "Alloc / Pull", "Automatic allocation and pull operations"],
              ] as const
            ).map(([key, label, desc]) => (
              <SettingsRow key={key} label={label} description={desc} border={false}>
                <Switch
                  id={key}
                  checked={auto[key]}
                  onCheckedChange={(v) => onAutoChange({ [key]: v })}
                />
              </SettingsRow>
            ))}

            <div className="py-4">
              <p className="text-[14px] font-semibold text-foreground mb-1">Creation mode</p>
              <p className="text-xs text-muted-foreground mb-3">Auto status assignment on new lead creation</p>
              <RadioGroup
                value={auto.creation}
                onValueChange={(v) => onAutoChange({ creation: v as BrandStatusCreationMode })}
                className="flex flex-wrap gap-4"
              >
                {(["off", "yes", "mandatory_yes"] as const).map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`creation-${val}`} />
                    <Label htmlFor={`creation-${val}`} className="font-normal cursor-pointer capitalize text-sm">
                      {val === "mandatory_yes" ? "Mandatory yes" : val.charAt(0).toUpperCase() + val.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="py-4 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Transform</span> (client → lead on approved) is mandatory in the product and is not configurable here.
              </p>
            </div>
          </div>
        </StepCard>

        {/* Reg allowed statuses */}
        <StepCard className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Registration — allowed statuses</p>
            <p className="text-xs text-muted-foreground">Select statuses available during registration (auto-rejecting outcomes are excluded).</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {REGISTRATION_STATUS_CANDIDATES.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/40 px-3 py-2.5 bg-background/60">
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
        </StepCard>

        {/* Auto-rejecting (read-only) */}
        <StepCard className="p-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Auto-rejecting statuses <span className="font-normal normal-case tracking-normal">(fixed, not configurable)</span>
          </p>
          <ul className="space-y-2">
            {AUTO_REJECT_STATUS_INFO.map((item) => (
              <li key={item.id} className="rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 text-sm">
                <span className="font-semibold text-foreground">{item.title}</span>
                <span className="text-muted-foreground"> — {item.description}</span>
              </li>
            ))}
          </ul>
        </StepCard>
      </div>
    </StepShell>
  );
};
