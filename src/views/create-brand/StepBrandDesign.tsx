import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { BrandDesignTokens } from "@/types/brand-experience";

interface StepBrandDesignProps {
  value: BrandDesignTokens;
  onChange: (patch: Partial<BrandDesignTokens>) => void;
}

const COLOR_FIELDS: { key: keyof BrandDesignTokens; label: string }[] = [
  { key: "colorPrimary", label: "Primary" },
  { key: "colorSecondary", label: "Secondary" },
  { key: "colorAccent", label: "Accent" },
  { key: "colorBackground", label: "Background" },
  { key: "colorSurface", label: "Surface" },
];

export const StepBrandDesign = ({ value, onChange }: StepBrandDesignProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Brand design</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Fonts (four slots) and core colors. Use web font family names or stack (e.g. Inter, system-ui).
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {([1, 2, 3, 4] as const).map((n) => {
        const key = `fontSlot${n}` as keyof BrandDesignTokens;
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>Font {n}</Label>
            <Input
              id={key}
              className="rounded-xl border-border/50"
              value={value[key] as string}
              onChange={(e) => onChange({ [key]: e.target.value })}
              placeholder={n === 1 ? "e.g. Inter" : "Optional"}
            />
          </div>
        );
      })}
    </div>

    <div className="space-y-3">
      <Label className="text-sm font-semibold">Colors</Label>
      <div className="grid gap-4 sm:grid-cols-2">
        {COLOR_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Label htmlFor={key} className="sm:w-28 shrink-0">
              {label}
            </Label>
            <div className="flex flex-1 gap-2 items-center">
              <input
                id={key}
                type="color"
                className="h-10 w-14 cursor-pointer rounded-md border border-border/50 bg-background p-1"
                value={value[key]}
                onChange={(e) => onChange({ [key]: e.target.value })}
                aria-label={`${label} color`}
              />
              <Input
                className="rounded-xl border-border/50 font-mono text-sm flex-1"
                value={value[key]}
                onChange={(e) => onChange({ [key]: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
