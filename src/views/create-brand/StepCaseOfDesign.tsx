import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { AppBarNamingScheme, BoxStyle, BrandCaseDesignConfig } from "@/types/brand-experience";
import type { UseCase } from "@/types/brand-config-per-brand";
import { Layers, Monitor } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepCaseOfDesignProps {
  value: BrandCaseDesignConfig;
  onChange: (patch: Partial<BrandCaseDesignConfig>) => void;
  useCase?: UseCase | null;
  uiComponentSet?: string;
  onUiComponentSetChange?: (v: string) => void;
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

/** Options for regulated brands: full brand identity sets */
const REGULATED_UI_OPTIONS = [
  {
    id: "brand_1",
    label: "Brand 1",
    desc: "Primary institutional layout — compliance-forward, formal typography.",
  },
  {
    id: "brand_2",
    label: "Brand 2",
    desc: "Professional dark variant — high-contrast, trust-focused design.",
  },
  {
    id: "brand_3",
    label: "Brand 3",
    desc: "Clean minimalist set — neutral palette, high legibility.",
  },
];

/** Options for unregulated brands: flexible layout options */
const UNREGULATED_UI_OPTIONS = [
  {
    id: "option_1",
    label: "Option 1",
    desc: "Vibrant consumer layout — dynamic, colorful, engaging.",
  },
  {
    id: "option_2",
    label: "Option 2",
    desc: "Compact modern layout — sleek, dark-mode friendly.",
  },
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

function UiComponentSetSelector({
  useCase,
  value,
  onChange,
}: {
  useCase: UseCase | null | undefined;
  value: string;
  onChange: (v: string) => void;
}) {
  if (!useCase || useCase === "brand_recovery") return null;

  const options = useCase === "regulated" ? REGULATED_UI_OPTIONS : UNREGULATED_UI_OPTIONS;
  const label =
    useCase === "regulated"
      ? "UI Component Set (Brand 1 / 2 / 3)"
      : "UI Component Set (Option 1 / 2)";
  const description =
    useCase === "regulated"
      ? "Select the visual identity set for Client, WebTrader, AuthGate, and Admin views across this brand."
      : "Select the layout option for Client and applicable ecosystem components.";

  return (
    <StepCard className="p-6 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5" /> UI Component Set
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={[
                "rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer",
                selected
                  ? "border-primary bg-primary/5 shadow-[0_0_0_3px_hsl(217,91%,90%)]"
                  : "border-border/40 hover:border-border/80 bg-background",
              ].join(" ")}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-foreground">{opt.label}</p>
                <div
                  className={[
                    "w-3.5 h-3.5 rounded-full border-2 transition-all",
                    selected ? "border-primary bg-primary" : "border-muted-foreground/30",
                  ].join(" ")}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}

export const StepCaseOfDesign = ({
  value,
  onChange,
  useCase,
  uiComponentSet = "",
  onUiComponentSetChange,
}: StepCaseOfDesignProps) => (
  <StepShell
    icon={Layers}
    iconBg="bg-[hsl(350,80%,96%)]"
    iconColor="text-[hsl(350,65%,55%)]"
    title="Case of Design"
    subtitle="One design case can cover several product variations — micro-differences only (app bar naming, box style). The user flow stays the same."
  >
    <div className="space-y-4">
      {/* UI Component Set selector (use-case driven) */}
      <UiComponentSetSelector
        useCase={useCase}
        value={uiComponentSet}
        onChange={onUiComponentSetChange ?? (() => {})}
      />

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
