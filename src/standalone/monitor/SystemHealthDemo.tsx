import { motion } from "framer-motion";
import { Cpu, HardDrive, Wifi } from "lucide-react";
import { SYSTEM_HEALTH_ITEMS } from "@/models/monitor-data";

const ICON_MAP = { cpu: Cpu, hardDrive: HardDrive, wifi: Wifi } as const;

export const SystemHealthDemo = () => (
  <div className="bg-card rounded-xl border p-5 space-y-4">
    <h2 className="font-semibold text-foreground">System Health</h2>
    {SYSTEM_HEALTH_ITEMS.map((item) => {
      const Icon = ICON_MAP[item.iconKey];
      return (
        <div key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4" />
              {item.label}
            </div>
            <span className="font-medium text-foreground">{item.suffix || `${item.value}%`}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${item.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      );
    })}
  </div>
);
