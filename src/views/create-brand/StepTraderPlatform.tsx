import { motion } from "framer-motion";

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
    </div>
  </div>
);
