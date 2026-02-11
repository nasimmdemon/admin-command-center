import { KPICard } from "@/views/monitor/KPICard";
import { Users, DollarSign, Building2 } from "lucide-react";

export const KPICardDemo = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <KPICard icon={Users} label="Number Of Clients" value={3} color="bg-primary/10 text-primary" />
    <KPICard icon={DollarSign} label="Brands Total Deposits" value={121} suffix="K" color="bg-success/10 text-success" />
    <KPICard icon={Building2} label="Brand Number" value={13} color="bg-warning/10 text-warning" />
  </div>
);
