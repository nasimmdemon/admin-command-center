import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, XCircle, ChevronDown, ChevronRight, FileSpreadsheet, AlertTriangle, Download } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  validateWorkerCsv,
  type ValidatedRow,
  type ValidationError,
} from "@/utils/worker-csv-validation";
import type { BrandEntry } from "@/controllers/useCreateBrand";

interface StepUploadWorkersProps {
  brands: BrandEntry[];
  brandIndex?: number;
}

type TreeKey = string;

function buildTree(rows: ValidatedRow[]): Map<TreeKey, { brand: string; dept: string; desk: string; users: ValidatedRow[] }> {
  const map = new Map<TreeKey, { brand: string; dept: string; desk: string; users: ValidatedRow[] }>();
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

function UserRow({ v }: { v: ValidatedRow }) {
  const [open, setOpen] = useState(false);
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

export const StepUploadWorkers = ({ brands, brandIndex = 0 }: StepUploadWorkersProps) => {
  const b = brands[brandIndex] || brands[0];
  const [result, setResult] = useState<{
    headerErrors: ValidationError[];
    rows: ValidatedRow[];
    fileName: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

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
      };
      reader.readAsText(file, "UTF-8");
    },
    [allowedBrandsForValidation]
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
  const tree = result ? buildTree(result.rows) : null;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Upload Workers</h2>
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
            id="worker-csv-upload"
          />
          <label htmlFor="worker-csv-upload" className="cursor-pointer block">
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
            <div className="flex gap-3">
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
            </div>
          </div>

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
              <Label className="text-sm font-medium mb-3 block">Tree: Brand → Department → Desk → Users</Label>
              <ScrollArea className="h-[320px] pr-4">
                <div className="space-y-2">
                  {Array.from(tree.entries()).map(([key, { brand, dept, desk, users }]) => (
                    <TreeBranch key={key} label={`${brand} / ${dept} / ${desk}`} defaultOpen={true}>
                      <div className="space-y-0.5 mt-1">
                        {users.map((v, i) => (
                          <UserRow key={i} v={v} />
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
