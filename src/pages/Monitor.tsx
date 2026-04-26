import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/PageTransition";
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
    const r = await brandsService.updateBrand(brand.id, { disabled: true });
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
    <div className="min-h-screen bg-dotted w-full flex flex-col">
      <PageTransition className="flex-1 w-full flex flex-col">

        {/* ── Sticky top nav ── */}
        <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 md:px-8 border-b border-border/40 bg-white/70 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.HOME)}
            className="text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => void refresh()}
              className="gap-1.5 rounded-xl h-9"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading…" : "Refresh"}
            </Button>

            {/* ── Add client dialog ── */}
            <AlertDialog open={addClientOpen} onOpenChange={setAddClientOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-9">
                  <UserPlus className="w-3.5 h-3.5" /> Add client
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md rounded-2xl border-border/40 shadow-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">New client</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-sm">
                    Creates a row in <code className="text-xs bg-muted px-1 rounded">admin_clients</code>. Brands and deposits reference it via <code className="text-xs bg-muted px-1 rounded">client_id</code>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="nc-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name *</Label>
                    <Input
                      id="nc-name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Acme Corp"
                      className="rounded-xl border-border/50 focus:border-primary/50 h-11"
                      onKeyDown={(e) => { if (e.key === "Enter") void handleCreateClient(); }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nc-code" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client code <span className="text-muted-foreground/60 normal-case">(optional)</span></Label>
                    <Input
                      id="nc-code"
                      value={newClientCode}
                      onChange={(e) => setNewClientCode(e.target.value)}
                      placeholder="GT45"
                      className="rounded-xl border-border/50 focus:border-primary/50 h-11"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => void handleCreateClient()}
                    className="rounded-xl bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(250,70%,62%)] border-0 hover:opacity-90"
                  >
                    Save to database
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* ── Record deposit dialog ── */}
            <AlertDialog open={depositOpen} onOpenChange={setDepositOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-9">
                  <Wallet className="w-3.5 h-3.5" /> Record deposit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md rounded-2xl border-border/40 shadow-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Record deposit</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-sm">
                    Inserts into <code className="text-xs bg-muted px-1 rounded">admin_deposits</code> with <code className="text-xs bg-muted px-1 rounded">client_id</code>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="dep-client" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client *</Label>
                    <select
                      id="dep-client"
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  <div className="space-y-1.5">
                    <Label htmlFor="dep-amt" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount *</Label>
                    <Input
                      id="dep-amt"
                      type="number"
                      step="any"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="1000"
                      className="rounded-xl border-border/50 focus:border-primary/50 h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dep-ccy" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Currency</Label>
                    <Input
                      id="dep-ccy"
                      value={depositCurrency}
                      onChange={(e) => setDepositCurrency(e.target.value)}
                      placeholder="USD"
                      className="rounded-xl border-border/50 focus:border-primary/50 h-11"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => void handleCreateDeposit()}
                    className="rounded-xl bg-gradient-to-r from-[hsl(160,65%,38%)] to-[hsl(190,75%,42%)] border-0 hover:opacity-90"
                  >
                    Save deposit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* ── Hero header ── */}
        <div className="px-4 md:px-10 lg:px-16 xl:px-24 pt-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(217,91%,97%) 0%, hsl(250,80%,97%) 50%, hsl(160,60%,96%) 100%)",
              boxShadow: "0 4px 32px -8px rgba(100,120,240,0.12)",
            }}
          >
            <div className="px-8 py-10 md:px-14 md:py-12 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-border/30">
                <Activity className="w-7 h-7 text-primary" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[hsl(217,80%,60%)] mb-1.5">
                  Live Dashboard
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-1.5">
                  Monitor &amp; Shut Down
                </h1>
                <p className="text-base text-muted-foreground">
                  Live data from <code className="text-xs rounded-md bg-white/80 border border-border/30 px-1.5 py-0.5">admin_of_admins_be</code> / Mongo
                  {depositVolume > 0 && (
                    <> · Total deposits: <span className="font-semibold text-foreground">{depositVolume.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</span></>
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-10">
            {[
              { icon: Users, label: "Total clients", value: totalClients, iconBg: "bg-primary/10", iconColor: "text-primary", delay: 0.1 },
              { icon: DollarSign, label: "Deposit records", value: depositCount, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600", delay: 0.18 },
              { icon: Building2, label: "Total brands", value: totalBrands, iconBg: "bg-amber-500/10", iconColor: "text-amber-600", delay: 0.26 },
            ].map(({ icon, label, value, iconBg, iconColor, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <KPICard icon={icon} label={label} value={value} iconBg={iconBg} iconColor={iconColor} />
              </motion.div>
            ))}
          </div>

          {/* ── Client Status Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-border/40 shadow-widget overflow-hidden mb-8 bg-card"
          >
            <div className="px-6 py-5 border-b border-border/40 bg-gradient-to-r from-[hsl(217,91%,98%)] to-[hsl(250,80%,98%)]">
              <h2 className="font-bold text-foreground text-lg">Client Status</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Expand a row — toggle/delete brands writes to the database
              </p>
            </div>
            {loading && clients.length === 0 ? (
              <div className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-3"
                />
                <p className="text-muted-foreground text-sm">Loading clients…</p>
              </div>
            ) : (
              <ClientStatusTable
                clients={clients}
                onToggleBrandDisabled={handleToggleBrandDisabled}
                onDeleteBrand={handleDeleteBrand}
              />
            )}
          </motion.div>

          {/* ── Quick Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Quick Actions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">

              {/* Restart */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.button
                    type="button"
                    whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.12 } }}
                    className="w-full text-left rounded-2xl border bg-gradient-to-br from-[hsl(217,91%,99%)] to-[hsl(250,80%,98%)] p-6 flex flex-col gap-4 group cursor-pointer border-border/40 shadow-widget hover:shadow-card hover:border-primary/25 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 shadow-soft">
                        <RefreshCw className="w-6 h-6 text-primary" strokeWidth={1.75} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground text-base leading-tight">Restart All Services</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">Restart all running services. There may be brief downtime.</p>
                    </div>
                  </motion.button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restart All Services?</AlertDialogTitle>
                    <AlertDialogDescription>This will restart all running services. There may be brief downtime.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl">Restart</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Emergency Shutdown */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.button
                    type="button"
                    whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.12 } }}
                    className="w-full text-left rounded-2xl border bg-gradient-to-br from-[hsl(0,91%,99%)] to-[hsl(15,80%,98%)] p-6 flex flex-col gap-4 group cursor-pointer border-border/40 shadow-widget hover:shadow-card hover:border-destructive/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive shadow-soft">
                        <Power className="w-6 h-6" strokeWidth={1.75} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-destructive group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground text-base leading-tight">Emergency Shutdown</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">Immediately shut down ALL services and brands. Cannot be easily undone.</p>
                    </div>
                  </motion.button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Emergency Shutdown?</AlertDialogTitle>
                    <AlertDialogDescription>This will immediately shut down ALL services and brands. This action cannot be easily undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Shut Down</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          </motion.div>
        </div>

      </PageTransition>
    </div>
  );
};

export default Monitor;
