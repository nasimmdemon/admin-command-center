import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";

interface ClientBrandsModalProps {
  client: MonitorClient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditBrand?: (client: MonitorClient, brand: ClientBrand) => void;
  onAddBrand?: (client: MonitorClient) => void;
}

export const ClientBrandsModal = ({
  client,
  open,
  onOpenChange,
  onEditBrand,
  onAddBrand,
}: ClientBrandsModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{client.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {client.clientName} · {client.paid} paid
          </p>
          <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium ${client.status === "Good" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
            {client.status}
          </span>
        </DialogHeader>

        <div className="mt-4 space-y-4 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Brands</h3>
            <Button size="sm" onClick={() => onAddBrand?.(client)}>
              <Plus className="w-4 h-4 mr-1" /> Add Brand
            </Button>
          </div>

          {client.brands.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No brands yet. Add one to get started.</p>
          ) : (
            <div className="space-y-2 overflow-y-auto pr-1 -mr-1">
              {client.brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      brand.status === "Online" ? "bg-success" : brand.status === "Offline" ? "bg-destructive" : "bg-warning"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{brand.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{brand.domain}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => onEditBrand?.(client, brand)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
