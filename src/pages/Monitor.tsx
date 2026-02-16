import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Power, Users, DollarSign, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { KPICard } from "@/views/monitor/KPICard";
import { ClientStatusTable } from "@/views/monitor/ClientStatusTable";
import { MOCK_CLIENTS } from "@/models/monitor-data";
import { ROUTES } from "@/models/routes";
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

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(ROUTES.HOME)} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="mb-8">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-2xl md:text-3xl font-bold text-foreground">
            Good Day, Worker Name
          </motion.h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your system overview</p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StaggerItem>
            <KPICard icon={Users} label="Number Of Clients" value={3} color="bg-primary/10 text-primary" />
          </StaggerItem>
          <StaggerItem>
            <KPICard icon={DollarSign} label="Brands Total Deposits" value={121} suffix="K" color="bg-success/10 text-success" />
          </StaggerItem>
          <StaggerItem>
            <KPICard icon={Building2} label="Brand Number" value={13} color="bg-warning/10 text-warning" />
          </StaggerItem>
        </StaggerContainer>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm mb-6">
          <div className="p-5 border-b">
            <h2 className="font-semibold text-foreground">Client Status</h2>
          </div>
          <ClientStatusTable clients={MOCK_CLIENTS} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
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
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/5">
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
