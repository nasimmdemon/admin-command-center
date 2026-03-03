import { motion } from "framer-motion";
import { FileJson, Copy, Sparkles, Database } from "lucide-react";

export type CreateMode = "simple" | "same_db" | "same_config" | "from_scratch";

interface StepCreateModeProps {
  value: CreateMode | null;
  onChange: (v: CreateMode) => void;
}

const OPTIONS: { id: CreateMode; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "simple", label: "Simple", desc: "Create brand from scratch with full wizard", icon: Sparkles },
  { id: "same_db", label: "Same DB (2 + 1)", desc: "Same database, same config — clone existing", icon: Database },
  { id: "same_config", label: "Same Config, Different users & domains", desc: "Copy config only, new users and domains (only 2)", icon: Copy },
  { id: "from_scratch", label: "From Scratch", desc: "Not 2, not 1 — completely new setup", icon: FileJson },
];

export const StepCreateMode = ({ value, onChange }: StepCreateModeProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Create Brand</h2>
    <p className="text-sm text-muted-foreground">Choose how to create your new brand.</p>
    <div className="space-y-3">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        return (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => onChange(opt.id as import("@/controllers/useCreateBrand").CreateMode)}
            className={`w-full rounded-xl border p-5 text-left transition-all duration-300 ease-smooth shadow-widget hover:shadow-card ${
              value === opt.id ? "bg-tint-blue border-primary/60" : "bg-card border-border/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.id ? "border-primary" : "border-muted-foreground/30"}`}>
                {value === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <Icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  </div>
);
