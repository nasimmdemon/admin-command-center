import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  RefreshCw,
  Power,
  Users,
  DollarSign,
  Building2,
  ChevronRight,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { KPICard } from "@/views/monitor/KPICard";
import { ClientStatusTable } from "@/views/monitor/ClientStatusTable";
import { ROUTES } from "@/models/routes";
import type { MonitorClient, ClientBrand } from "@/models/monitor-data";
import { loadMonitorSnapshot } from "@/api/load-monitor-snapshot";
import type { AdminStatsPayload } from "@/api/services/admin-stats.service";
import * as brandsService from "@/api/services/brands.service";
import * as clientsService from "@/api/services/clients.service";
import * as depositsService from "@/api/services/deposits.service";
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
  const [clients, setClients] = useState<MonitorClient[]>([]);
  const [stats, setStats] = useState<AdminStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCode, setNewClientCode] = useState("");
  const [depositClientId, setDepositClientId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await loadMonitorSnapshot();
      setClients(snap.clients);
      setStats(snap.stats);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleToggleBrandDisabled = async (
    client: MonitorClient,
    brand: ClientBrand
  ) => {
    const next = !(brand.disabled ?? false);
    const r = await brandsService.updateBrand(brand.id, { disabled: next });
    if (!r.ok) {
      toast.error(r.rawText || `Update failed (${r.status})`);
      return;
    }
    toast.success(next ? "Brand disabled" : "Brand enabled");
    await refresh();
  };

  const handleDeleteBrand = async (client: MonitorClient, brand: ClientBrand) => {
    const r = await brandsService.deleteBrand(brand.id);
    if (!r.ok) {
      toast.error(r.rawText || `Delete failed (${r.status})`);
      return;
    }
    toast.success("Brand removed from database");
    await refresh();
  };

  const handleCreateClient = async () => {
    const name = newClientName.trim();
    if (!name) {
      toast.error("Client name is required");
      return;
    }
    const r = await clientsService.createClient({
      name,
      client_code: newClientCode.trim() || undefined,
    });
    if (!r.ok) {
      toast.error(r.rawText || `Create client failed (${r.status})`);
      return;
    }
    toast.success("Client saved to database");
    setNewClientName("");
    setNewClientCode("");
    setAddClientOpen(false);
    await refresh();
  };

  const handleCreateDeposit = async () => {
    const cid = depositClientId.trim();
    if (!cid) {
      toast.error("Select or enter a client id");
      return;
    }
    const amt = parseFloat(depositAmount);
    if (Number.isNaN(amt)) {
      toast.error("Enter a valid amount");
      return;
    }
    const r = await depositsService.createDeposit({
      client_id: cid,
      amount: amt,
      currency: depositCurrency.trim() || "USD",
      status: "recorded",
    });
    if (!r.ok) {
      toast.error(r.rawText || `Deposit failed (${r.status})`);
      return;
    }
    toast.success("Deposit recorded in database");
    setDepositAmount("");
    setDepositOpen(false);
    await refresh();
  };

  const totalBrands =
    stats?.brand_count ?? clients.reduce((sum, c) => sum + c.brands.length, 0);
  const totalClients = stats?.client_count ?? clients.length;
  const depositCount = stats?.deposit_count ?? 0;
  const depositVolume = stats?.deposit_amount_total ?? 0;

  return (
    <div className="min-h-screen bg-dotted p-6 md:p-10">
      <PageTransition className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.HOME)}
          className="mb-6 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => void refresh()}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Refresh from API"}
          </Button>
          <AlertDialog open={addClientOpen} onOpenChange={setAddClientOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" /> Add client
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>New client (database)</AlertDialogTitle>
                <AlertDialogDescription>
                  Creates a row in <code className="text-xs">admin_clients</code>. Brands and deposits reference it via{" "}
                  <code className="text-xs">client_id</code>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-3 py-2">
                <div>
                  <Label htmlFor="nc-name">Name *</Label>
                  <Input
                    id="nc-name"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="nc-code">Client code (optional)</Label>
                  <Input
                    id="nc-code"
                    value={newClientCode}
                    onChange={(e) => setNewClientCode(e.target.value)}
                    placeholder="GT45"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => void handleCreateClient()}>
                  Save to database
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={depositOpen} onOpenChange={setDepositOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Wallet className="w-4 h-4" /> Record deposit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Record deposit (database)</AlertDialogTitle>
                <AlertDialogDescription>
                  Inserts into <code className="text-xs">admin_deposits</code> with <code className="text-xs">client_id</code> (no reverse list on the client doc).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-3 py-2">
                <div>
                  <Label htmlFor="dep-client">Client id *</Label>
                  <select
                    id="dep-client"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={depositClientId}
                    onChange={(e) => setDepositClientId(e.target.value)}
                  >
                    <option value="">— Select client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.clientName} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="dep-amt">Amount *</Label>
                  <Input
                    id="dep-amt"
                    type="number"
                    step="any"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="dep-ccy">Currency</Label>
                  <Input
                    id="dep-ccy"
                    value={depositCurrency}
                    onChange={(e) => setDepositCurrency(e.target.value)}
                    placeholder="USD"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => void handleCreateDeposit()}>
                  Save deposit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

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
            Live data from <code className="text-xs rounded bg-muted px-1">admin_of_admins_be</code> / Mongo
          </motion.p>
          {depositVolume > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Recorded deposit volume:{" "}
              <span className="font-medium text-foreground">
                {depositVolume.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
              </span>{" "}
              (sum of <code className="text-xs">amount</code> fields)
            </p>
          )}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 h-px w-16 bg-primary/40 rounded-full origin-center"
          />
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-12">
          <StaggerItem>
            <KPICard
              icon={Users}
              label="Total clients"
              value={totalClients}
              iconBg="bg-primary/10"
              iconColor="text-primary"
            />
          </StaggerItem>
          <StaggerItem>
            <KPICard
              icon={DollarSign}
              label="Deposit records"
              value={depositCount}
              iconBg="bg-success/10"
              iconColor="text-success"
            />
          </StaggerItem>
          <StaggerItem>
            <KPICard
              icon={Building2}
              label="Total brands"
              value={totalBrands}
              iconBg="bg-warning/10"
              iconColor="text-warning"
            />
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
            <p className="text-sm text-muted-foreground mt-0.5">
              Expand a row — toggle/delete brands writes to the database
            </p>
          </div>
          {loading && clients.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">Loading clients…</p>
          ) : (
            <ClientStatusTable
              clients={clients}
              onToggleBrandDisabled={handleToggleBrandDisabled}
              onDeleteBrand={handleDeleteBrand}
            />
          )}
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
                  type="button"
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
                  type="button"
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
