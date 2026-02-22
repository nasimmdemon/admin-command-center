import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Power, Users, DollarSign, Building2, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-dotted p-6 md:p-10">
      <PageTransition className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.HOME)}
          className="mb-8 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="text-center mb-10 md:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-[2.5rem] font-bold text-foreground tracking-tight"
          >
            Monitor & Shut Down
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="text-muted-foreground mt-3 text-base"
          >
            Here&apos;s your system overview
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 h-px w-16 bg-primary/40 rounded-full origin-center"
          />
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-12">
          <StaggerItem>
            <KPICard icon={Users} label="Total clients" value={clients.length} iconBg="bg-primary/10" iconColor="text-primary" trend={12.5} />
          </StaggerItem>
          <StaggerItem>
            <KPICard icon={DollarSign} label="Total deposits" value={totalDeposits} suffix="K" iconBg="bg-success/10" iconColor="text-success" trend={8.2} />
          </StaggerItem>
          <StaggerItem>
            <KPICard icon={Building2} label="Total brands" value={totalBrands} iconBg="bg-warning/10" iconColor="text-warning" trend={-2.1} />
          </StaggerItem>
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border/40 shadow-widget overflow-hidden mb-8 bg-card"
        >
          <div className="px-6 py-5 border-b border-border/40 bg-tint-blue/40">
            <h2 className="font-semibold text-foreground text-lg">Client Status</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Expand a row to manage brands</p>
          </div>
          <ClientStatusTable
            clients={clients}
            onToggleBrandDisabled={handleToggleBrandDisabled}
            onDeleteBrand={handleDeleteBrand}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h2 className="font-semibold text-foreground text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.12 } }}
                  className="w-full text-left rounded-2xl border bg-tint-blue p-6 flex flex-col gap-4 group cursor-pointer border-border/40 shadow-widget hover:shadow-card hover:border-primary/25 transition-all duration-300 ease-smooth"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-tint-blue border border-border/40 shadow-soft">
                      <RefreshCw className="w-6 h-6 text-foreground/90" strokeWidth={1.75} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base leading-tight">Restart All Services</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Restart all running services. There may be brief downtime.</p>
                  </div>
                </motion.button>
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
                <motion.button
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.12 } }}
                  className="w-full text-left rounded-2xl border bg-tint-rose p-6 flex flex-col gap-4 group cursor-pointer border-border/40 shadow-widget hover:shadow-card hover:border-destructive/30 transition-all duration-300 ease-smooth"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive border border-border/40 shadow-soft">
                      <Power className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-destructive group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base leading-tight">Emergency Shutdown</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Immediately shut down ALL services and brands. Cannot be easily undone.</p>
                  </div>
                </motion.button>
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
