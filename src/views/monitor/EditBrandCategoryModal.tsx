import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EDIT_CATEGORY_OPTIONS } from "@/models/brand-wizard-categories";
import { ROUTES } from "@/models/routes";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";

interface EditBrandCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: MonitorClient;
  brand: ClientBrand;
}

const grouped = EDIT_CATEGORY_OPTIONS.reduce(
  (acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
  },
  {} as Record<string, typeof EDIT_CATEGORY_OPTIONS>
);

export const EditBrandCategoryModal = ({
  open,
  onOpenChange,
  client,
  brand,
}: EditBrandCategoryModalProps) => {
  const navigate = useNavigate();

  const handleSelect = (firstStep: number) => {
    onOpenChange(false);
    navigate(ROUTES.CREATE_BRAND, {
      state: {
        clientId: client.id,
        clientName: client.name,
        editBrand: { id: brand.id, name: brand.name, domain: brand.domain },
        startStep: firstStep,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {brand.name}</DialogTitle>
          <DialogDescription>
            Select a category to edit. You&apos;ll be taken to the start of that section.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {["Brand Scopes", "Providers", "Other"].map((group) => (
            <div key={group}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group}
              </p>
              <div className="flex flex-wrap gap-2">
                {(grouped[group] ?? []).map((opt) => (
                  <Button
                    key={opt.id}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSelect(opt.firstStep)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
