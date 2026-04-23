import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { AppBarNamingScheme, BoxStyle, BrandCaseDesignConfig } from "@/types/brand-experience";
import { Layers } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";

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

const FieldRow = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-6 py-4 border-b border-border/40 last:border-0">
    <div className="min-w-0">
      <p className="text-[14px] font-semibold text-foreground">{label}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
    <div className="shrink-0 w-52">{children}</div>
  </div>
);

export const StepCaseOfDesign = ({ value, onChange }: StepCaseOfDesignProps) => (
  <StepShell
    icon={Layers}
    iconBg="bg-[hsl(350,80%,96%)]"
    iconColor="text-[hsl(350,65%,55%)]"
    title="Case of Design"
    subtitle="One design case can cover several product variations — micro-differences only (app bar naming, box style). The user flow stays the same."
  >
    <div className="space-y-4">
      <StepCard className="px-6 pb-0">
        <FieldRow
          label="App bar naming scheme"
          description="How the app bar title is composed for this brand"
        >
          <Select
            value={value.appBarNamingScheme}
            onValueChange={(v) => onChange({ appBarNamingScheme: v as AppBarNamingScheme })}
          >
            <SelectTrigger className="rounded-xl border-border/50 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APP_BAR_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        {value.appBarNamingScheme === "custom" && (
          <FieldRow label="Custom app bar label" description='e.g. "Trading · EU"'>
            <Input
              className="rounded-xl border-border/50 h-10 text-sm"
              value={value.customAppBarLabel}
              onChange={(e) => onChange({ customAppBarLabel: e.target.value })}
              placeholder="e.g. Trading · EU"
            />
          </FieldRow>
        )}

        <FieldRow label="Box style" description="Card / widget corner style across the interface">
          <Select
            value={value.boxStyle}
            onValueChange={(v) => onChange({ boxStyle: v as BoxStyle })}
          >
            <SelectTrigger className="rounded-xl border-border/50 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOX_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
      </StepCard>

      <StepCard className="p-6 space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Variation notes</Label>
        <p className="text-xs text-muted-foreground">Optional notes for this design case vs other variations of the same product.</p>
        <Textarea
          className="rounded-xl border-border/50 focus:border-primary/50 min-h-[100px] text-sm resize-none mt-1"
          value={value.variationNotes}
          onChange={(e) => onChange({ variationNotes: e.target.value })}
          placeholder="Optional notes for this design case vs other variations of the same product."
        />
      </StepCard>
    </div>
  </StepShell>
);
