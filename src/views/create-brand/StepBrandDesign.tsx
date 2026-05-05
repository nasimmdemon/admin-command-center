import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { BrandDesignTokens } from "@/types/brand-experience";
import { Palette } from "lucide-react";
import { StepShell, StepCard } from "@/views/shared/StepShell";
import { GoogleFontCombobox } from "@/components/GoogleFontCombobox";

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

const FONT_SLOTS = [
  { n: 1 as const, label: "Font 1 — Primary", placeholder: "e.g. Inter", hint: "Main body & UI font" },
  { n: 2 as const, label: "Font 2 — Heading", placeholder: "e.g. Playfair Display", hint: "Display & headline font" },
  { n: 3 as const, label: "Font 3 — Accent", placeholder: "e.g. Space Mono", hint: "Optional accent / mono font" },
  { n: 4 as const, label: "Font 4 — Extra", placeholder: "Optional", hint: "Fourth slot for extended typography" },
];

export const StepBrandDesign = ({ value, onChange }: StepBrandDesignProps) => (
  <StepShell
    icon={Palette}
    iconBg="bg-[hsl(250,80%,96%)]"
    iconColor="text-[hsl(250,65%,58%)]"
    title="Brand Design"
    subtitle="Select Google Fonts for up to four slots and configure core color tokens. Type a few letters to search and preview fonts live."
  >
    <div className="space-y-4">
      {/* Fonts */}
      <StepCard className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Font slots</p>
          <a
            href="https://fonts.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Browse Google Fonts ↗
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {FONT_SLOTS.map(({ n, label, placeholder, hint }) => {
            const key = `fontSlot${n}` as keyof BrandDesignTokens;
            return (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-xs font-semibold text-foreground/80">
                  {label}
                </Label>
                <p className="text-[11px] text-muted-foreground -mt-0.5">{hint}</p>
                <GoogleFontCombobox
                  id={key}
                  value={value[key] as string}
                  onChange={(v) => onChange({ [key]: v })}
                  placeholder={placeholder}
                />
                {/* Live preview row */}
                {(value[key] as string) && (
                  <p
                    className="text-[13px] text-foreground/80 mt-1 px-1 truncate"
                    style={{ fontFamily: `"${value[key]}", sans-serif` }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                )}
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
