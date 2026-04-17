import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, XCircle, ChevronDown, ChevronRight, FileSpreadsheet, AlertTriangle, Download, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  validateWorkerCsv,
  DEPARTMENTS,
  CLIENT_DATA_PREM_VALUES,
  type ValidatedRow,
  type ValidationError,
} from "@/utils/worker-csv-validation";
import type { BrandEntry } from "@/controllers/useCreateBrand";

interface StepUploadWorkersProps {
  brands: BrandEntry[];
  brandIndex?: number;
  uploadedWorkers?: Array<{
    rowIndex: number;
    full_name: string;
    brandName: string;
    departmentName: string;
    desks: string;
    email: string;
    valid: boolean;
    errors: Array<{ field: string; message: string }>;
  }>;
  onUploadedWorkersChange?: (v: NonNullable<StepUploadWorkersProps["uploadedWorkers"]>) => void;
  /** Shown when user enabled “By worker” on VoIP/WhatsApp without workers — wizard jumped here */
  redirectBannerMessage?: string | null;
  onDismissRedirectBanner?: () => void;
  /** When true, used inside Departments step — smaller heading and unique file input id */
  embedded?: boolean;
}

type TreeKey = string;

/** Nested tree: Brand → Department → Desk → Users */
interface TreeEntry {
  brand: string;
  dept: string;
  desk: string;
  users: ValidatedRow[];
}

function buildTree(rows: ValidatedRow[]): Map<TreeKey, TreeEntry> {
  const map = new Map<TreeKey, TreeEntry>();
  for (const v of rows) {
    const b = v.row.brandName?.trim() || "(no brand)";
    const d = v.row.departmentName?.trim().toUpperCase() || "(no dept)";
    const desk = v.row.desks?.trim() || "(no desk)";
    const key = `${b}::${d}::${desk}`;
    let entry = map.get(key);
    if (!entry) {
      entry = { brand: b, dept: d, desk, users: [] };
      map.set(key, entry);
    }
    entry.users.push(v);
  }
  return map;
}

/** Group tree entries by brand, then dept, then desk for hierarchical display */
function buildHierarchy(entries: [string, TreeEntry][]): Map<string, Map<string, Map<string, ValidatedRow[]>>> {
  const byBrand = new Map<string, Map<string, Map<string, ValidatedRow[]>>>();
  for (const [, { brand, dept, desk, users }] of entries) {
    if (!byBrand.has(brand)) byBrand.set(brand, new Map());
    const byDept = byBrand.get(brand)!;
    if (!byDept.has(dept)) byDept.set(dept, new Map());
    const byDesk = byDept.get(dept)!;
    if (!byDesk.has(desk)) byDesk.set(desk, []);
    byDesk.get(desk)!.push(...users);
  }
  return byBrand;
}

function UserRow({ v, defaultOpen = false }: { v: ValidatedRow; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const r = v.row;
  return (
    <div className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/30">
      {v.valid ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-left w-full flex items-center gap-1"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium truncate">{r.full_name || "(no name)"}</span>
          <span className="text-muted-foreground text-xs truncate">{r.email}</span>
        </button>
        {open && (
          <div className="mt-1 ml-5 space-y-1 text-xs">
            {v.valid ? (
              <p className="text-emerald-600 dark:text-emerald-400">✓ All fields valid</p>
            ) : (
              v.errors.map((e, i) => (
                <p key={i} className="text-destructive">
                  {e.field}: {e.message}
                </p>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TreeBranch({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full py-2 px-3 rounded-lg hover:bg-muted/40 text-left font-medium"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {label}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 border-l border-border/50 ml-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

const VALIDATION_RULES: Array<{ field: string; rule: string }> = [
  { field: "full_name", rule: "Required" },
  { field: "brand name", rule: "Required; must match brand(s) in wizard" },
  { field: "department name", rule: `Must be one of: ${DEPARTMENTS.join(", ")}` },
  { field: "desks", rule: "Required for CO and RE departments" },
  { field: "email", rule: "Required; no duplicates (prevents sending same email twice)" },
  { field: "password", rule: "Required" },
  { field: "title", rule: "Required" },
  { field: "is_manager", rule: "Required; must be TRUE or FALSE" },
  { field: "client_data_prem", rule: `Must be one of: ${CLIENT_DATA_PREM_VALUES.join(", ")}` },
  { field: "phone_number", rule: "Required" },
];

export const StepUploadWorkers = ({
  brands,
  brandIndex = 0,
  uploadedWorkers,
  onUploadedWorkersChange,
  redirectBannerMessage,
  onDismissRedirectBanner,
  embedded = false,
}: StepUploadWorkersProps) => {
  const b = brands[brandIndex] || brands[0];
  const [result, setResult] = useState<{
    headerErrors: ValidationError[];
    rows: ValidatedRow[];
    fileName: string;
  } | null>(() => {
    if (uploadedWorkers && uploadedWorkers.length > 0) {
      const rows: ValidatedRow[] = uploadedWorkers.map((u) => ({
        row: {
          rowIndex: u.rowIndex,
          full_name: u.full_name,
          brandName: u.brandName,
          departmentName: u.departmentName,
          desks: u.desks,
          email: u.email,
          password: "",
          title: "",
          is_manager: "",
          client_data_prem: "",
          phone_number: "",
          raw: {},
        },
        valid: u.valid,
        errors: u.errors,
      }));
      return { headerErrors: [], rows, fileName: "Previously uploaded" };
    }
    return null;
  });
  const [dragOver, setDragOver] = useState(false);
  const [showValidationRules, setShowValidationRules] = useState(false);

  const allowedBrands = brands.map((x) => x.name).filter(Boolean);
  const allowedBrandsForValidation = allowedBrands.length > 0 ? allowedBrands : ["*"];

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        const { headerErrors, rows } = validateWorkerCsv(text, allowedBrandsForValidation);
        setResult({ headerErrors, rows, fileName: file.name });
        onUploadedWorkersChange?.(
          rows.map((v) => ({
            rowIndex: v.row.rowIndex,
            full_name: v.row.full_name,
            brandName: v.row.brandName,
            departmentName: v.row.departmentName,
            desks: v.row.desks,
            email: v.row.email,
            valid: v.valid,
            errors: v.errors,
          }))
        );
      };
      reader.readAsText(file, "UTF-8");
    },
    [allowedBrandsForValidation, onUploadedWorkersChange]
  );

  const handleDrop = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault();
      setDragOver(false);
      const file = ev.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      if (file) processFile(file);
      ev.target.value = "";
    },
    [processFile]
  );

  const validCount = result?.rows.filter((r) => r.valid).length ?? 0;
  const invalidCount = result?.rows.filter((r) => !r.valid).length ?? 0;
  const invalidRows = result?.rows.filter((r) => !r.valid) ?? [];
  const duplicateEmailCount = result
    ? (() => {
        const counts = new Map<string, number>();
        for (const r of result.rows) {
          const e = r.row.email?.trim().toLowerCase();
          if (e) counts.set(e, (counts.get(e) ?? 0) + 1);
        }
        return [...counts.values()].filter((c) => c > 1).length;
      })()
    : 0;
  const tree = result ? buildTree(result.rows) : null;

  const uploadId = embedded ? `worker-csv-upload-embedded-${brandIndex}` : "worker-csv-upload";

  return (
    <div className={embedded ? "space-y-4" : "space-y-5"}>
      {embedded ? (
        <h3 className="text-base font-semibold text-foreground">Upload workers</h3>
      ) : (
        <h2 className="text-lg font-semibold text-foreground">Upload Workers</h2>
      )}
      {redirectBannerMessage && (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Upload workers first</p>
            <p className="text-sm text-muted-foreground mt-1">{redirectBannerMessage}</p>
          </div>
          {onDismissRedirectBanner && (
            <button
              type="button"
              onClick={onDismissRedirectBanner}
              className="shrink-0 p-1 rounded-md hover:bg-background/80 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Upload a CSV of workers. Invalid rows are rejected and will not be created. No email is sent twice—duplicate emails are detected and blocked.
      </p>
      <Collapsible open={showValidationRules} onOpenChange={setShowValidationRules}>
        <CollapsibleTrigger asChild>
          <button type="button" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            {showValidationRules ? "−" : "+"} Fields that block user creation (Step 3 / All)
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 rounded-xl border border-border/50 p-3 bg-muted/20 text-xs">
            <p className="text-muted-foreground mb-2">If any of these fail, the row is invalid and the user will not be created:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {VALIDATION_RULES.map((r, i) => (
                <li key={i}>
                  <strong>{r.field}</strong>: {r.rule}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="space-y-2">
        <Label>Your Workers On {b?.name || `Brand ${brandIndex + 1}`} Accounts</Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            dragOver ? "border-primary bg-tint-blue/30" : "border-border/60 hover:border-primary/50 hover:bg-tint-blue/30"
          }`}
        >
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileInput}
            className="hidden"
            id={uploadId}
          />
          <label htmlFor={uploadId} className="cursor-pointer block">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">CSV with: full_name, brand name, department name, desks, email, password, title, is_manager, client_data_prem, phone_number</p>
            <div className="flex gap-2 justify-center mt-3 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <span>Upload Users</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a href="/sample-workers-50.csv" download="sample-workers.csv">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download sample CSV
                </a>
              </Button>
            </div>
          </label>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>{result.fileName}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {validCount} valid
              </span>
              {invalidCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/15 text-destructive text-xs font-medium">
                  <XCircle className="w-3.5 h-3.5" />
                  {invalidCount} errors
                </span>
              )}
              {duplicateEmailCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {duplicateEmailCount} duplicate email{duplicateEmailCount !== 1 ? "s" : ""} (no email sent twice)
                </span>
              )}
            </div>
          </div>

          {invalidRows.length > 0 && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive mb-2">Users with incorrect data ({invalidRows.length})</p>
              <ScrollArea className="h-[180px] pr-4">
                <div className="space-y-1">
                  {invalidRows.map((v, i) => (
                    <UserRow key={i} v={v} defaultOpen={true} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {result.headerErrors.length > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Missing required columns</p>
                <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
                  {result.headerErrors.map((e, i) => (
                    <li key={i}>{e.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tree && tree.size > 0 && (
            <div className="rounded-xl border border-border/50 p-4 bg-card">
              <Label className="text-sm font-medium mb-3 block">Full tree: Brand → Department → Desk → Users</Label>
              <ScrollArea className="h-[320px] pr-4">
                <div className="space-y-2">
                  {Array.from(buildHierarchy(Array.from(tree.entries()))).map(([brand, byDept]) => (
                    <TreeBranch key={brand} label={`Brand: ${brand}`} defaultOpen={true}>
                      <div className="space-y-2 mt-1">
                        {Array.from(byDept.entries()).map(([dept, byDesk]) => (
                          <TreeBranch key={`${brand}-${dept}`} label={`Department: ${dept}`} defaultOpen={true}>
                            <div className="space-y-2 mt-1">
                              {Array.from(byDesk.entries()).map(([desk, users]) => (
                                <TreeBranch key={`${brand}-${dept}-${desk}`} label={`Desk: ${desk}`} defaultOpen={true}>
                                  <div className="space-y-0.5 mt-1">
                                    {users.map((v, i) => (
                                      <UserRow key={i} v={v} defaultOpen={!v.valid} />
                                    ))}
                                  </div>
                                </TreeBranch>
                              ))}
                            </div>
                          </TreeBranch>
                        ))}
                      </div>
                    </TreeBranch>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {result.rows.length === 0 && result.headerErrors.length === 0 && (
            <p className="text-sm text-muted-foreground">No data rows in file.</p>
          )}
        </div>
      )}
    </div>
  );
};
