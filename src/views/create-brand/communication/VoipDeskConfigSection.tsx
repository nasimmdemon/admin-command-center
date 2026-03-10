import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, AlertTriangle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CountryInput } from "@/components/CountryInput";
import { DEPARTMENTS, getVoipDeskConflicts, getReCoRegionViolations, type VoipDeskConfig, type DepartmentId } from "@/types/voip-desk";
import { isValidISOCountryCode, normalizeCountryInputToISO } from "@/utils/countryCodes";

const emptyCoverage = (): Record<string, string[]> => ({});

interface VoipDeskConfigSectionProps {
  desks: VoipDeskConfig[];
  onDesksChange: (desks: VoipDeskConfig[]) => void;
  /** When true, QA default is at brand level; per-desk QA toggle is hidden for QA desks */
  voipQaDefault?: boolean;
}

export const VoipDeskConfigSection = ({ desks, onDesksChange, voipQaDefault = false }: VoipDeskConfigSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingOrigin, setEditingOrigin] = useState<{ deskId: string; from: string } | null>(null);
  const [newDestInput, setNewDestInput] = useState("");
  const [newOriginInputs, setNewOriginInputs] = useState<Record<string, string>>({});

  const addDesk = () => {
    const id = `desk-${Date.now()}`;
    onDesksChange([
      ...desks,
      { id, deskName: "", departmentId: "CO", phoneCount: 1, allOriginsAllDestinations: false, coverageMap: emptyCoverage() },
    ]);
    setExpandedId(id);
  };

  const updateDesk = (id: string, patch: Partial<VoipDeskConfig>) => {
    onDesksChange(desks.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeDesk = (id: string) => {
    onDesksChange(desks.filter((d) => d.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addOrigin = (deskId: string, code: string) => {
    const d = desks.find((x) => x.id === deskId);
    if (!d || d.allOriginsAllDestinations || !code) return;
    const norm = normalizeCountryInputToISO(code) || code.toUpperCase().trim();
    if (!isValidISOCountryCode(norm)) return;
    const next = { ...d.coverageMap, [norm]: [norm] };
    updateDesk(deskId, { coverageMap: next });
    setNewOriginInputs((prev) => ({ ...prev, [deskId]: "" }));
  };

  const addDestination = (deskId: string, from: string, code: string) => {
    const d = desks.find((x) => x.id === deskId);
    if (!d || d.allOriginsAllDestinations || !from || !code) return;
    const current = d.coverageMap[from] || [from];
    if (current.includes(code)) return;
    const next = { ...d.coverageMap, [from]: [...current, code] };
    updateDesk(deskId, { coverageMap: next });
    setNewDestInput("");
    setEditingOrigin(null);
  };

  const removeOrigin = (deskId: string, code: string) => {
    const d = desks.find((x) => x.id === deskId);
    if (!d || d.allOriginsAllDestinations) return;
    const next = { ...d.coverageMap };
    delete next[code];
    updateDesk(deskId, { coverageMap: next });
  };

  const removeDestination = (deskId: string, from: string, to: string) => {
    const d = desks.find((x) => x.id === deskId);
    if (!d || d.allOriginsAllDestinations) return;
    const arr = (d.coverageMap[from] || []).filter((c) => c !== to);
    const next = { ...d.coverageMap };
    if (arr.length === 0) delete next[from];
    else next[from] = arr;
    updateDesk(deskId, { coverageMap: next });
  };

  const conflicts = getVoipDeskConflicts(desks);
  const reCoViolations = getReCoRegionViolations(desks);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Desk-based allocation</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Brands → Departments (QA, CO, RE, IT) → Desks. Phone count per desk by origin→destinations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addDesk}>
          <Plus className="w-4 h-4 mr-1" /> Add desk
        </Button>
      </div>

      {reCoViolations.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">RE & CO must share same region</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {reCoViolations.slice(0, 2).map((v) => `${v.reDesk} (${v.reCountry}) vs ${v.coDesk} (${v.coCountry})`).join("; ")}
              {reCoViolations.length > 2 && ` (+${reCoViolations.length - 2} more)`}
            </p>
          </div>
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Origin–destination conflicts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {conflicts.slice(0, 3).map((c) => `${c.deskA} ↔ ${c.deskB}: ${c.origin}→${c.dest}`).join("; ")}
              {conflicts.length > 3 && ` (+${conflicts.length - 3} more)`}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {desks.map((desk) => (
            <motion.div
              key={desk.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border/40 bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === desk.id ? null : desk.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {desk.deskName || "Unnamed desk"} · {desk.departmentId}
                      {desk.countryCode && ` (${desk.countryCode})`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {desk.needsVoip === false ? "No VoIP (org-only)" : desk.allOriginsAllDestinations ? "1 number, all origins → all destinations" : `${desk.phoneCount} numbers, ${Object.keys(desk.coverageMap).length} origins`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{desk.needsVoip === false ? "—" : `${desk.phoneCount} phones`}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); removeDesk(desk.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === desk.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/40 p-4 space-y-4 bg-muted/10"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Desk name</Label>
                        <Input
                          placeholder="e.g. CO desk FR"
                          value={desk.deskName}
                          onChange={(e) => updateDesk(desk.id, { deskName: e.target.value })}
                          className="mt-1 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Department</Label>
                        <Select value={desk.departmentId} onValueChange={(v) => updateDesk(desk.id, { departmentId: v as DepartmentId })}>
                          <SelectTrigger className="mt-1 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Country (optional)</Label>
                        <CountryInput
                          value={desk.countryCode ?? ""}
                          onChange={(v) => updateDesk(desk.id, { countryCode: v || undefined })}
                          placeholder="FR, US…"
                          className="mt-1 h-9"
                          onSelect={(code) => code && updateDesk(desk.id, { countryCode: code })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={desk.needsVoip !== false}
                          onCheckedChange={(v) => updateDesk(desk.id, { needsVoip: v })}
                        />
                        <Label className="text-sm">Needs VoIP number</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!desk.allOriginsAllDestinations}
                          onCheckedChange={(v) => updateDesk(desk.id, { allOriginsAllDestinations: v, coverageMap: v ? emptyCoverage() : desk.coverageMap })}
                        />
                        <Label className="text-sm">
                          {desk.departmentId === "QA" ? "QA default: 1 number, all origins → all destinations" : "All origins → all destinations (no per-origin config)"}
                        </Label>
                      </div>
                    </div>

                    {desk.needsVoip !== false && !desk.allOriginsAllDestinations && (
                      <>
                        <div>
                          <Label className="text-xs">Phone count</Label>
                          <Input
                            type="number"
                            min={1}
                            value={desk.phoneCount}
                            onChange={(e) => updateDesk(desk.id, { phoneCount: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className="mt-1 h-9 w-24"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Origins → Destinations</Label>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(desk.coverageMap).map(([from, dests]) => (
                              <div key={from} className="rounded-lg border border-border/40 p-2 bg-background">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{from}</span>
                                  <span className="text-muted-foreground">→</span>
                                  {dests.map((d) => (
                                    <span key={d} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
                                      {d}
                                      <button onClick={() => removeDestination(desk.id, from, d)} className="hover:text-destructive">×</button>
                                    </span>
                                  ))}
                                  {editingOrigin?.deskId === desk.id && editingOrigin?.from === from ? (
                                    <div className="flex gap-1 items-center">
                                      <CountryInput
                                        value={newDestInput}
                                        onChange={setNewDestInput}
                                        placeholder="Dest"
                                        className="h-6 w-20 text-xs"
                                        onSelect={(code) => code && addDestination(desk.id, from, code)}
                                        onKeyDown={(e) => e.key === "Enter" && (addDestination(desk.id, from, normalizeCountryInputToISO(newDestInput) || newDestInput), e.preventDefault())}
                                      />
                                      <Button size="sm" className="h-6 text-xs px-2" onClick={() => { const c = normalizeCountryInputToISO(newDestInput) || newDestInput.trim().toUpperCase(); if (c && isValidISOCountryCode(c)) addDestination(desk.id, from, c); }}>Add</Button>
                                      <Button variant="ghost" size="sm" className="h-6 text-xs px-1" onClick={() => { setEditingOrigin(null); setNewDestInput(""); }}>Done</Button>
                                    </div>
                                  ) : (
                                    <button type="button" onClick={() => setEditingOrigin({ deskId: desk.id, from })} className="text-xs text-primary hover:underline">+ dest</button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-2 flex-wrap items-center">
                              <CountryInput
                                value={newOriginInputs[desk.id] ?? ""}
                                onChange={(v) => setNewOriginInputs((p) => ({ ...p, [desk.id]: v }))}
                                placeholder="Type or search country (US, GB, FR…)"
                                className="h-8 min-w-[180px] flex-1 text-xs"
                                onSelect={(code) => code && addOrigin(desk.id, code)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const v = (e.target as HTMLInputElement).value?.trim();
                                    if (v) addOrigin(desk.id, v);
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                  const v = (newOriginInputs[desk.id] ?? "").trim();
                                  if (v) addOrigin(desk.id, v);
                                }}
                              >
                                Add origin
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {desks.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No desks configured. Add desks to allocate phones per department/desk.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={addDesk}>
            <Plus className="w-4 h-4 mr-1" /> Add first desk
          </Button>
        </div>
      )}
    </div>
  );
};
