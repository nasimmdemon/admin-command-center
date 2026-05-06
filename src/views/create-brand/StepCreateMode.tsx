import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Sparkles, Database, ShieldCheck, Zap, HeartHandshake, ChevronDown, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { UseCase } from "@/types/brand-config-per-brand";
import type { SourceBrandSelection } from "@/controllers/useCreateBrand";
import { listClients } from "@/api/services/clients.service";
import { listBrands, getBrand } from "@/api/services/brands.service";

export type CreateMode = "simple" | "same_db" | "same_config";

interface StepCreateModeProps {
  value: CreateMode | null;
  onChange: (v: CreateMode) => void;
  useCase: UseCase | null;
  onUseCaseChange: (v: UseCase) => void;
  sourceBrandSelection: SourceBrandSelection | null;
  onSourceBrandChange: (sel: SourceBrandSelection | null) => void;
}

const CREATE_OPTIONS: {
  id: CreateMode;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  iconBg: string;
  iconColor: string;
  borderSelected: string;
  shadowSelected: string;
  tag: string;
}[] = [
  {
    id: "simple",
    label: "Simple",
    desc: "Start from scratch with the full step-by-step wizard.",
    icon: Sparkles,
    bg: "bg-[hsl(217,91%,97%)]",
    iconBg: "bg-[hsl(217,91%,92%)]",
    iconColor: "text-[hsl(217,80%,55%)]",
    borderSelected: "border-[hsl(217,80%,65%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(217,91%,90%)]",
    tag: "Recommended",
  },
  {
    id: "same_db",
    label: "Same DB (2 + 1)",
    desc: "Clone an existing brand — same database, same config.",
    icon: Database,
    bg: "bg-[hsl(160,60%,96%)]",
    iconBg: "bg-[hsl(160,60%,90%)]",
    iconColor: "text-[hsl(160,65%,38%)]",
    borderSelected: "border-[hsl(160,65%,50%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(160,60%,90%)]",
    tag: "Clone",
  },
  {
    id: "same_config",
    label: "Same Config",
    desc: "Copy config only — new users and domains (up to 2).",
    icon: Copy,
    bg: "bg-[hsl(38,92%,96%)]",
    iconBg: "bg-[hsl(38,92%,90%)]",
    iconColor: "text-[hsl(38,80%,45%)]",
    borderSelected: "border-[hsl(38,80%,55%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(38,92%,90%)]",
    tag: "Partial copy",
  },
];

const USE_CASE_OPTIONS: {
  id: UseCase;
  label: string;
  desc: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  iconBg: string;
  iconColor: string;
  borderSelected: string;
  shadowSelected: string;
  tag: string;
  tagBg: string;
}[] = [
  {
    id: "regulated",
    label: "Regulated",
    desc: "Full compliance mode.",
    detail: "KYC required to trade · Funding locked · WebTrader requires KYC + JWT · UI set: Brand 1/2/3",
    icon: ShieldCheck,
    bg: "bg-[hsl(142,72%,97%)]",
    iconBg: "bg-[hsl(142,72%,91%)]",
    iconColor: "text-[hsl(142,65%,38%)]",
    borderSelected: "border-[hsl(142,65%,48%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(142,72%,91%)]",
    tag: "Compliance",
    tagBg: "bg-[hsl(142,72%,91%)] text-[hsl(142,65%,38%)]",
  },
  {
    id: "unregulated",
    label: "Unregulated",
    desc: "Flexible operation mode.",
    detail: "KYC optional · Funding & dealing editable · WebTrader optional (KYC only) · UI set: Option 1/2",
    icon: Zap,
    bg: "bg-[hsl(38,92%,96%)]",
    iconBg: "bg-[hsl(38,92%,90%)]",
    iconColor: "text-[hsl(38,80%,45%)]",
    borderSelected: "border-[hsl(38,80%,55%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(38,92%,90%)]",
    tag: "Flexible",
    tagBg: "bg-[hsl(38,92%,90%)] text-[hsl(38,80%,45%)]",
  },
  {
    id: "brand_recovery",
    label: "Brand Recovery",
    desc: "Client recovery flow.",
    detail: "No internal dealing · No WebTrader · File Complaint enabled instead",
    icon: HeartHandshake,
    bg: "bg-[hsl(350,80%,97%)]",
    iconBg: "bg-[hsl(350,80%,92%)]",
    iconColor: "text-[hsl(350,65%,55%)]",
    borderSelected: "border-[hsl(350,65%,60%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(350,80%,92%)]",
    tag: "Recovery",
    tagBg: "bg-[hsl(350,80%,92%)] text-[hsl(350,65%,55%)]",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

function OptionCard<T extends string>({
  opt,
  selected,
  onSelect,
}: {
  opt: {
    id: T;
    label: string;
    desc: string;
    detail?: string;
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    iconBg: string;
    iconColor: string;
    borderSelected: string;
    shadowSelected: string;
    tag: string;
    tagBg?: string;
  };
  selected: boolean;
  onSelect: (id: T) => void;
}) {
  const Icon = opt.icon;
  return (
    <motion.button
      variants={cardVariants}
      whileHover={{ scale: 1.025, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(opt.id)}
      className={[
        "relative group rounded-2xl border-2 p-5 text-left transition-all duration-300 cursor-pointer w-full",
        opt.bg,
        selected
          ? `${opt.borderSelected} ${opt.shadowSelected}`
          : "border-transparent hover:border-border/60",
      ].join(" ")}
      style={{
        boxShadow: selected
          ? undefined
          : "0 2px 12px -4px rgba(0,0,0,0.06), 0 6px 20px -6px rgba(0,0,0,0.07)",
      }}
    >
      {selected && (
        <motion.div
          layoutId={`selected-glow-${opt.id}`}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "rgba(255,255,255,0.35)" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <span
        className={[
          "absolute top-3.5 right-3.5 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
          opt.tagBg ?? `${opt.iconBg} ${opt.iconColor}`,
        ].join(" ")}
      >
        {opt.tag}
      </span>

      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${opt.iconBg}`}>
        <Icon className={`w-5 h-5 ${opt.iconColor}`} />
      </div>

      <p className="text-[15px] font-bold text-foreground mb-1 leading-snug">{opt.label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed pr-6">{opt.desc}</p>
      {opt.detail && (
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed pr-6 mt-1.5 italic">
          {opt.detail}
        </p>
      )}

      <div
        className={[
          "absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          selected ? opt.borderSelected : "border-muted-foreground/25",
        ].join(" ")}
      >
        {selected && (
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "currentColor" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </div>
    </motion.button>
  );
}

// ─── Source Brand Picker ──────────────────────────────────────────────────────

interface ClientOption { _id: string; name: string; }
interface BrandOption  { _id: string; name: string; domain?: string; }

function SourceBrandPicker({
  mode,
  selection,
  onChange,
}: {
  mode: "same_db" | "same_config";
  selection: SourceBrandSelection | null;
  onChange: (sel: SourceBrandSelection | null) => void;
}) {
  const [clients, setClients]           = useState<ClientOption[]>([]);
  const [brands, setBrands]             = useState<BrandOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingBrands, setLoadingBrands]   = useState(false);
  const [loadingConfig, setLoadingConfig]   = useState(false);
  const [clientError, setClientError]   = useState<string | null>(null);
  const [brandError, setBrandError]     = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>(selection?.clientId ?? "");
  const [selectedBrandId, setSelectedBrandId]   = useState<string>(selection?.brandId ?? "");

  // Fetch clients on mount
  useEffect(() => {
    setLoadingClients(true);
    setClientError(null);
    listClients()
      .then((res) => {
        const data = (res.data as { data?: ClientOption[] })?.data ?? (res.data as ClientOption[] | undefined) ?? [];
        setClients(Array.isArray(data) ? data : []);
      })
      .catch(() => setClientError("Failed to load clients. Check your connection."))
      .finally(() => setLoadingClients(false));
  }, []);

  // Fetch brands when client changes
  useEffect(() => {
    if (!selectedClientId) { setBrands([]); setSelectedBrandId(""); return; }
    setLoadingBrands(true);
    setBrandError(null);
    setBrands([]);
    setSelectedBrandId("");
    onChange(null);
    listBrands(selectedClientId)
      .then((res) => {
        const data = (res.data as { data?: BrandOption[] })?.data ?? (res.data as BrandOption[] | undefined) ?? [];
        setBrands(Array.isArray(data) ? data : []);
      })
      .catch(() => setBrandError("Failed to load brands for this client."))
      .finally(() => setLoadingBrands(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);

  // Fetch full brand config when brand is selected
  const handleBrandSelect = async (brandId: string) => {
    setSelectedBrandId(brandId);
    if (!brandId) { onChange(null); return; }
    const client = clients.find((c) => c._id === selectedClientId);
    const brand  = brands.find((b)  => b._id === brandId);
    if (!client || !brand) return;
    setLoadingConfig(true);
    try {
      const res = await getBrand(brandId);
      const raw = (res.data as { data?: { config?: Record<string, unknown> } })?.data ?? (res.data as { config?: Record<string, unknown> } | undefined);
      const config = (raw as { config?: Record<string, unknown> } | undefined)?.config;
      onChange({
        clientId: client._id,
        clientName: client.name,
        brandId: brand._id ?? brandId,
        brandName: brand.name,
        brandConfig: config,
      });
    } catch {
      setBrandError("Could not load config for this brand.");
    } finally {
      setLoadingConfig(false);
    }
  };

  const modeLabel = mode === "same_db" ? "Same DB" : "Same Config";
  const modeColor = mode === "same_db" ? "hsl(160,65%,38%)" : "hsl(38,80%,45%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-5 space-y-4"
      style={{ boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: modeColor }}
        />
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: modeColor }}>
          {modeLabel} — Select Source Brand
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed -mt-1">
        {mode === "same_db"
          ? "Choose which existing brand to clone the database from. Its configuration will be pre-filled into this new brand (sensitive keys excluded)."
          : "Choose which brand's configuration to copy. New brand will have its own database — only the settings are carried over."}
      </p>

      {/* Client selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">Client</label>
        {clientError ? (
          <div className="flex items-center gap-2 text-xs text-destructive px-3 py-2 rounded-xl border border-destructive/30 bg-destructive/5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {clientError}
          </div>
        ) : (
          <div className="relative">
            <select
              id="source-client-select"
              className="w-full appearance-none rounded-xl border border-border/50 bg-background text-sm px-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              value={selectedClientId}
              disabled={loadingClients}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">
                {loadingClients ? "Loading clients…" : "— Select a client —"}
              </option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
              {loadingClients
                ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
              }
            </div>
          </div>
        )}
      </div>

      {/* Brand selector */}
      <AnimatePresence>
        {selectedClientId && (
          <motion.div
            key="brand-select"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden space-y-1.5"
          >
            <label className="text-xs font-semibold text-muted-foreground">Brand</label>
            {brandError ? (
              <div className="flex items-center gap-2 text-xs text-destructive px-3 py-2 rounded-xl border border-destructive/30 bg-destructive/5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {brandError}
              </div>
            ) : (
              <div className="relative">
                <select
                  id="source-brand-select"
                  className="w-full appearance-none rounded-xl border border-border/50 bg-background text-sm px-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  value={selectedBrandId}
                  disabled={loadingBrands || loadingConfig}
                  onChange={(e) => void handleBrandSelect(e.target.value)}
                >
                  <option value="">
                    {loadingBrands ? "Loading brands…" : brands.length === 0 ? "No brands found" : "— Select a brand —"}
                  </option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}{b.domain ? ` (${b.domain})` : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                  {loadingBrands || loadingConfig
                    ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Config loaded badge */}
      <AnimatePresence>
        {selection?.brandConfig && (
          <motion.div
            key="config-badge"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-700 font-medium">
              Config loaded from <strong>{selection.brandName}</strong> — will be pre-filled (API keys &amp; device data excluded)
            </p>
          </motion.div>
        )}
        {selection && !selection.brandConfig && selectedBrandId && !loadingConfig && (
          <motion.div
            key="no-config-badge"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              This brand has no saved config yet — the wizard will start with defaults.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const StepCreateMode = ({
  value,
  onChange,
  useCase,
  onUseCaseChange,
  sourceBrandSelection,
  onSourceBrandChange,
}: StepCreateModeProps) => {
  const showPicker = value === "same_db" || value === "same_config";

  return (
    <div className="space-y-10">
      {/* ── Section 1: Create Mode ── */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Create Brand</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Choose how you'd like to set up your new brand.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {CREATE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              opt={opt}
              selected={value === opt.id}
              onSelect={onChange}
            />
          ))}
        </motion.div>

        {/* Source brand picker (slides in for clone modes) */}
        <AnimatePresence>
          {showPicker && (
            <SourceBrandPicker
              key="source-picker"
              mode={value as "same_db" | "same_config"}
              selection={sourceBrandSelection}
              onChange={onSourceBrandChange}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Use Case
          </span>
        </div>
      </div>

      {/* ── Section 2: Use Case ── */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-foreground tracking-tight">Select Use Case</h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            The use case defines which features are enforced, locked, or available for this brand. This
            cannot be changed after setup without resetting affected steps.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {USE_CASE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              opt={opt}
              selected={useCase === opt.id}
              onSelect={onUseCaseChange}
            />
          ))}
        </motion.div>

        {useCase && useCase !== "regulated" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
          >
            <span className="text-amber-500 text-base mt-0.5">⚠</span>
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Note:</strong> You have selected a{" "}
              <strong>non-regulated</strong> use case. Features like KYC enforcement, funding
              restrictions, and WebTrader gating will be relaxed. Ensure this matches your
              compliance obligations before proceeding.
            </p>
          </motion.div>
        )}

        {useCase === "brand_recovery" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
          >
            <span className="text-rose-500 text-base mt-0.5">🔴</span>
            <p className="text-xs text-rose-700 leading-relaxed">
              <strong>Brand Recovery mode:</strong> Internal dealing and WebTrader will be
              disabled. The <em>File Complaint</em> feature will replace trading functionality
              in the client zone.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
