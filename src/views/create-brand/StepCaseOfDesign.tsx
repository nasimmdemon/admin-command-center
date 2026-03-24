import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { AppBarNamingScheme, BoxStyle, BrandCaseDesignConfig } from "@/types/brand-experience";

interface StepCaseOfDesignProps {
  value: BrandCaseDesignConfig;
  onChange: (patch: Partial<BrandCaseDesignConfig>) => void;
}

const APP_BAR_OPTIONS: { value: AppBarNamingScheme; label: string }[] = [
  { value: "brand_first", label: "Brand name first" },
  { value: "desk_first", label: "Desk / region first" },
  { value: "minimal", label: "Minimal (no extra title)" },
  { value: "custom", label: "Custom label" },
];

const BOX_OPTIONS: { value: BoxStyle; label: string }[] = [
  { value: "rounded", label: "Rounded" },
  { value: "sharp", label: "Sharp corners" },
  { value: "soft", label: "Soft / elevated" },
  { value: "outline", label: "Outline" },
];

export const StepCaseOfDesign = ({ value, onChange }: StepCaseOfDesignProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Case of design</h2>
      <p className="text-sm text-muted-foreground mt-1">
        One design case can cover several product variations: micro-differences only (e.g. app bar naming, box style). The user flow stays the same.
      </p>
    </div>

    <div className="space-y-2">
      <Label>App bar naming scheme</Label>
      <Select value={value.appBarNamingScheme} onValueChange={(v) => onChange({ appBarNamingScheme: v as AppBarNamingScheme })}>
        <SelectTrigger className="rounded-xl border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {APP_BAR_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {value.appBarNamingScheme === "custom" && (
      <div className="space-y-2">
        <Label>Custom app bar label</Label>
        <Input
          className="rounded-xl border-border/50"
          value={value.customAppBarLabel}
          onChange={(e) => onChange({ customAppBarLabel: e.target.value })}
          placeholder="e.g. Trading · EU"
        />
      </div>
    )}

    <div className="space-y-2">
      <Label>Box style</Label>
      <Select value={value.boxStyle} onValueChange={(v) => onChange({ boxStyle: v as BoxStyle })}>
        <SelectTrigger className="rounded-xl border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BOX_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Variation notes</Label>
      <Textarea
        className="rounded-xl border-border/50 min-h-[100px]"
        value={value.variationNotes}
        onChange={(e) => onChange({ variationNotes: e.target.value })}
        placeholder="Optional notes for this design case vs other variations of the same product."
      />
    </div>
  </div>
);
