import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, RefreshCw, XCircle } from "lucide-react";
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
    <div className="flex flex-col w-full">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[40px_2fr_2fr_1fr_1fr_120px] items-center px-4 py-3 border-b border-border/40 bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <div></div>
        <div>Client Name</div>
        <div>Name</div>
        <div>Status</div>
        <div>Paid</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-border/40">
        {clients.map((c, i) => {
          const isExpanded = expandedId === c.id;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col group bg-card transition-colors hover:bg-muted/10"
            >
              {/* Desktop Row */}
              <div 
                className="hidden md:grid grid-cols-[40px_2fr_2fr_1fr_1fr_120px] items-center px-4 py-4 cursor-pointer transition-colors"
                onClick={() => toggleExpand(c.id)}
              >
                <div className="flex items-center justify-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
                <div className="font-semibold text-foreground text-sm pl-2">{c.clientName}</div>
                <div className="text-muted-foreground text-sm">{c.name}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    c.status === "Good" 
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="text-sm font-medium text-foreground">{c.paid}</div>
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Close">
                    <XCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Refresh">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Row */}
              <div 
                className="md:hidden flex flex-col p-4 space-y-3 cursor-pointer"
                onClick={() => toggleExpand(c.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                      <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                    <span className="font-semibold text-foreground text-base truncate">{c.clientName}</span>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    c.status === "Good" 
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pl-11">
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="font-medium text-foreground">Paid: {c.paid}</span>
                </div>
                <div className="flex gap-2 pl-11 pt-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" className="h-8 flex-1 text-xs gap-1.5 rounded-xl">
                    <XCircle className="w-3.5 h-3.5" /> Close
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-10 px-0 rounded-xl">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`content-${c.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-muted/20 border-t border-border/40"
                  >
                    <div className="p-4 md:p-6 md:pl-[88px] relative">
                      <div className="hidden md:block absolute left-9 top-0 bottom-6 w-px bg-border/60" />
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
