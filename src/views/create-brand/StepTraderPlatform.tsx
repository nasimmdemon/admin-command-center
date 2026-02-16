import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { ROUTES } from "@/models/routes";

interface StepTraderPlatformProps {
  value: string;
  onChange: (v: string) => void;
}

export const StepTraderPlatform = ({ value, onChange }: StepTraderPlatformProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">TRADER Platform</h2>
    <div className="space-y-3">
      <motion.button
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        onClick={() => onChange("MT5")}
        className={`w-full rounded-lg border p-5 text-left transition-colors duration-300 ${
          value === "MT5" ? "bg-primary/10 border-primary" : "bg-card"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === "MT5" ? "border-primary" : "border-muted-foreground/30"}`}>
            {value === "MT5" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
          <div>
            <p className="font-semibold text-foreground">HOUSE MT5</p>
            <p className="text-xs text-muted-foreground">Full MetaTrader 5 platform</p>
          </div>
        </div>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        onClick={() => onChange("NONE")}
        className={`w-full rounded-lg border p-5 text-left transition-colors duration-300 ${
          value === "NONE" ? "bg-warning/10 border-warning" : "bg-card"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === "NONE" ? "border-warning" : "border-muted-foreground/30"}`}>
            {value === "NONE" && <div className="w-2.5 h-2.5 rounded-full bg-warning" />}
          </div>
          <div>
            <p className="font-semibold text-foreground">NO TRADER</p>
            <p className="text-xs text-warning">Still able to trade but no WebTrader</p>
          </div>
        </div>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        onClick={() => onChange("OTHER")}
        className={`w-full rounded-lg border p-5 text-left transition-colors duration-300 ${
          value === "OTHER" ? "bg-primary/10 border-primary" : "bg-card"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === "OTHER" ? "border-primary" : "border-muted-foreground/30"}`}>
            {value === "OTHER" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
          <div>
            <p className="font-semibold text-foreground">Other (external)</p>
            <p className="text-xs text-muted-foreground">Connect your own trading platform</p>
          </div>
        </div>
      </motion.button>
    </div>
    {value === "OTHER" && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="rounded-lg border border-dashed p-4 bg-muted/30"
      >
        <p className="text-sm text-muted-foreground mb-2">External trading platform — use our docs to connect your provider.</p>
        <Link
          to={`${ROUTES.PROVIDERS}?tab=trader`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          View provider docs (Trader Platform)
        </Link>
      </motion.div>
    )}
  </div>
);
