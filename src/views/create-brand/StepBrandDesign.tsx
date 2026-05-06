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

const COLOR_FIELDS: { key: keyof BrandDesignTokens; label: string; desc: string; group: string }[] = [
  // ── Layout / Structure ──
  { key: "colorBackground",    label: "Background",      desc: "Page / app background",                      group: "Layout" },
  { key: "colorSurface",       label: "Surface",         desc: "Cards, panels, modals",                      group: "Layout" },
  { key: "colorBorder",        label: "Border",          desc: "Dividers, outlines, input edges",             group: "Layout" },
  // ── Brand ──
  { key: "colorPrimary",       label: "Primary",         desc: "Main CTA — buttons, links, highlights",      group: "Brand" },
  { key: "colorSecondary",     label: "Secondary",       desc: "Supporting / muted brand color",             group: "Brand" },
  { key: "colorAccent",        label: "Accent",          desc: "Focus rings, badges, secondary CTAs",        group: "Brand" },
  // ── Typography ──
  { key: "colorTextPrimary",   label: "Text Primary",    desc: "Body copy and headings",                     group: "Typography" },
  { key: "colorTextSecondary", label: "Text Secondary",  desc: "Captions, placeholders, muted labels",      group: "Typography" },
  // ── Feedback ──
  { key: "colorDanger",        label: "Danger",          desc: "Errors, destructive actions, alerts",        group: "Feedback" },
  { key: "colorSuccess",       label: "Success",         desc: "Confirmations, completions, positive states",group: "Feedback" },
];

const COLOR_GROUPS = ["Layout", "Brand", "Typography", "Feedback"] as const;

const FONT_SLOTS = [
  { n: 1 as const, label: "Font 1 — Primary",  placeholder: "e.g. Inter",            hint: "Main body & UI font" },
  { n: 2 as const, label: "Font 2 — Heading",  placeholder: "e.g. Playfair Display", hint: "Display & headline font" },
  { n: 3 as const, label: "Font 3 — Accent",   placeholder: "e.g. Space Mono",       hint: "Optional accent / mono font" },
  { n: 4 as const, label: "Font 4 — Extra",    placeholder: "Optional",               hint: "Fourth slot for extended typography" },
];

const GROUP_COLORS: Record<string, { dot: string; label: string }> = {
  Layout:     { dot: "bg-slate-400",   label: "text-slate-600" },
  Brand:      { dot: "bg-blue-400",    label: "text-blue-700" },
  Typography: { dot: "bg-violet-400",  label: "text-violet-700" },
  Feedback:   { dot: "bg-rose-400",    label: "text-rose-700" },
};

export const StepBrandDesign = ({ value, onChange }: StepBrandDesignProps) => (
  <StepShell
    icon={Palette}
    iconBg="bg-[hsl(250,80%,96%)]"
    iconColor="text-[hsl(250,65%,58%)]"
    title="Brand Design"
    subtitle="Select Google Fonts for up to four slots and configure all color tokens. Type a few letters to search and preview fonts live."
  >
    <div className="space-y-4">

      {/* ── Fonts ── */}
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

      {/* ── Live palette preview strip ── */}
      <div
        className="rounded-2xl overflow-hidden border border-border/40 flex h-10"
        title="Live palette preview"
      >
        {COLOR_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="flex-1 transition-all duration-300"
            style={{ backgroundColor: (value[key] as string) || "#cccccc" }}
            title={`${label}: ${value[key]}`}
          />
        ))}
      </div>

      {/* ── Colors — grouped ── */}
      <StepCard className="p-6 space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color tokens</p>

        {COLOR_GROUPS.map((group) => {
          const fields = COLOR_FIELDS.filter((f) => f.group === group);
          const { dot, label: labelCls } = GROUP_COLORS[group];
          return (
            <div key={group} className="space-y-1">
              {/* Group header */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <p className={`text-[11px] font-bold uppercase tracking-widest ${labelCls}`}>{group}</p>
              </div>

              {/* Color rows */}
              <div className="space-y-1">
                {fields.map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/30"
                  >
                    {/* Swatch */}
                    <div
                      className="w-8 h-8 rounded-lg border border-border/40 shrink-0 shadow-sm"
                      style={{ backgroundColor: (value[key] as string) || "#cccccc" }}
                    />

                    {/* Label + desc */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-none">{label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>

                    {/* Colour picker + hex input */}
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        id={key}
                        type="color"
                        className="h-9 w-10 cursor-pointer rounded-lg border border-border/50 bg-background p-0.5 shrink-0"
                        value={(value[key] as string) || "#000000"}
                        onChange={(e) => onChange({ [key]: e.target.value })}
                        aria-label={`${label} color`}
                      />
                      <Input
                        className="rounded-xl border-border/50 focus:border-primary/50 font-mono text-sm h-9 w-28"
                        value={value[key] as string}
                        onChange={(e) => onChange({ [key]: e.target.value })}
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </StepCard>

    </div>
  </StepShell>
);
