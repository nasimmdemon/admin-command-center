import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";

interface ClientBrandsContentProps {
  client: MonitorClient;
  onEditBrand?: (client: MonitorClient, brand: ClientBrand) => void;
  onAddBrand?: (client: MonitorClient) => void;
  onToggleBrandDisabled?: (client: MonitorClient, brand: ClientBrand) => void;
  onDeleteBrand?: (client: MonitorClient, brand: ClientBrand) => void;
}

export const ClientBrandsContent = ({
  client,
  onEditBrand,
  onAddBrand,
  onToggleBrandDisabled,
  onDeleteBrand,
}: ClientBrandsContentProps) => {
  const [brandsExpanded, setBrandsExpanded] = useState(true);

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
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-2">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded hover:bg-muted transition-colors"
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
              <ScrollArea className="h-[200px] border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                  {client.brands.map((brand) => {
                    const isDisabled = brand.disabled ?? false;
                    return (
                      <div
                        key={brand.id}
                        className={`flex flex-col gap-3 rounded-xl border p-4 transition-all ${
                          isDisabled
                            ? "border-muted bg-muted/30 opacity-75"
                            : "border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm"
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
                              onClick={() => onEditBrand?.(client, brand)}
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={() => onToggleBrandDisabled?.(client, brand)}
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
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete brand &quot;{brand.name}&quot;?</AlertDialogTitle>
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
              </ScrollArea>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};
