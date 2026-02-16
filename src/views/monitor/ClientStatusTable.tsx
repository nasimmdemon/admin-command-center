import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Building2 } from "lucide-react";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";
import { ClientBrandsModal } from "./ClientBrandsModal";
import { ROUTES } from "@/models/routes";

interface ClientStatusTableProps {
  clients: MonitorClient[];
}

export const ClientStatusTable = ({ clients }: ClientStatusTableProps) => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<MonitorClient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openBrandsModal = (e: React.MouseEvent, client: MonitorClient) => {
    e.stopPropagation();
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleEditBrand = (_client: MonitorClient, brand: ClientBrand) => {
    alert(`Edit brand: ${brand.name} (${brand.domain})`);
  };

  const handleAddBrand = (client: MonitorClient) => {
    setModalOpen(false);
    navigate(ROUTES.CREATE_BRAND, { state: { clientId: client.id, clientName: client.name } });
  };

  const formatBrands = (brands: ClientBrand[]) => {
    if (brands.length === 0) return "—";
    return brands.map((b) => b.name).join(", ");
  };

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left p-4">Client Name</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Brands</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Paid</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                className="border-b last:border-0 hover:bg-secondary/30 transition-colors duration-300"
              >
                <td className="p-4 font-medium text-foreground">{c.clientName}</td>
                <td className="p-4 text-muted-foreground">{c.name}</td>
                <td className="p-4 text-foreground max-w-[200px]">
                  <span className="truncate block" title={formatBrands(c.brands)}>
                    {formatBrands(c.brands)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>{c.status}</span>
                </td>
                <td className="p-4 text-foreground">{c.paid}</td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => openBrandsModal(e, c)}
                    title="View / Create brands"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">Close</Button>
                  <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden p-4 space-y-3">
        {clients.map((c) => (
          <div key={c.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">{c.clientName}</span>
              <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>{c.status}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{c.name}</span>
              <span>{c.paid}</span>
            </div>
            <div className="text-sm text-foreground">
              <span className="text-muted-foreground">Brands: </span>
              {formatBrands(c.brands)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={(e) => openBrandsModal(e, c)}
              >
                <Building2 className="w-3 h-3 mr-1" /> Brands
              </Button>
              <Button variant="outline" size="sm" className="text-xs flex-1">Close</Button>
              <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      <ClientBrandsModal
        client={selectedClient}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onEditBrand={handleEditBrand}
        onAddBrand={handleAddBrand}
      />
    </>
  );
};
