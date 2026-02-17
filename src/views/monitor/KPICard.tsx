import { motion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}

export const KPICard = ({ icon: Icon, label, value, suffix = "", color }: KPICardProps) => (
  <motion.div
    whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
    className="bg-card rounded-[1.25rem] border border-border/50 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 ease-smooth"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-widget ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
    <CountUp end={value} suffix={suffix} className="text-3xl font-bold text-foreground tracking-tight" />
  </motion.div>
);
