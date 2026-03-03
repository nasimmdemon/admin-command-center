import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { ROUTES } from "@/models/routes";

interface StepTraderPlatformProps {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { id: "NO_TRADING", label: "CRM No Trading At All", desc: "CRM only, no trading capabilities" },
  { id: "DEALING_MENU", label: "CRM with Dealing Menu", desc: "Backend dealing menu, no WebTrader" },
  { id: "DEALING_MENU_WEBTRADER", label: "CRM with Dealing Menu & WebTrader", desc: "Full MetaTrader 5 platform with WebTrader" },
  { id: "EXTERNAL", label: "External solution", desc: "Connect your own trading platform" },
] as const;

export const StepTraderPlatform = ({ value, onChange }: StepTraderPlatformProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">TRADER Platform</h2>
    <div className="space-y-3">
      {OPTIONS.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          onClick={() => onChange(opt.id)}
          className={`w-full rounded-xl border p-5 text-left transition-all duration-300 ease-smooth shadow-widget hover:shadow-card ${
            value === opt.id ? "bg-tint-blue border-primary/60" : "bg-card border-border/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.id ? "border-primary" : "border-muted-foreground/30"}`}>
              {value === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div>
              <p className="font-semibold text-foreground">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
    {value === "EXTERNAL" && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="rounded-xl border border-dashed border-border/60 p-4 bg-tint-blue/50"
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
