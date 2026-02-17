import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandStepWrapperProps {
  brands: { name: string; domain: string }[];
  currentSlide: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  children: React.ReactNode;
}

export const BrandStepWrapper = ({
  brands,
  currentSlide,
  onPrevSlide,
  onNextSlide,
  children,
}: BrandStepWrapperProps) => {
  const hasMultiple = brands.length > 1;
  const currentBrand = brands[currentSlide];
  const brandLabel = currentBrand?.name || currentBrand?.domain || `Brand ${currentSlide + 1}`;

  return (
    <div className="space-y-4">
      {hasMultiple && (
        <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-tint-blue/50 shadow-widget">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPrevSlide} disabled={currentSlide === 0} className="h-8 w-8 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">
              {brandLabel} ({currentSlide + 1} of {brands.length})
            </span>
            <Button variant="ghost" size="icon" onClick={onNextSlide} disabled={currentSlide >= brands.length - 1} className="h-8 w-8 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-1">
            {brands.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-primary shadow-widget" : "bg-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
