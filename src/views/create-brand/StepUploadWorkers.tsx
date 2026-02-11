import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { BrandEntry } from "@/controllers/useCreateBrand";

interface StepUploadWorkersProps {
  brands: BrandEntry[];
}

export const StepUploadWorkers = ({ brands }: StepUploadWorkersProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Upload Workers</h2>
    {brands.slice(0, 2).map((b, i) => (
      <div key={i} className="space-y-2">
        <Label>Your Workers On {b.name || `Brand ${i + 1}`} Accounts</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
          <Button variant="outline" size="sm" className="mt-3">Upload Users</Button>
        </div>
      </div>
    ))}
  </div>
);
