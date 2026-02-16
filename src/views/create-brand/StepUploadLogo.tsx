import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { BrandEntry } from "@/controllers/useCreateBrand";

interface StepUploadLogoProps {
  brands: BrandEntry[];
  brandIndex?: number;
}

export const StepUploadLogo = ({ brands, brandIndex = 0 }: StepUploadLogoProps) => {
  const b = brands[brandIndex] || brands[0];
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Upload Logo</h2>
      <div className="space-y-2">
        <Label>Your Logo On {b?.name || `Brand ${brandIndex + 1}`}</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <Button variant="outline" size="sm" className="mt-3">Upload Logo</Button>
          <p className="text-xs text-muted-foreground mt-2">PNG, SVG, JPG (max 2MB)</p>
        </div>
      </div>
    </div>
  );
};
