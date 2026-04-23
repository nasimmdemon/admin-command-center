import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import type { BrandEntry } from "@/controllers/useCreateBrand";
import { StepShell, StepCard } from "@/views/shared/StepShell";

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
    <StepShell
      icon={ImageIcon}
      iconBg="bg-[hsl(350,80%,96%)]"
      iconColor="text-[hsl(350,65%,55%)]"
      title="Upload Logo"
      subtitle="Your logo will appear in email templates (client signup, lead registration, credential changes)."
    >
      <StepCard className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Logo for {b?.name || `Brand ${brandIndex + 1}`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onClick={() => inputRef.current?.click()}
          className="relative border-2 border-dashed border-border/50 rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-primary/2 transition-all duration-300 cursor-pointer group"
        >
          {logoUrl ? (
            <div className="relative inline-block">
              <img src={logoUrl} alt="Brand logo" className="max-h-28 mx-auto object-contain rounded-lg" />
              <Button
                variant="outline"
                size="icon"
                className="absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full bg-white border border-destructive/30 text-destructive hover:bg-destructive/10 shadow-sm"
                onClick={(e) => { e.stopPropagation(); onLogoChange(""); }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3">Click to replace</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/8 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Drop your logo here</p>
              <p className="text-xs text-muted-foreground mb-4">PNG, SVG, JPG — max 2 MB</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-primary/40 text-primary hover:bg-primary/5"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                Browse files
              </Button>
            </>
          )}
        </div>
      </StepCard>
    </StepShell>
  );
};
