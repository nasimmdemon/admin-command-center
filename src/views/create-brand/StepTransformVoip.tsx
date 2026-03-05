import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getPhoneCodesFromOutboundCountries } from "@/utils/countryCodes";
import { getVoipDeskConflicts, mergeDeskCoverageMaps, mergeWorkerCoverageMaps, type VoipDeskConfig } from "@/types/voip-desk";

interface StepTransformVoipProps {
  brandLabel: string;
  voipCoverageMap?: Record<string, string[]>;
  voipMode?: "legacy" | "desk" | "worker";
  voipDeskConfigs?: VoipDeskConfig[];
  voipQaDefault?: boolean;
  voipWorkerConfigs?: Array<{ workerEmail: string; coverageMap: Record<string, string[]> }>;
  phoneExtensionsAllowed: boolean;
  onPhoneExtensionsAllowedChange: (v: boolean) => void;
  allowedExtensionPhones?: string[];
  newAllowedExtensionPhone?: string;
  onAllowedExtensionPhonesChange?: (v: string[]) => void;
  onNewAllowedExtensionPhoneChange?: (v: string) => void;
}

const DEFAULT_QA_COUNTRIES = ["US", "GB", "FR", "DE", "ES", "IT", "CA", "AU", "NL", "BE"];

const getEffectiveCoverageMap = (props: StepTransformVoipProps): Record<string, string[]> | undefined => {
  let base: Record<string, string[]> = {};
  if (props.voipMode === "desk" && props.voipDeskConfigs && props.voipDeskConfigs.length > 0) {
    base = mergeDeskCoverageMaps(props.voipDeskConfigs);
  } else if (props.voipMode === "worker" && props.voipWorkerConfigs && props.voipWorkerConfigs.length > 0) {
    base = mergeWorkerCoverageMaps(props.voipWorkerConfigs);
  } else {
    base = props.voipCoverageMap ?? {};
  }
  if (props.voipQaDefault) {
    const all = new Set<string>(Object.keys(base));
    for (const dests of Object.values(base)) dests.forEach((x) => all.add(x));
    if (all.size === 0) DEFAULT_QA_COUNTRIES.forEach((c) => all.add(c));
    const arr = [...all];
    for (const o of arr) base[o] = [...new Set([...(base[o] || []), ...arr])];
  }
  return Object.keys(base).length > 0 ? base : undefined;
};

export const StepTransformVoip = (props: StepTransformVoipProps) => {
  const effectiveCoverageMap = getEffectiveCoverageMap(props);
  const deskConflicts = props.voipMode === "desk" && props.voipDeskConfigs ? getVoipDeskConflicts(props.voipDeskConfigs) : [];
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!effectiveCoverageMap || Object.keys(effectiveCoverageMap).length === 0) {
      setIsSyncing(false);
      return;
    }
    const codes = getPhoneCodesFromOutboundCountries(effectiveCoverageMap);
    if (codes.length > 0 && props.onAllowedExtensionPhonesChange) {
      const merged = [...new Set([...codes, ...(props.allowedExtensionPhones ?? [])])].sort();
      props.onAllowedExtensionPhonesChange(merged);
    }
    const t = setTimeout(() => setIsSyncing(false), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync once on mount when coverage exists
  }, []);

  return (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">VoIP & Phone</h2>
    <p className="text-sm text-muted-foreground">{props.brandLabel}</p>

    {deskConflicts.length > 0 && (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Origin–destination conflicts</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Desks share overlapping routes. Resolve in VoIP step: {deskConflicts.slice(0, 3).map((c) => `${c.deskA} ↔ ${c.deskB}: ${c.origin}→${c.dest}`).join("; ")}
            {deskConflicts.length > 3 && ` (+${deskConflicts.length - 3} more)`}
          </p>
        </div>
      </div>
    )}

    <div className="space-y-4 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <Label className="text-sm font-medium">Phone extensions allowed</Label>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Allow clients to use phone extensions based on outbound countries.</p>
        <Switch checked={props.phoneExtensionsAllowed} onCheckedChange={props.onPhoneExtensionsAllowedChange} />
      </div>
      {props.phoneExtensionsAllowed && props.allowedExtensionPhones != null && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Allowed extension phones</Label>
          </div>
          {isSyncing && effectiveCoverageMap && Object.keys(effectiveCoverageMap).length > 0 ? (
            <div className="flex items-center gap-2 py-6 rounded-lg bg-muted/30">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Syncing from outbound…</span>
            </div>
          ) : (
            <>
          <p className="text-xs text-muted-foreground">Based on outbound countries from VoIP coverage (auto-synced on load). Origin countries are also outbound (in-country calls). E.g. brand in Russia calling only Russia → +7.</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {props.allowedExtensionPhones.map((ext) => (
              <motion.span
                key={ext}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
              >
                {ext}
                <button onClick={() => props.onAllowedExtensionPhonesChange?.(props.allowedExtensionPhones!.filter((e) => e !== ext))} className="hover:text-primary/70 ml-1">×</button>
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="+7, +1, +44…"
              value={props.newAllowedExtensionPhone ?? ""}
              onChange={(e) => props.onNewAllowedExtensionPhoneChange?.(e.target.value.trim())}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (props.newAllowedExtensionPhone ?? "").trim() && !(props.allowedExtensionPhones ?? []).includes((props.newAllowedExtensionPhone ?? "").trim())) {
                  props.onAllowedExtensionPhonesChange?.([...(props.allowedExtensionPhones ?? []), (props.newAllowedExtensionPhone ?? "").trim()]);
                  props.onNewAllowedExtensionPhoneChange?.("");
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const v = (props.newAllowedExtensionPhone ?? "").trim();
                if (v && !(props.allowedExtensionPhones ?? []).includes(v)) {
                  props.onAllowedExtensionPhonesChange?.([...(props.allowedExtensionPhones ?? []), v]);
                  props.onNewAllowedExtensionPhoneChange?.("");
                }
              }}
            >
              Add
            </Button>
          </div>
            </>
          )}
        </motion.div>
      )}
    </div>

    <p className="text-xs text-muted-foreground">Country and phone code restrictions are defined by VoIP origin→destination coverage. No separate blocking needed.</p>
  </div>
  );
};
