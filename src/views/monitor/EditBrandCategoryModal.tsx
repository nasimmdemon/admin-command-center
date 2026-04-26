import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Pencil } from "lucide-react";
import { EDIT_CATEGORY_OPTIONS } from "@/models/brand-wizard-categories";
import { ROUTES } from "@/models/routes";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";

interface EditBrandCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: MonitorClient;
  brand: ClientBrand;
}

const grouped = EDIT_CATEGORY_OPTIONS.reduce(
  (acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
  },
  {} as Record<string, typeof EDIT_CATEGORY_OPTIONS>
);

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
  "Brand Scopes": {
    bg: "bg-primary/5",
    text: "text-primary",
    border: "border-primary/20",
    hoverBg: "hover:bg-primary/10 hover:border-primary/40",
  },
  "Providers": {
    bg: "bg-emerald-500/5",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    hoverBg: "hover:bg-emerald-500/10 hover:border-emerald-500/40",
  },
  "Other": {
    bg: "bg-amber-500/5",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    hoverBg: "hover:bg-amber-500/10 hover:border-amber-500/40",
  },
};

export const EditBrandCategoryModal = ({
  open,
  onOpenChange,
  client,
  brand,
}: EditBrandCategoryModalProps) => {
  const navigate = useNavigate();

  const handleSelect = (firstStep: number) => {
    onOpenChange(false);
    navigate(ROUTES.CREATE_BRAND, {
      state: {
        clientId: client.id,
        clientName: client.name,
        editBrand: { id: brand.id, name: brand.name, domain: brand.domain },
        startStep: firstStep,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-border/40 shadow-card p-0 overflow-hidden">
        {/* Brand identity header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: "linear-gradient(135deg, hsl(217,91%,97%) 0%, hsl(250,80%,97%) 100%)",
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-soft border border-border/30 flex items-center justify-center flex-shrink-0">
                <Pencil className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-bold text-foreground leading-tight truncate">
                  Edit {brand.name}
                </DialogTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{brand.domain || "no domain"}</span>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <span className="text-xs text-muted-foreground">{client.name}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a category to edit. You&apos;ll be taken to that section with your existing values pre-filled.
            </p>
          </DialogHeader>
        </div>

        {/* Category groups */}
        <div className="px-6 py-5 space-y-5">
          {["Brand Scopes", "Providers", "Other"].map((group, gi) => {
            const opts = grouped[group] ?? [];
            if (!opts.length) return null;
            const colors = GROUP_COLORS[group] ?? GROUP_COLORS["Other"];
            return (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.07 + 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${colors.text}`}>
                  {group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {opts.map((opt) => (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(opt.firstStep)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg}`}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
