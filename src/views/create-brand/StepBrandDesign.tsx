import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { BrandDesignTokens } from "@/types/brand-experience";
import { Palette } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepBrandDesignProps {
  value: BrandDesignTokens;
  onChange: (patch: Partial<BrandDesignTokens>) => void;
}

const COLOR_FIELDS: { key: keyof BrandDesignTokens; label: string; desc: string }[] = [
  { key: "colorPrimary", label: "Primary", desc: "Main brand color — buttons, links, highlights" },
  { key: "colorSecondary", label: "Secondary", desc: "Supporting accent color" },
  { key: "colorAccent", label: "Accent", desc: "Call-to-action and focus states" },
  { key: "colorBackground", label: "Background", desc: "Page background" },
  { key: "colorSurface", label: "Surface", desc: "Card and panel surfaces" },
];

export const StepBrandDesign = ({ value, onChange }: StepBrandDesignProps) => (
  <StepShell
    icon={Palette}
    iconBg="bg-[hsl(250,80%,96%)]"
    iconColor="text-[hsl(250,65%,58%)]"
    title="Brand Design"
    subtitle="Font slots (up to four) and core color tokens. Use web font family names or stacks (e.g. Inter, system-ui)."
  >
    <div className="space-y-4">
      {/* Fonts */}
      <StepCard className="p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Font slots</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {([1, 2, 3, 4] as const).map((n) => {
            const key = `fontSlot${n}` as keyof BrandDesignTokens;
            return (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-xs font-semibold text-muted-foreground">Font {n}</Label>
                <Input
                  id={key}
                  className="rounded-xl border-border/50 focus:border-primary/50 h-10 text-sm"
                  value={value[key] as string}
                  onChange={(e) => onChange({ [key]: e.target.value })}
                  placeholder={n === 1 ? "e.g. Inter" : "Optional"}
                />
              </div>
            );
          })}
        </div>
      </StepCard>

      {/* Colors */}
      <StepCard className="p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color tokens</p>
        <div className="space-y-4">
          {COLOR_FIELDS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center gap-4 py-2 border-b border-border/30 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  id={key}
                  type="color"
                  className="h-9 w-10 cursor-pointer rounded-lg border border-border/50 bg-background p-0.5 shrink-0"
                  value={value[key]}
                  onChange={(e) => onChange({ [key]: e.target.value })}
                  aria-label={`${label} color`}
                />
                <Input
                  className="rounded-xl border-border/50 focus:border-primary/50 font-mono text-sm h-9 w-28"
                  value={value[key]}
                  onChange={(e) => onChange({ [key]: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </StepCard>
    </div>
  </StepShell>
);
