import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";
import { ClientBrandsContent } from "./ClientBrandsContent";
import { ROUTES } from "@/models/routes";

interface ClientStatusTableProps {
  clients: MonitorClient[];
  onToggleBrandDisabled?: (client: MonitorClient, brand: ClientBrand) => void;
  onDeleteBrand?: (client: MonitorClient, brand: ClientBrand) => void;
}

export const ClientStatusTable = ({ clients, onToggleBrandDisabled, onDeleteBrand }: ClientStatusTableProps) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (clientId: string) => {
    setExpandedId((prev) => (prev === clientId ? null : clientId));
  };

  const handleEditBrand = (client: MonitorClient, brand: ClientBrand) => {
    navigate(ROUTES.CREATE_BRAND, {
      state: {
        clientId: client.id,
        clientName: client.name,
        editBrand: { id: brand.id, name: brand.name, domain: brand.domain },
      },
    });
  };

  const handleAddBrand = (client: MonitorClient) => {
    navigate(ROUTES.CREATE_BRAND, { state: { clientId: client.id, clientName: client.name } });
  };

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 text-xs text-muted-foreground uppercase tracking-wider bg-muted/20">
              <th className="text-left p-4 w-10 font-medium"></th>
              <th className="text-left p-4 font-medium">Client Name</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Paid</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <Fragment key={c.id}>
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors duration-300 cursor-pointer"
                  onClick={() => toggleExpand(c.id)}
                >
                  <td className="p-4 w-10">
                    <button
                      type="button"
                      className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(c.id);
                      }}
                    >
                      {expandedId === c.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 font-medium text-foreground">{c.clientName}</td>
                  <td className="p-4 text-muted-foreground">{c.name}</td>
                  <td className="p-4">
                    <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>{c.status}</span>
                  </td>
                  <td className="p-4 text-foreground">{c.paid}</td>
                  <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="text-xs">Close</Button>
                    <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {expandedId === c.id && (
                    <motion.tr
                      key={`${c.id}-expanded`}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b last:border-0"
                    >
                      <td colSpan={6} className="p-0 bg-muted/20 overflow-hidden">
                        <div className="p-4">
                          <ClientBrandsContent
                            client={c}
                            onEditBrand={handleEditBrand}
                            onAddBrand={handleAddBrand}
                            onToggleBrandDisabled={onToggleBrandDisabled}
                            onDeleteBrand={onDeleteBrand}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden p-4 space-y-3">
        {clients.map((c) => {
          const isExpanded = expandedId === c.id;
          return (
            <div key={c.id} className="rounded-2xl border border-border/40 overflow-hidden bg-card shadow-widget">
              <div
                className="p-4 space-y-2 cursor-pointer hover:bg-muted/30 transition-colors duration-300"
                onClick={() => toggleExpand(c.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      className="flex-shrink-0 p-1 rounded hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(c.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <span className="font-medium text-foreground truncate">{c.clientName}</span>
                  </div>
                  <span className={`flex-shrink-0 ${c.status === "Good" ? "badge-success" : "badge-danger"}`}>{c.status}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground pl-6">
                  <span>{c.name}</span>
                  <span>Paid: {c.paid}</span>
                </div>
                <div className="flex gap-2 pl-6" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" className="text-xs flex-1">Close</Button>
                  <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
                </div>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden border-t bg-muted/20"
                  >
                    <div className="p-4">
                      <ClientBrandsContent
                        client={c}
                        onEditBrand={handleEditBrand}
                        onAddBrand={handleAddBrand}
                        onToggleBrandDisabled={onToggleBrandDisabled}
                        onDeleteBrand={onDeleteBrand}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
};
