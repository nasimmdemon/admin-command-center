import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Power, PowerOff, Trash2, TrendingUp, TrendingDown, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMetricsDialog } from "./BrandMetricsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";

interface ClientBrandsContentProps {
  client: MonitorClient;
  onEditBrand?: (client: MonitorClient, brand: ClientBrand) => void;
  onAddBrand?: (client: MonitorClient) => void;
  onToggleBrandDisabled?: (client: MonitorClient, brand: ClientBrand) => void;
  onDeleteBrand?: (client: MonitorClient, brand: ClientBrand) => void;
}

const formatRevenue = (value?: number) => {
  if (value == null) return null;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
};

export const ClientBrandsContent = ({
  client,
  onEditBrand,
  onAddBrand,
  onToggleBrandDisabled,
  onDeleteBrand,
}: ClientBrandsContentProps) => {
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [metricsBrand, setMetricsBrand] = useState<ClientBrand | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
          <p className="text-sm text-muted-foreground">
            {client.clientName} · Total paid: {client.paid}
          </p>
          <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${client.status === "Good" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
            {client.status}
          </span>
        </div>
        <Button size="sm" onClick={() => onAddBrand?.(client)} className="flex-shrink-0">
          <Plus className="w-4 h-4 mr-1" /> Add Brand
        </Button>
      </div>

        <Collapsible open={brandsExpanded} onOpenChange={setBrandsExpanded}>
        <div className="rounded-xl border border-border/40 overflow-hidden">
          <div className="flex items-center gap-2 bg-muted/20 px-3 py-2.5">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg hover:bg-muted/80 transition-colors"
              >
                {brandsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
            <h4 className="flex-1 font-semibold text-foreground text-sm">
              Brands {client.brands.length > 0 && `(${client.brands.length})`}
            </h4>
          </div>
          <CollapsibleContent>
            {client.brands.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 px-4">No brands yet. Add one to get started.</p>
            ) : (
              <div className="border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                  {client.brands.map((brand) => {
                    const isDisabled = brand.disabled ?? false;
                    return (
                      <div
                        key={brand.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setMetricsBrand(brand)}
                        onKeyDown={(e) => e.key === "Enter" && setMetricsBrand(brand)}
                        className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all duration-300 ease-smooth cursor-pointer ${
                          isDisabled
                            ? "border-muted bg-muted/30 opacity-75"
                            : "border-border/40 bg-card shadow-widget hover:shadow-card hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              brand.status === "Online" ? "bg-success" : brand.status === "Offline" ? "bg-destructive" : "bg-warning"
                            }`} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{brand.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{brand.domain}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); onEditBrand?.(client, brand); }}
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {brand.metrics && (
                          <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-muted-foreground">Monthly revenue</span>
                              {brand.metrics.monthlyRevenue != null &&
                                (brand.metrics.monthlyRevenue >= 1_000_000 ? (
                                  <span className="text-xs font-medium text-success bg-success/15 px-2 py-0.5 rounded-full">High performer</span>
                                ) : brand.metrics.monthlyRevenue < 50_000 && brand.metrics.monthlyRevenue > 0 ? (
                                  <span className="text-xs font-medium text-warning bg-warning/15 px-2 py-0.5 rounded-full">Low volume</span>
                                ) : null)}
                            </div>
                            <p className={`text-lg font-bold ${
                              (brand.metrics.monthlyRevenue ?? 0) >= 1_000_000 ? "text-success" :
                              (brand.metrics.monthlyRevenue ?? 0) < 50_000 && (brand.metrics.monthlyRevenue ?? 0) > 0 ? "text-warning" : "text-foreground"
                            }`}>
                              {formatRevenue(brand.metrics.monthlyRevenue) ?? "—"}
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-border/40">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Deposits</p>
                                  <p className="text-sm font-semibold text-foreground truncate">{brand.metrics.deposits}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <TrendingDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Withdrawals</p>
                                  <p className="text-sm font-semibold text-foreground truncate">{brand.metrics.withdrawals}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Users className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Clients</p>
                                  <p className="text-sm font-semibold text-foreground">{brand.metrics.clients.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <UserPlus className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Leads</p>
                                  <p className="text-sm font-semibold text-foreground">{brand.metrics.leads.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={(e) => { e.stopPropagation(); onToggleBrandDisabled?.(client, brand); }}
                            title={isDisabled ? "Enable brand" : "Disable brand"}
                          >
                            {isDisabled ? (
                              <>
                                <Power className="w-3.5 h-3.5 mr-1.5" /> Enable
                              </>
                            ) : (
                              <>
                                <PowerOff className="w-3.5 h-3.5 mr-1.5" /> Disable
                              </>
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                                title="Delete brand"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this brand?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove the brand from the database. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => onDeleteBrand?.(client, brand)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      {metricsBrand && (
        <BrandMetricsDialog
          open={!!metricsBrand}
          onOpenChange={(open) => !open && setMetricsBrand(null)}
          brand={metricsBrand}
          client={client}
          onEditBrand={onEditBrand}
        />
      )}
    </div>
  );
};
