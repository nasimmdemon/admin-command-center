import { TrendingUp, TrendingDown, Users, UserPlus, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ClientBrand, MonitorClient } from "@/models/monitor-data";

interface BrandMetricsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: ClientBrand;
  client: MonitorClient;
  onEditBrand?: (client: MonitorClient, brand: ClientBrand) => void;
}

const formatRevenue = (value?: number) => {
  if (value == null) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
};

export const BrandMetricsDialog = ({
  open,
  onOpenChange,
  brand,
  client,
  onEditBrand,
}: BrandMetricsDialogProps) => {
  const metrics = brand.metrics;
  const isHighPerformer = (metrics?.monthlyRevenue ?? 0) >= 1_000_000;
  const isLowPerformer = (metrics?.monthlyRevenue ?? 0) < 50_000 && (metrics?.monthlyRevenue ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/50 shadow-card">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                brand.status === "Online" ? "bg-success" : brand.status === "Offline" ? "bg-destructive" : "bg-warning"
              }`}
            />
            <DialogTitle className="text-xl">{brand.name}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">{brand.domain} · {client.clientName}</p>
        </DialogHeader>

        {metrics ? (
          <div className="space-y-4 pt-2">
            {/* Revenue highlight - easy to spot high/low performers */}
            {metrics.monthlyRevenue != null && (
              <div
                className={`rounded-xl p-4 border ${
                  isHighPerformer
                    ? "bg-success/10 border-success/30"
                    : isLowPerformer
                    ? "bg-warning/10 border-warning/30"
                    : "bg-muted/30 border-border/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Monthly revenue</span>
                  {isHighPerformer && (
                    <span className="text-xs font-medium text-success bg-success/20 px-2 py-0.5 rounded-full">High performer</span>
                  )}
                  {isLowPerformer && (
                    <span className="text-xs font-medium text-warning bg-warning/20 px-2 py-0.5 rounded-full">Low volume</span>
                  )}
                </div>
                <p className={`text-2xl font-bold mt-1 ${isHighPerformer ? "text-success" : isLowPerformer ? "text-warning" : "text-foreground"}`}>
                  {formatRevenue(metrics.monthlyRevenue)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/50 p-3 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">Deposits</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{metrics.deposits}</p>
              </div>
              <div className="rounded-xl border border-border/50 p-3 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-medium">Withdrawals</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{metrics.withdrawals}</p>
              </div>
              <div className="rounded-xl border border-border/50 p-3 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Clients</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{metrics.clients.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border/50 p-3 bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-xs font-medium">Leads</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{metrics.leads.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 p-6 text-center">
            <DollarSign className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No metrics available for this brand yet.</p>
          </div>
        )}

        {onEditBrand && (
          <Button variant="outline" className="w-full rounded-xl" onClick={() => { onOpenChange(false); onEditBrand(client, brand); }}>
            Edit brand config
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
