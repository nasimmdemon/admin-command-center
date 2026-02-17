import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Power, Users, DollarSign, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { KPICard } from "@/views/monitor/KPICard";
import { ClientStatusTable } from "@/views/monitor/ClientStatusTable";
import { MOCK_CLIENTS } from "@/models/monitor-data";
import { ROUTES } from "@/models/routes";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";
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

const Monitor = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<MonitorClient[]>(() => MOCK_CLIENTS);

  const handleToggleBrandDisabled = (client: MonitorClient, brand: ClientBrand) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === client.id
          ? {
              ...c,
              brands: c.brands.map((b) =>
                b.id === brand.id ? { ...b, disabled: !(b.disabled ?? false) } : b
              ),
            }
          : c
      )
    );
  };

  const handleDeleteBrand = (client: MonitorClient, brand: ClientBrand) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === client.id
          ? { ...c, brands: c.brands.filter((b) => b.id !== brand.id) }
          : c
      )
    );
  };

  const totalDeposits = 121;
  const totalBrands = clients.reduce((sum, c) => sum + c.brands.length, 0);

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(ROUTES.HOME)} className="mb-6 text-muted-foreground hover:text-foreground -ml-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="mb-10">
          <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-2xl md:text-3xl font-bold text-foreground">
            Good Day, Worker Name
          </motion.h1>
          <p className="text-muted-foreground mt-1 text-[15px]">Here&apos;s your system overview</p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <StaggerItem>
            <KPICard icon={Users} label="Total Clients" value={clients.length} color="bg-primary/10 text-primary" />
          </StaggerItem>
          <StaggerItem>
            <KPICard icon={DollarSign} label="Total Deposits" value={totalDeposits} suffix="K" color="bg-success/10 text-success" />
          </StaggerItem>
          <StaggerItem>
            <KPICard icon={Building2} label="Total Brands" value={totalBrands} color="bg-warning/10 text-warning" />
          </StaggerItem>
        </StaggerContainer>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="bg-card rounded-[1.25rem] border border-border/50 shadow-card overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-border/50 bg-tint-blue/50">
            <h2 className="font-semibold text-foreground text-lg">Client Status</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Expand a row to manage brands</p>
          </div>
          <ClientStatusTable
            clients={clients}
            onToggleBrandDisabled={handleToggleBrandDisabled}
            onDeleteBrand={handleDeleteBrand}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="bg-card rounded-[1.25rem] border border-border/50 shadow-card p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl h-11">
                  <RefreshCw className="w-4 h-4" /> Restart All Services
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Restart All Services?</AlertDialogTitle>
                  <AlertDialogDescription>This will restart all running services. There may be brief downtime.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Restart</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 rounded-xl h-11">
                  <Power className="w-4 h-4" /> Emergency Shutdown
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Emergency Shutdown?</AlertDialogTitle>
                  <AlertDialogDescription>This will immediately shut down ALL services and brands. This action cannot be easily undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Shut Down</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      </PageTransition>
    </div>
  );
};

export default Monitor;
