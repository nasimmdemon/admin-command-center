import { motion } from "framer-motion";
import { MonitorPlay, Ban, LayoutDashboard, ExternalLink, Blocks } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/models/routes";

interface StepTraderPlatformProps {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  {
    id: "NO_TRADING",
    label: "No Trading",
    desc: "CRM only, totally no trading capabilities.",
    icon: Ban,
    bg: "bg-[hsl(0,80%,98%)]",
    iconBg: "bg-[hsl(0,80%,94%)]",
    iconColor: "text-[hsl(0,75%,60%)]",
    borderSelected: "border-[hsl(0,75%,65%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(0,80%,94%)]",
    tag: "CRM Only",
  },
  {
    id: "DEALING_MENU",
    label: "Dealing Menu",
    desc: "Backend dealing menu, no WebTrader included.",
    icon: LayoutDashboard,
    bg: "bg-[hsl(38,92%,96%)]",
    iconBg: "bg-[hsl(38,92%,90%)]",
    iconColor: "text-[hsl(38,80%,45%)]",
    borderSelected: "border-[hsl(38,80%,55%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(38,92%,90%)]",
    tag: "Backend",
  },
  {
    id: "DEALING_MENU_WEBTRADER",
    label: "Full WebTrader",
    desc: "Full MetaTrader 5 platform with WebTrader.",
    icon: MonitorPlay,
    bg: "bg-[hsl(217,91%,97%)]",
    iconBg: "bg-[hsl(217,91%,92%)]",
    iconColor: "text-[hsl(217,80%,55%)]",
    borderSelected: "border-[hsl(217,80%,65%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(217,91%,90%)]",
    tag: "Recommended",
  },
  {
    id: "EXTERNAL",
    label: "External Solution",
    desc: "Connect your own custom trading platform.",
    icon: Blocks,
    bg: "bg-[hsl(250,80%,97%)]",
    iconBg: "bg-[hsl(250,80%,92%)]",
    iconColor: "text-[hsl(250,65%,58%)]",
    borderSelected: "border-[hsl(250,65%,65%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(250,80%,92%)]",
    tag: "Custom API",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

export const StepTraderPlatform = ({ value, onChange }: StepTraderPlatformProps) => (
  <div className="space-y-8 mt-2">
    {/* Header */}
    <div className="space-y-1.5">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">Trader Platform</h2>
      <p className="text-[15px] text-muted-foreground leading-relaxed">
        Choose the trading capabilities for this brand. This determines what the client-facing trading experience looks like.
      </p>
    </div>

    {/* 2×2 Grid matching Step 0 */}
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const selected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            variants={cardVariants}
            whileHover={{ scale: 1.025, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onChange(opt.id)}
            className={[
              "relative group rounded-2xl border-2 p-5 text-left transition-all duration-300 cursor-pointer w-full mt-2",
              opt.bg,
              selected
                ? `${opt.borderSelected} ${opt.shadowSelected}`
                : "border-transparent hover:border-border/60",
            ].join(" ")}
            style={{
              boxShadow: selected
                ? undefined
                : "0 2px 12px -4px rgba(0,0,0,0.06), 0 6px 20px -6px rgba(0,0,0,0.07)",
            }}
          >
            {/* Selected ring glow overlay */}
            {selected && (
              <motion.div
                layoutId="selected-glow"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "rgba(255,255,255,0.35)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            {/* Tag badge */}
            <span
              className={[
                "absolute top-3.5 right-3.5 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
                opt.iconBg,
                opt.iconColor,
              ].join(" ")}
            >
              {opt.tag}
            </span>

            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${opt.iconBg}`}>
              <Icon className={`w-5 h-5 ${opt.iconColor}`} />
            </div>

            {/* Text */}
            <p className="text-[15px] font-bold text-foreground mb-1 leading-snug">{opt.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed pr-6">{opt.desc}</p>

            {/* Selected indicator dot */}
            <div
              className={[
                "absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                selected ? opt.borderSelected.replace("border-", "border-") : "border-muted-foreground/25",
              ].join(" ")}
            >
              {selected && (
                <motion.div
                  layoutId="selected-dot"
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "currentColor" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </motion.div>

    {value === "EXTERNAL" && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="rounded-2xl border border-dashed border-border/60 p-5 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
      >
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground mb-1">External Trading Integration</p>
            <p className="text-xs text-muted-foreground">You selected an external trading platform. Please review the developer docs to map your APIs successfully.</p>
          </div>
        </div>
        <Link
          to={`${ROUTES.PROVIDERS}?tab=trader`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-4 py-2 rounded-xl"
        >
          View Docs <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    )}
  </div>
);
