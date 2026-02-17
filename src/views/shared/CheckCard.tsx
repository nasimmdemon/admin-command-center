import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CheckCardProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export const CheckCard = ({ label, checked, onChange }: CheckCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.3 }}
    onClick={() => onChange(!checked)}
    className={`rounded-xl border p-3 text-sm font-medium text-left transition-all duration-300 ease-smooth shadow-widget hover:shadow-card ${
      checked ? "bg-tint-blue border-primary/60 text-foreground" : "bg-card border-border/50 text-muted-foreground hover:border-muted-foreground/40"
    }`}
  >
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
          checked ? "bg-primary border-primary" : "border-muted-foreground/30"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <span className="truncate">{label}</span>
    </div>
  </motion.button>
);
