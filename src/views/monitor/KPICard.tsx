import { motion } from "framer-motion";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  iconBg: string;
  iconColor: string;
  /** Optional trend: positive = green up, negative = red down */
  trend?: number;
}

export const KPICard = ({ icon: Icon, label, value, suffix = "", iconBg, iconColor, trend }: KPICardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    className="w-full rounded-2xl bg-card border border-border/30 p-6 shadow-soft hover:shadow-card transition-all duration-300 ease-smooth"
  >
    <div className="flex items-start justify-between gap-2 mb-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <button
        type="button"
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
        aria-label="More info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
    </div>
    <CountUp end={value} suffix={suffix} className="text-2xl md:text-3xl font-bold text-foreground tracking-tight" />
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
    {trend != null && (
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? "text-success" : "text-destructive"}`}>
        {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span>{trend >= 0 ? "+" : ""}{trend}%</span>
      </div>
    )}
  </motion.div>
);
