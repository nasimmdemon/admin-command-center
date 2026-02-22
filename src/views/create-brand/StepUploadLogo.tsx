import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import type { BrandEntry } from "@/controllers/useCreateBrand";

interface StepUploadLogoProps {
  brands: BrandEntry[];
  brandIndex?: number;
  logoUrl: string;
  onLogoChange: (url: string) => void;
}

export const StepUploadLogo = ({ brands, brandIndex = 0, logoUrl, onLogoChange }: StepUploadLogoProps) => {
  const b = brands[brandIndex] || brands[0];
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onLogoChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Upload Logo</h2>
      <p className="text-sm text-muted-foreground">Your logo will appear in email templates (client signup, lead registration, credential changes).</p>
      <div className="space-y-2">
        <Label>Your Logo On {b?.name || `Brand ${brandIndex + 1}`}</Label>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-tint-blue/30 transition-all duration-300 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {logoUrl ? (
            <div className="relative inline-block">
              <img src={logoUrl} alt="Brand logo" className="max-h-24 mx-auto object-contain" />
              <Button
                variant="outline"
                size="icon"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                onClick={(e) => { e.stopPropagation(); onLogoChange(""); }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <Button variant="outline" size="sm" className="mt-3" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">PNG, SVG, JPG (max 2MB)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
