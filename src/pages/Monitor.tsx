import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/PageTransition";
import { CountUp } from "../components/CountUp";
import {
  ArrowLeft, Users, DollarSign, Building2, RefreshCw, Power, AlertTriangle,
  CheckCircle2, XCircle, Search, Info, Cpu, HardDrive, Wifi, RotateCw, Zap,
  ChevronDown, ChevronUp, Eye, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data
const clients = [
  { id: 1, name: "maiclptd", clientName: "GT45", status: "Good", paid: "12K" },
  { id: 2, name: "johnwk", clientName: "BX12", status: "Good", paid: "8.5K" },
  { id: 3, name: "sarahm", clientName: "LP78", status: "Bad", paid: "2.1K" },
  { id: 4, name: "alexfr", clientName: "NQ33", status: "Good", paid: "15K" },
  { id: 5, name: "robertl", clientName: "DW91", status: "Bad", paid: "500" },
];

const activeBrands = [
  { name: "Brand Alpha", status: "Online", domain: "alpha.com" },
  { name: "Brand Beta", status: "Offline", domain: "beta.com" },
  { name: "Brand Gamma", status: "Warning", domain: "gamma.com" },
  { name: "Brand Delta", status: "Online", domain: "delta.com" },
];

const recentAlerts = [
  { type: "error", message: "Brand Beta went offline", time: "2 min ago" },
  { type: "warning", message: "High memory usage on Brand Gamma", time: "15 min ago" },
  { type: "info", message: "Brand Alpha auto-scaled successfully", time: "1 hour ago" },
  { type: "info", message: "Daily backup completed", time: "3 hours ago" },
];

const mockLogs = [
  { level: "INFO", message: "Service started on port 3000", time: "14:32:01" },
  { level: "WARN", message: "Rate limit approaching for Brand Gamma", time: "14:31:45" },
  { level: "ERROR", message: "Connection timeout to Brand Beta DB", time: "14:30:22" },
  { level: "INFO", message: "Health check passed for Brand Alpha", time: "14:29:58" },
  { level: "INFO", message: "Cache cleared successfully", time: "14:28:10" },
];

const KPICard = ({ icon: Icon, label, value, suffix = "", color }: { icon: any; label: string; value: number; suffix?: string; color: string }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.3 }}
    className="bg-card rounded-xl border p-5 shadow-sm"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <CountUp end={value} suffix={suffix} className="text-3xl font-bold text-foreground" />
  </motion.div>
);

const Monitor = () => {
  const navigate = useNavigate();
  const [logFilter, setLogFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  const filteredLogs = mockLogs.filter((l) =>
    !logFilter || l.message.toLowerCase().includes(logFilter.toLowerCase()) || l.level.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            Good Day, Worker Name
          </motion.h1>
          <p className="text-muted-foreground mt-1">Here's your system overview</p>
        </div>

        {/* KPI Cards */}
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

        {/* Client Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-card rounded-xl border shadow-sm mb-6"
        >
          <div className="p-5 border-b">
            <h2 className="font-semibold text-foreground">Client Status</h2>
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Client Name</th>
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
                    <td className="p-4 font-medium text-foreground">{c.name}</td>
                    <td className="p-4 text-muted-foreground">{c.clientName}</td>
                    <td className="p-4">
                      <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{c.paid}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">Close</Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden p-4 space-y-3">
            {clients.map((c) => (
              <div key={c.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className={c.status === "Good" ? "badge-success" : "badge-danger"}>{c.status}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{c.clientName}</span>
                  <span>{c.paid}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs flex-1">Close</Button>
                  <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
            <h2 className="font-semibold text-foreground">System Health</h2>
            {[
              { label: "CPU", value: 45, icon: Cpu, color: "bg-primary" },
              { label: "Memory", value: 62, icon: HardDrive, color: "bg-warning" },
              { label: "Network", value: 75, icon: Wifi, suffix: "120 Mbps", color: "bg-success" },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  <span className="font-medium text-foreground">{item.suffix || `${item.value}%`}</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Active Brands */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-foreground mb-4">Active Brands</h2>
            <div className="space-y-3">
              {activeBrands.map((b) => (
                <div key={b.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      b.status === "Online" ? "bg-success" : b.status === "Offline" ? "bg-destructive" : "bg-warning"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.domain}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><RotateCw className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Power className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-foreground mb-4">Recent Alerts</h2>
            <div className="space-y-2">
              {recentAlerts.map((a, i) => dismissedAlerts.includes(i) ? null : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`flex items-start gap-3 rounded-lg p-3 text-sm ${
                    a.type === "error" ? "bg-destructive/5" : a.type === "warning" ? "bg-warning/5" : "bg-primary/5"
                  }`}
                >
                  {a.type === "error" ? <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" /> :
                   a.type === "warning" ? <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" /> :
                   <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                  <button onClick={() => setDismissedAlerts([...dismissedAlerts, i])} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
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

              <Button variant="outline" className="w-full justify-start gap-2">
                <Zap className="w-4 h-4" /> Refresh Status
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics (simple bars) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">API Response Time (ms)</p>
              <div className="space-y-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                  const val = [120, 95, 145, 88, 110][i];
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-8">{day}</span>
                      <div className="flex-1 h-5 bg-secondary rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-primary/70 rounded"
                          initial={{ width: 0 }}
                          animate={{ width: `${(val / 200) * 100}%` }}
                          transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-10 text-right">{val}ms</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">Error Rate by Brand</p>
              <div className="space-y-2">
                {activeBrands.map((b, i) => {
                  const val = [2, 15, 8, 1][i];
                  return (
                    <div key={b.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20 truncate">{b.name}</span>
                      <div className="flex-1 h-5 bg-secondary rounded overflow-hidden">
                        <motion.div
                          className={`h-full rounded ${val > 10 ? "bg-destructive/70" : val > 5 ? "bg-warning/70" : "bg-success/70"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(val / 20) * 100}%` }}
                          transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-8 text-right">{val}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Log Viewer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.4 }} className="bg-card rounded-xl border shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Log Viewer</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Auto-refresh</Label>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search logs..." value={logFilter} onChange={(e) => setLogFilter(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div className="rounded-lg border bg-foreground/[0.02] font-mono text-xs divide-y">
            {filteredLogs.map((l, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <span className="text-muted-foreground w-16 flex-shrink-0">{l.time}</span>
                <span className={`w-12 flex-shrink-0 font-semibold ${
                  l.level === "ERROR" ? "text-destructive" : l.level === "WARN" ? "text-warning" : "text-muted-foreground"
                }`}>{l.level}</span>
                <span className="text-foreground">{l.message}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </PageTransition>
    </div>
  );
};

export default Monitor;
