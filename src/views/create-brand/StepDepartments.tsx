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
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-foreground">Departments</h2>
        <p className="text-sm text-muted-foreground">
          {brandLabel} — Departments (QA, CO, RE, IT) can have desks that correspond to VoIP destinations and explicitly allowed extensions.
        </p>

        {(() => {
          const coReViolations = getCoReDeskViolations(brandDesks);
          return coReViolations.length > 0 ? (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">CO & RE must share desks</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Desk(s) {coReViolations.map((d) => d.deskName || "Unnamed").join(", ")} have CO or RE but not both. Select both together.
                </p>
              </div>
            </div>
          ) : null;
        })()}

        <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-medium">Brand desks (org structure)</Label>
          </div>
          {brandDesks.length > 0 ? (
            <div className="space-y-2">
              {brandDesks.map((desk) => (
                <div key={desk.id} className="rounded-xl border border-border/40 p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{desk.deskName || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">
                          Depts: {desk.departmentIds.length ? desk.departmentIds.join(", ") : "none"} · {desk.needsVoip !== false ? "VoIP" : "No VoIP"}
                        </p>
                      </div>
                    </div>
                    {onBrandDesksChange && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expandedId === desk.id ? null : desk.id)}>
                          {expandedId === desk.id ? "−" : "+"}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeDesk(desk.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {expandedId === desk.id && onBrandDesksChange && (
                    <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
                      <div>
                        <Label className="text-xs">Desk name (country / region code)</Label>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-1">The desk name is the country (e.g. US, FR, UK). No separate country field.</p>
                        <Input
                          value={desk.deskName}
                          onChange={(e) => updateDesk(desk.id, { deskName: e.target.value })}
                          placeholder="e.g. US, FR, UK"
                          className="mt-1 h-9 max-w-md"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Departments using this desk</Label>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-1">CO & RE are linked: selecting one adds both.</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {DEPARTMENTS.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => toggleDept(desk.id, d)}
                              className={`px-2 py-1 rounded text-xs font-medium ${desk.departmentIds.includes(d) ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground border border-transparent"}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={desk.needsVoip !== false} onCheckedChange={(v) => updateDesk(desk.id, { needsVoip: v })} />
                        <Label className="text-xs">Needs VoIP number</Label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEPARTMENTS.map((dept) => (
                <div key={dept} className="flex items-center gap-3 rounded-xl border border-border/40 p-4 bg-muted/20">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{dept}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept === "QA" ? "All access" : dept === "CO" || dept === "RE" ? "May have desks → destinations & extensions" : "IT"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
          <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Desks & VoIP</p>
            <p className="text-xs text-muted-foreground mt-1">
              Brand desks define org structure (each desk is named by country/region). VoIP is configured separately in the VoIP step. RE & CO must share the same desks: if a desk is on CO it must be on RE, and vice versa.
            </p>
          </div>
        </div>
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
