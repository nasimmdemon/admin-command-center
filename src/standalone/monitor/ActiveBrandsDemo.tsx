import { Button } from "@/components/ui/button";
import { RotateCw, Power, Eye } from "lucide-react";
import { ACTIVE_BRANDS } from "@/models/monitor-data";

export const ActiveBrandsDemo = () => (
  <div className="bg-card rounded-xl border p-5">
    <h2 className="font-semibold text-foreground mb-4">Active Brands</h2>
    <div className="space-y-3">
      {ACTIVE_BRANDS.map((b) => (
        <div key={b.name} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                b.status === "Online" ? "bg-success" : b.status === "Offline" ? "bg-destructive" : "bg-warning"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.domain}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RotateCw className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
              <Power className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
