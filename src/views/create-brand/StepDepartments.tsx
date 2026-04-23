import { useState } from "react";
import { Building2, Plus, Phone, Trash2, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DEPARTMENTS, type DepartmentId } from "@/types/voip-desk";
import { createBrandDesk, countryCodeFromDeskName, getCoReDeskViolations, type BrandDesk } from "@/types/brand-desk";
import { StepUploadWorkers } from "./StepUploadWorkers";
import type { BrandEntry } from "@/controllers/useCreateBrand";

export type UploadedWorkerRow = {
  rowIndex: number;
  full_name: string;
  brandName: string;
  departmentName: string;
  desks: string;
  email: string;
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
};

interface StepDepartmentsProps {
  brandLabel: string;
  brandDesks?: BrandDesk[];
  onBrandDesksChange?: (desks: BrandDesk[]) => void;
  brands?: BrandEntry[];
  brandIndex?: number;
  uploadedWorkers?: UploadedWorkerRow[];
  onUploadedWorkersChange?: (v: UploadedWorkerRow[]) => void;
  redirectBannerMessage?: string | null;
  onDismissRedirectBanner?: () => void;
}

export const StepDepartments = ({
  brandLabel,
  brandDesks = [],
  onBrandDesksChange,
  brands = [],
  brandIndex = 0,
  uploadedWorkers,
  onUploadedWorkersChange,
  redirectBannerMessage,
  onDismissRedirectBanner,
}: StepDepartmentsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addDesk = () => {
    const desk = createBrandDesk();
    onBrandDesksChange?.([...brandDesks, desk]);
    setExpandedId(desk.id);
  };

  const updateDesk = (id: string, patch: Partial<BrandDesk>) => {
    const next = { ...patch };
    if (patch.deskName !== undefined) {
      next.countryCode = countryCodeFromDeskName(patch.deskName);
    }
    onBrandDesksChange?.(brandDesks.map((d) => (d.id === id ? { ...d, ...next } : d)));
  };

  const removeDesk = (id: string) => {
    onBrandDesksChange?.(brandDesks.filter((d) => d.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  /** CO & RE must share desks: if desk has CO it must have RE, and vice versa */
  const toggleDept = (deskId: string, dept: DepartmentId) => {
    const d = brandDesks.find((x) => x.id === deskId);
    if (!d) return;
    const has = d.departmentIds.includes(dept);
    let next: DepartmentId[];
    if (dept === "CO" || dept === "RE") {
      const other: DepartmentId = dept === "CO" ? "RE" : "CO";
      if (has) {
        next = d.departmentIds.filter((x) => x !== dept && x !== other);
      } else {
        next = [...new Set([...d.departmentIds, dept, other])];
      }
    } else {
      next = has ? d.departmentIds.filter((x) => x !== dept) : [...d.departmentIds, dept];
    }
    updateDesk(deskId, { departmentIds: next });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-[hsl(38,92%,95%)]">
          <Building2 className="w-5 h-5 text-[hsl(38,80%,45%)]" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight">Departments & Workers</h2>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
            {brandLabel} — Configure departments (QA, CO, RE, IT) and their desks for VoIP routing. RE & CO must share desks.
          </p>
        </div>
      </div>

      {/* CO/RE violation warning */}
      {(() => {
        const coReViolations = getCoReDeskViolations(brandDesks);
        return coReViolations.length > 0 ? (
          <div className="rounded-xl border border-amber-400/50 bg-amber-50 p-4 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">CO & RE must share desks</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Desk(s) {coReViolations.map((d) => d.deskName || "Unnamed").join(", ")} have CO or RE but not both.
              </p>
            </div>
          </div>
        ) : null;
      })()}

      {/* Desks panel */}
      <div className="rounded-2xl border border-border/50 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand desks</p>
            <p className="text-xs text-muted-foreground mt-0.5">Organisational structure — each desk is a country/region</p>
          </div>
        </div>

        {brandDesks.length > 0 ? (
          <div className="divide-y divide-border/40">
            {brandDesks.map((desk) => (
              <div key={desk.id} className="px-6">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{desk.deskName || "Unnamed desk"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {desk.departmentIds.length ? desk.departmentIds.join(", ") : "No departments"} · {desk.needsVoip !== false ? "VoIP enabled" : "No VoIP"}
                      </p>
                    </div>
                  </div>
                  {onBrandDesksChange && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={() => setExpandedId(expandedId === desk.id ? null : desk.id)}
                      >
                        {expandedId === desk.id ? "−" : "+"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/8"
                        onClick={() => removeDesk(desk.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {expandedId === desk.id && onBrandDesksChange && (
                  <div className="pb-5 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Desk name (country code)</Label>
                      <p className="text-xs text-muted-foreground">e.g. US, FR, UK — this is also the VoIP destination identifier</p>
                      <Input
                        value={desk.deskName}
                        onChange={(e) => updateDesk(desk.id, { deskName: e.target.value })}
                        placeholder="e.g. US, FR, UK"
                        className="h-9 max-w-xs rounded-xl border-border/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Departments</Label>
                      <p className="text-xs text-muted-foreground">CO & RE are linked — selecting one selects both</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {DEPARTMENTS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleDept(desk.id, d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              desk.departmentIds.includes(d)
                                ? "bg-primary text-white shadow-sm"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Switch checked={desk.needsVoip !== false} onCheckedChange={(v) => updateDesk(desk.id, { needsVoip: v })} />
                      <Label className="text-sm font-medium">Needs VoIP number</Label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEPARTMENTS.map((dept) => (
                <div key={dept} className="rounded-xl border border-border/40 p-4 bg-background/60 text-center">
                  <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-sm text-foreground">{dept}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    {dept === "QA" ? "All access" : dept === "CO" || dept === "RE" ? "Has desks" : "IT dept"}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">Add a desk above to configure VoIP routing</p>
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-4 flex gap-3">
        <Phone className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          VoIP phone numbers are configured separately in the VoIP step. RE & CO must always share the same desks.
        </p>
      </div>

      {onUploadedWorkersChange && (
        <div className="border-t border-border/50 pt-8">
          <StepUploadWorkers
            brands={brands}
            brandIndex={brandIndex}
            uploadedWorkers={uploadedWorkers}
            onUploadedWorkersChange={onUploadedWorkersChange}
            redirectBannerMessage={redirectBannerMessage}
            onDismissRedirectBanner={onDismissRedirectBanner}
            embedded
          />
        </div>
      )}
    </div>
  );
};
