import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Globe, AlertTriangle, X, RotateCcw, Check } from "lucide-react";
import type { BrandEntry, ConfigMismatch } from "@/controllers/useCreateBrand";
import { getMismatchResetValues } from "@/utils/config-mismatch";
import type { UseCase } from "@/types/brand-config-per-brand";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepBrandsProps {
  brands: BrandEntry[];
  onAddBrand: () => void;
  onRemoveBrand: (i: number) => void;
  onUpdateBrand: (i: number, field: keyof BrandEntry, value: string) => void;
  /** Called when Enter is pressed on the last input to advance to the next step */
  onNext?: () => void;
  /** Mismatch warnings from config copy (same_db / same_config mode) */
  configMismatchWarnings?: ConfigMismatch[];
  /** Use case, needed to compute reset values */
  targetUseCase?: UseCase | null;
  /** Keep source values — just dismiss the banner */
  onKeepSourceValues?: () => void;
  /** Reset mismatched fields to use-case defaults */
  onResetMismatchedFields?: (overrides: Record<string, unknown>) => void;
  /** Source brand name for the banner heading */
  sourceBrandName?: string;
}

export const StepBrands = ({
  brands,
  onAddBrand,
  onRemoveBrand,
  onUpdateBrand,
  onNext,
  configMismatchWarnings,
  targetUseCase,
  onKeepSourceValues,
  onResetMismatchedFields,
  sourceBrandName,
}: StepBrandsProps) => {
  const hasWarnings = (configMismatchWarnings?.length ?? 0) > 0;

  const handleReset = () => {
    if (!configMismatchWarnings || !targetUseCase || !onResetMismatchedFields) return;
    const overrides: Record<string, unknown> = {};
    for (const w of configMismatchWarnings) {
      Object.assign(overrides, getMismatchResetValues(w, targetUseCase));
    }
    onResetMismatchedFields(overrides);
  };

  return (
  <StepShell
    icon={Globe}
    iconBg="bg-[hsl(160,60%,95%)]"
    iconColor="text-[hsl(160,65%,38%)]"
    title="Brands"
    subtitle="Add each brand with its name and domain. A substitute domain mirrors your main domain automatically when the main is offline."
  >
    {/* ── Config mismatch warning banner ── */}
    <AnimatePresence>
      {hasWarnings && (
        <motion.div
          key="mismatch-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-4 mb-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 leading-snug">
                  Config copied from{sourceBrandName ? ` "${sourceBrandName}"` : " source brand"} — mismatches detected
                </p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  The following fields from the source brand conflict with the selected use case.
                  You can keep the source values or reset them to safe defaults.
                </p>
              </div>
            </div>
            <button
              onClick={onKeepSourceValues}
              className="shrink-0 p-1 rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mismatch list */}
          <ul className="space-y-2">
            {configMismatchWarnings!.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-amber-800">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>
                  <strong className="font-semibold">{w.field}:</strong> {w.message}
                </span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="rounded-xl border-amber-300 text-amber-800 hover:bg-amber-100 hover:border-amber-400 gap-1.5 h-8 px-3 text-xs"
            >
              <RotateCcw className="w-3 h-3" /> Reset to use-case defaults
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onKeepSourceValues}
              className="rounded-xl text-amber-700 hover:bg-amber-100 gap-1.5 h-8 px-3 text-xs"
            >
              <Check className="w-3 h-3" /> Keep source values
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <StepCard className="p-6 space-y-5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Brand entries</p>

      {brands.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border/40 bg-background/60 p-4 space-y-3"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Brand {i + 1}
            </span>
            {brands.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveBrand(i)}
                className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/8 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
              <Input
                placeholder="Brand name"
                value={b.name}
                onChange={(e) => onUpdateBrand(i, "name", e.target.value)}
                className="rounded-xl border-border/50 focus:border-primary/50 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Domain</Label>
              <Input
                placeholder="domain.com"
                value={b.domain}
                onChange={(e) => onUpdateBrand(i, "domain", e.target.value)}
                className="rounded-xl border-border/50 focus:border-primary/50 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Substitute domain</Label>
              <Input
                placeholder="substitute.domain.com"
                value={b.substituteDomain}
                onChange={(e) => onUpdateBrand(i, "substituteDomain", e.target.value)}
                className="rounded-xl border-border/50 focus:border-primary/50 h-10"
                onKeyDown={i === brands.length - 1 ? (e) => { if (e.key === "Enter") { e.preventDefault(); onNext?.(); } } : undefined}
              />
            </div>
          </div>
        </motion.div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={onAddBrand}
        className="rounded-xl border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/4 gap-1.5 h-10 px-4"
      >
        <Plus className="w-4 h-4" /> Add Brand
      </Button>
    </StepCard>
  </StepShell>
  );
};
