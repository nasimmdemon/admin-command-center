import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Info, MapPin, Layers, AlertTriangle, CheckCircle2, Phone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryInput } from "@/components/CountryInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InteractiveWorldMap from "@/components/brand-wizard/InteractiveWorldMap";
import { ProviderOptionCard } from "./ProviderOptionCard";
import { VoipDeskConfigSection } from "./VoipDeskConfigSection";
import { isValidISOCountryCode, normalizeCountryInputToISO } from "@/utils/countryCodes";
import { mergeDeskCoverageMaps, mergeWorkerCoverageMaps } from "@/types/voip-desk";
import type { VoipWorkerConfigEntry } from "@/types/worker-comms";
import { syncVoipWorkerConfigs } from "@/types/worker-comms";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VoipProviderSectionProps {
  provider: "voicex" | "other" | null;
  onProviderChange: (v: "voicex" | "other" | null) => void;
  phoneNumbers: string;
  onPhoneNumbersChange: (v: string) => void;
  countries: string;
  onCountriesChange: (v: string) => void;
  coverageMap: Record<string, string[]>;
  onCoverageMapChange: (m: Record<string, string[]>) => void;
  originCountryInput: string;
  onOriginCountryInputChange: (v: string) => void;
  addOutboundFrom: string;
  onAddOutboundFromChange: (v: string) => void;
  outboundCountryInput: string;
  onOutboundCountryInputChange: (v: string) => void;
  providersMapData: string;
  onProvidersMapDataChange: (v: string) => void;
  voipAllocationModes?: { byBrand: boolean; byDesk: boolean; byWorker: boolean };
  onVoipAllocationModesChange?: (v: { byBrand: boolean; byDesk: boolean; byWorker: boolean }) => void;
  voipDeskConfigs?: import("@/types/voip-desk").VoipDeskConfig[];
  onVoipDeskConfigsChange?: (v: import("@/types/voip-desk").VoipDeskConfig[]) => void;
  voipQaDefault?: boolean;
  onVoipQaDefaultChange?: (v: boolean) => void;
  voipWorkerConfigs?: VoipWorkerConfigEntry[];
  onVoipWorkerConfigsChange?: (v: VoipWorkerConfigEntry[]) => void;
  /** Workers from CSV; filtered by current brand when currentBrandName is set */
  uploadedWorkers?: Array<{ email: string; full_name: string; valid: boolean; brandName?: string }>;
  currentBrandName?: string;
}

export const VoipProviderSection = ({
  provider,
  onProviderChange,
  phoneNumbers,
  onPhoneNumbersChange,
  countries,
  onCountriesChange,
  coverageMap,
  onCoverageMapChange,
  originCountryInput,
  onOriginCountryInputChange,
  addOutboundFrom,
  onAddOutboundFromChange,
  outboundCountryInput,
  onOutboundCountryInputChange,
  providersMapData,
  onProvidersMapDataChange,
  voipAllocationModes = { byBrand: true, byDesk: false, byWorker: false },
  onVoipAllocationModesChange,
  voipDeskConfigs = [],
  onVoipDeskConfigsChange,
  voipQaDefault = false,
  onVoipQaDefaultChange,
  voipWorkerConfigs = [],
  onVoipWorkerConfigsChange,
  uploadedWorkers = [],
  currentBrandName = "",
}: VoipProviderSectionProps) => {
  const brandNorm = currentBrandName.trim().toLowerCase();
  const validWorkersForBrand = useMemo(() => {
    return uploadedWorkers.filter(
      (w) =>
        w.valid &&
        (!brandNorm || (w.brandName?.trim().toLowerCase() ?? "") === brandNorm)
    );
  }, [uploadedWorkers, brandNorm]);

  const voipWorkerSyncKey = useMemo(
    () => validWorkersForBrand.map((w) => w.email).sort().join("|"),
    [validWorkersForBrand]
  );
  const prevVoipSyncKey = useRef<string | null>(null);
  const voipConfigsRef = useRef(voipWorkerConfigs);
  voipConfigsRef.current = voipWorkerConfigs;

  useEffect(() => {
    if (!onVoipWorkerConfigsChange) return;
    if (prevVoipSyncKey.current === voipWorkerSyncKey) return;
    prevVoipSyncKey.current = voipWorkerSyncKey;
    const next = syncVoipWorkerConfigs(
      validWorkersForBrand.map((w) => ({ email: w.email, full_name: w.full_name })),
      voipConfigsRef.current
    );
    onVoipWorkerConfigsChange(next);
  }, [voipWorkerSyncKey, validWorkersForBrand, onVoipWorkerConfigsChange]);

  const patchVoipWorker = (email: string, patch: Partial<VoipWorkerConfigEntry>) => {
    onVoipWorkerConfigsChange?.(
      voipWorkerConfigs.map((w) =>
        w.workerEmail.toLowerCase() === email.toLowerCase() ? { ...w, ...patch } : w
      )
    );
  };

  const originCountries = Object.keys(coverageMap);

  const addOriginCountry = (code: string) => {
    if (!coverageMap[code]) {
      const next = { ...coverageMap, [code]: [code] };
      onCoverageMapChange(next);
      onProvidersMapDataChange(JSON.stringify(next, null, 2));
    }
  };

  const handleCountryToggle = (countryCode: string) => {
    const code = countryCode.toUpperCase().trim();
    if (!isValidISOCountryCode(code)) return;
    if (coverageMap[code]) removeOrigin(code);
    else addOriginCountry(code);
  };

  const addOrigin = () => {
    const code = originCountryInput ? normalizeCountryInputToISO(originCountryInput) : null;
    if (code && !coverageMap[code]) {
      const next = { ...coverageMap, [code]: [code] };
      onCoverageMapChange(next);
      onProvidersMapDataChange(JSON.stringify(next, null, 2));
      onOriginCountryInputChange("");
    }
  };

  const addOutbound = () => {
    const code = outboundCountryInput ? normalizeCountryInputToISO(outboundCountryInput) : null;
    const from = addOutboundFrom;
    if (code && from && coverageMap[from]) {
      const current = coverageMap[from] || [from];
      if (!current.includes(code)) {
        const next = { ...coverageMap, [from]: [...current, code] };
        onCoverageMapChange(next);
        onProvidersMapDataChange(JSON.stringify(next, null, 2));
        onOutboundCountryInputChange("");
      }
    }
  };

  const removeOrigin = (code: string) => {
    const next = { ...coverageMap };
    delete next[code];
    onCoverageMapChange(next);
    onProvidersMapDataChange(JSON.stringify(next, null, 2));
    if (addOutboundFrom === code) onAddOutboundFromChange("");
  };

  const removeOutboundFromOrigin = (fromCode: string, toCode: string) => {
    const next = { ...coverageMap };
    const arr = (next[fromCode] || []).filter((c) => c !== toCode);
    if (arr.length === 0) delete next[fromCode];
    else next[fromCode] = arr;
    onCoverageMapChange(next);
    onProvidersMapDataChange(JSON.stringify(next, null, 2));
  };

  const clearCoverage = () => {
    onCoverageMapChange({});
    onProvidersMapDataChange("");
    onCountriesChange("0");
    onPhoneNumbersChange("0");
    onAddOutboundFromChange("");
  };

  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground text-xs uppercase tracking-wide">VoIP Provider</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ProviderOptionCard
          label="VoiceX"
          sublabel="VoIP communication service"
          selected={provider === "voicex"}
          onClick={() => onProviderChange(provider === "voicex" ? null : "voicex")}
        />
        <ProviderOptionCard
          label="Other (external)"
          sublabel="Connect your own provider"
          selected={provider === "other"}
          onClick={() => onProviderChange(provider === "other" ? null : "other")}
        />
      </div>
      {provider === "other" && (
        <div className="rounded-xl border border-dashed border-border/60 p-4 bg-tint-blue/50">
          <p className="text-sm text-muted-foreground mb-2">VoIP provider is not ours — use our docs to connect external provider.</p>
          <Link to="/providers?tab=voip" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
            <ExternalLink className="w-4 h-4" />
            View provider docs (VoIP)
          </Link>
        </div>
      )}
      {provider === "voicex" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-4">
          {onVoipAllocationModesChange && (
            <div className="rounded-xl border border-border/40 p-4 bg-muted/5 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Destination allocation</Label>
              </div>
              <p className="text-xs text-muted-foreground">Enable any combination. All enabled sources contribute to the union of destinations.</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={voipAllocationModes.byBrand}
                    onCheckedChange={(v) => onVoipAllocationModesChange({ ...voipAllocationModes, byBrand: v })}
                  />
                  <Label className="text-sm cursor-pointer">By brand</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={voipAllocationModes.byDesk}
                    onCheckedChange={(v) => onVoipAllocationModesChange({ ...voipAllocationModes, byDesk: v })}
                  />
                  <Label className="text-sm cursor-pointer">By desk</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={voipAllocationModes.byWorker}
                    onCheckedChange={(v) => onVoipAllocationModesChange({ ...voipAllocationModes, byWorker: v })}
                  />
                  <Label className="text-sm cursor-pointer">By worker</Label>
                </div>
              </div>
            </div>
          )}

          {onVoipQaDefaultChange && (
            <div className="flex items-center justify-between rounded-xl border border-primary/20 p-4 bg-primary/5">
              <div>
                <Label className="text-sm font-medium">QA default: 1 number, all origins → all destinations</Label>
                <p className="text-xs text-muted-foreground mt-0.5">QA can call all desks regardless of desk config.</p>
              </div>
              <Switch checked={voipQaDefault} onCheckedChange={onVoipQaDefaultChange} />
            </div>
          )}

          {voipAllocationModes.byBrand && (
            <div className="space-y-4 rounded-xl border border-border/40 p-4 bg-card">
              <Label className="text-sm font-medium">By brand</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/50 p-3 bg-card shadow-widget">
              <p className="text-xs text-muted-foreground mb-1">Phone Numbers</p>
              <Input type="number" value={phoneNumbers} onChange={(e) => onPhoneNumbersChange(e.target.value)} className="h-8 text-lg font-semibold" min="0" />
            </div>
            <div className="rounded-xl border border-border/50 p-3 bg-card shadow-widget">
              <p className="text-xs text-muted-foreground mb-1">Countries</p>
              <Input type="number" value={countries} onChange={(e) => onCountriesChange(e.target.value)} className="h-8 text-lg font-semibold" min="0" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">VoIP Coverage Map</Label>
            </div>
            <p className="text-xs text-muted-foreground">Click countries on the map to add/remove origins. Blue = origins (from), Red = destinations (to). Lines show connections.</p>
            <div className="rounded-xl border border-border/50 p-4 bg-muted/30 min-h-[320px] max-h-[420px] overflow-hidden flex items-center justify-center shadow-widget">
              <div className="w-full h-full min-h-[280px] flex items-center justify-center">
              <InteractiveWorldMap
                variant="select"
                selectedCountries={Object.keys(coverageMap).filter((c) => isValidISOCountryCode(c))}
                onCountryToggle={handleCountryToggle}
                coverageMap={coverageMap}
                className="w-full h-full"
              />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-3">
              <div>
                <Label className="text-sm font-medium text-foreground">From (origin)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Where calls can originate</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {originCountries.map((country) => (
                  <motion.span
                    key={country}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-500/20"
                  >
                    {country}
                    <button onClick={() => removeOrigin(country)} className="hover:text-blue-600/70 dark:hover:text-blue-400/70 ml-1">×</button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2">
                <CountryInput
                  value={originCountryInput}
                  onChange={onOriginCountryInputChange}
                  placeholder="Search country…"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addOrigin()}
                  onSelect={(code) => code && addOriginCountry(code)}
                />
                <Button variant="outline" size="sm" onClick={addOrigin}>Add</Button>
              </div>
            </div>
            <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-3">
              <div>
                <Label className="text-sm font-medium text-foreground">To (destination)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Countries each origin can call to</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={addOutboundFrom || undefined} onValueChange={onAddOutboundFromChange}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {originCountries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-xs">→</span>
                <CountryInput
                  value={outboundCountryInput}
                  onChange={onOutboundCountryInputChange}
                  placeholder="Add destination…"
                  className="flex-1 min-w-[120px]"
                  onKeyDown={(e) => e.key === "Enter" && addOutbound()}
                  onSelect={(code) => {
                    if (code && addOutboundFrom) {
                      const current = coverageMap[addOutboundFrom] || [addOutboundFrom];
                      if (!current.includes(code)) {
                        const next = { ...coverageMap, [addOutboundFrom]: [...current, code] };
                        onCoverageMapChange(next);
                        onProvidersMapDataChange(JSON.stringify(next, null, 2));
                        onOutboundCountryInputChange("");
                      }
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={addOutbound} disabled={!addOutboundFrom}>Add</Button>
              </div>
              {addOutboundFrom && coverageMap[addOutboundFrom] && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(coverageMap[addOutboundFrom] || []).map((country) => (
                    <motion.span
                      key={country}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium border border-red-500/20"
                    >
                      {country}
                      <button onClick={() => removeOutboundFromOrigin(addOutboundFrom, country)} className="hover:text-red-600/70 dark:hover:text-red-400/70 ml-0.5">×</button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-tint-blue shadow-widget">
            <div className="flex gap-2 items-start">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Use the map to select origins. Then pick an origin and add destinations. Blue = origins, Red = destinations.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearCoverage} className="text-destructive hover:text-destructive">Clear all</Button>
          </div>
            </div>
          )}

          {voipAllocationModes.byDesk && onVoipDeskConfigsChange && (
            <div className="space-y-4 rounded-xl border border-border/40 p-4 bg-card">
              <Label className="text-sm font-medium">By desk</Label>
              <VoipDeskConfigSection
                desks={voipDeskConfigs}
                onDesksChange={onVoipDeskConfigsChange}
                voipQaDefault={voipQaDefault}
              />
              {voipDeskConfigs.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Coverage preview (teal = origins, amber = destinations)</Label>
                  <div className="rounded-xl border border-border/50 p-4 bg-muted/30 min-h-[280px] overflow-hidden">
                    <InteractiveWorldMap
                      variant="select"
                      selectedCountries={[]}
                      onCountryToggle={() => {}}
                      coverageLayers={[
                        {
                          coverageMap: mergeDeskCoverageMaps(voipDeskConfigs),
                          source: "desk",
                          originColor: "#0d9488",
                          destColor: "#f59e0b",
                        },
                      ]}
                      className="w-full h-full min-h-[240px]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {voipAllocationModes.byWorker && (
            <div className="space-y-4 rounded-xl border border-border/40 p-4 bg-card">
              <Label className="text-sm font-medium">By worker</Label>
              <p className="text-xs text-muted-foreground">
                Workers for <strong>{currentBrandName || "this brand"}</strong> from your CSV. Include or exclude each worker; assign a phone number when the provider provisions it — or mark error.
              </p>
              {validWorkersForBrand.length === 0 ? (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Upload workers for this brand first (Upload Workers step). Then configure per-worker VoIP here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[min(380px,55vh)] pr-3">
                  <div className="space-y-3">
                    {voipWorkerConfigs
                      .filter((c) =>
                        validWorkersForBrand.some((w) => w.email.toLowerCase() === c.workerEmail.toLowerCase())
                      )
                      .map((w) => (
                        <div
                          key={w.workerEmail}
                          className="rounded-xl border border-border/40 p-4 bg-muted/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">
                                {validWorkersForBrand.find((x) => x.email.toLowerCase() === w.workerEmail.toLowerCase())
                                  ?.full_name || w.workerEmail}
                              </p>
                              <p className="text-xs text-muted-foreground">{w.workerEmail}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">Include</Label>
                              <Switch
                                checked={w.included !== false}
                                onCheckedChange={(v) => patchVoipWorker(w.workerEmail, { included: v })}
                              />
                            </div>
                          </div>
                          {w.included !== false && (
                            <div className="space-y-2 border-t border-border/40 pt-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <Label className="text-xs">Phone number (VoIP line)</Label>
                                <Input
                                  className="h-8 max-w-[220px] text-sm"
                                  placeholder="+1…"
                                  value={w.phoneNumber ?? ""}
                                  onChange={(e) =>
                                    patchVoipWorker(w.workerEmail, { phoneNumber: e.target.value })
                                  }
                                />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  className="text-xs px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                  onClick={() =>
                                    patchVoipWorker(w.workerEmail, {
                                      voipStatus: "ready",
                                      errorMessage: undefined,
                                    })
                                  }
                                >
                                  Mark ready (demo)
                                </button>
                                <button
                                  type="button"
                                  className="text-xs px-2 py-1 rounded-md bg-destructive/15 text-destructive"
                                  onClick={() =>
                                    patchVoipWorker(w.workerEmail, {
                                      voipStatus: "error",
                                      errorMessage: "Number provisioning failed (demo)",
                                    })
                                  }
                                >
                                  Mark error (demo)
                                </button>
                                <button
                                  type="button"
                                  className="text-xs px-2 py-1 rounded-md border border-border/60"
                                  onClick={() =>
                                    patchVoipWorker(w.workerEmail, {
                                      voipStatus: "pending",
                                      errorMessage: undefined,
                                    })
                                  }
                                >
                                  Reset pending
                                </button>
                              </div>
                              {w.voipStatus === "ready" && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  VoIP line ready for this worker.
                                </div>
                              )}
                              {w.voipStatus === "error" && (
                                <div className="flex items-start gap-1.5 text-xs text-destructive">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  {w.errorMessage || "Error"}
                                </div>
                              )}
                              {w.voipStatus === "pending" && (
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                  Pending — enter number when provider assigns it.
                                </p>
                              )}
                            </div>
                          )}
                          {w.included === false && (
                            <p className="text-xs text-muted-foreground italic">Excluded from per-worker VoIP.</p>
                          )}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
              {voipWorkerConfigs && voipWorkerConfigs.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Coverage preview</Label>
                  <div className="rounded-xl border border-border/50 p-4 bg-muted/30 min-h-[280px] overflow-hidden">
                    <InteractiveWorldMap
                      variant="select"
                      selectedCountries={Object.keys(mergeWorkerCoverageMaps(voipWorkerConfigs)).filter((c) => isValidISOCountryCode(c))}
                      onCountryToggle={() => {}}
                      coverageMap={mergeWorkerCoverageMaps(voipWorkerConfigs)}
                      className="w-full h-full min-h-[240px]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {(voipAllocationModes.byBrand || voipAllocationModes.byDesk || voipAllocationModes.byWorker) && (
            <div className="space-y-2 rounded-xl border border-border/40 p-4 bg-muted/5">
              <Label className="text-sm font-medium">Combined coverage (all enabled sources)</Label>
              <p className="text-xs text-muted-foreground">Brand: blue origins / red dest. Desk: teal / amber. Worker: violet / green.</p>
              <div className="rounded-xl border border-border/50 p-4 bg-muted/30 min-h-[280px] overflow-hidden">
                <InteractiveWorldMap
                  variant="select"
                  selectedCountries={[]}
                  onCountryToggle={() => {}}
                  coverageLayers={[
                    ...(voipAllocationModes.byWorker && voipWorkerConfigs?.length
                      ? [{ coverageMap: mergeWorkerCoverageMaps(voipWorkerConfigs), source: "worker" as const, originColor: "#8b5cf6", destColor: "#22c55e" }]
                      : []),
                    ...(voipAllocationModes.byDesk && voipDeskConfigs?.length
                      ? [{ coverageMap: mergeDeskCoverageMaps(voipDeskConfigs), source: "desk" as const, originColor: "#0d9488", destColor: "#f59e0b" }]
                      : []),
                    ...(voipAllocationModes.byBrand && Object.keys(coverageMap).length > 0
                      ? [{ coverageMap, source: "brand" as const, originColor: "#3b82f6", destColor: "#ef4444" }]
                      : []),
                  ]}
                  className="w-full h-full min-h-[240px]"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
