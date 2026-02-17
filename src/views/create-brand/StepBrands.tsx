import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { BrandEntry } from "@/controllers/useCreateBrand";

interface StepBrandsProps {
  brands: BrandEntry[];
  onAddBrand: () => void;
  onRemoveBrand: (i: number) => void;
  onUpdateBrand: (i: number, field: "name" | "domain", value: string) => void;
}

export const StepBrands = ({ brands, onAddBrand, onRemoveBrand, onUpdateBrand }: StepBrandsProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Brands</h2>
    <div className="space-y-3">
      <Label className="text-sm font-medium">Brands</Label>
      <p className="text-xs text-muted-foreground">Add each brand with its name and domain</p>
      {brands.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-3 items-end"
        >
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Brand {i + 1} Name</Label>
            <Input placeholder="Brand name" value={b.name} onChange={(e) => onUpdateBrand(i, "name", e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Domain</Label>
            <Input placeholder="domain.com" value={b.domain} onChange={(e) => onUpdateBrand(i, "domain", e.target.value)} />
          </div>
          {brands.length > 1 && (
            <Button variant="ghost" size="icon" onClick={() => onRemoveBrand(i)} className="text-destructive flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      ))}
      <Button variant="outline" size="sm" onClick={onAddBrand} className="mt-2 rounded-xl">
        <Plus className="w-4 h-4 mr-1" /> Add Brand
      </Button>
    </div>
  </div>
);
