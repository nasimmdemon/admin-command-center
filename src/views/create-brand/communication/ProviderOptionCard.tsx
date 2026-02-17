import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProviderOptionCardProps {
  label: string;
  sublabel: string;
  selected: boolean;
  onClick: () => void;
}

export const ProviderOptionCard = ({ label, sublabel, selected, onClick }: ProviderOptionCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className={`rounded-xl border p-4 text-left transition-all duration-300 ease-smooth shadow-widget hover:shadow-card ${
      selected ? "bg-tint-blue border-primary/60" : "bg-card border-border/50 hover:border-muted-foreground/40"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
          selected ? "bg-primary border-primary" : "border-muted-foreground/30"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      </div>
    </div>
  </motion.button>
);
