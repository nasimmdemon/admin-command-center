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
    whileHover={{ y: -2 }}
    transition={{ duration: 0.3 }}
    className="bg-card rounded-xl border p-5 shadow-sm"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <CountUp end={value} suffix={suffix} className="text-3xl font-bold text-foreground" />
  </motion.div>
);
