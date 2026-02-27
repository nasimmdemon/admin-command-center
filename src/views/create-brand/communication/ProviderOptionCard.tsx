import { motion } from "framer-motion";

interface ProviderOptionCardProps {
  label: string;
  sublabel: string;
  selected: boolean;
  onClick: () => void;
}

export const ProviderOptionCard = ({ label, sublabel, selected, onClick }: ProviderOptionCardProps) => (
  <motion.button
    type="button"
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.15 }}
    onClick={onClick}
    className={`relative flex-1 min-w-[140px] rounded-xl p-4 pl-5 text-left transition-all duration-200 ${
      selected
        ? "bg-primary/[0.06] border border-primary/20 border-l-[3px] border-l-primary"
        : "bg-muted/[0.04] border border-border/20 hover:bg-muted/10 hover:border-border/50"
    }`}
  >
    <p className={`font-medium text-sm ${selected ? "text-foreground" : "text-foreground/90"}`}>{label}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
  </motion.button>
);
