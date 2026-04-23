import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Globe } from "lucide-react";
import type { BrandEntry } from "@/controllers/useCreateBrand";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepBrandsProps {
  brands: BrandEntry[];
  onAddBrand: () => void;
  onRemoveBrand: (i: number) => void;
  onUpdateBrand: (i: number, field: keyof BrandEntry, value: string) => void;
}

export const StepBrands = ({ brands, onAddBrand, onRemoveBrand, onUpdateBrand }: StepBrandsProps) => (
  <StepShell
    icon={Globe}
    iconBg="bg-[hsl(160,60%,95%)]"
    iconColor="text-[hsl(160,65%,38%)]"
    title="Brands"
    subtitle="Add each brand with its name and domain. A substitute domain mirrors your main domain automatically when the main is offline."
  >
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
