import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Smartphone, Layers, Building2, User, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QRCodeSVG } from "qrcode.react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import type { WhatsAppWorkerEntry } from "@/types/worker-comms";
import { syncWhatsAppWorkerEntries } from "@/types/worker-comms";

const MOCK_WHATSAPP_PAIRING_BASE =
  "https://connect.whatsapp.com/oauth?client_id=demo&scope=whatsapp_business_messaging";

interface UploadedWorkerRow {
  email: string;
  full_name: string;
  brandName: string;
  valid: boolean;
}

interface StepWhatsAppProps {
  includeWhatsApp: boolean;
  onIncludeWhatsAppChange: (v: boolean) => void;
  whatsappAllocationModes: { byBrand: boolean; byDesk: boolean; byWorker: boolean };
  onWhatsappAllocationModesChange: (v: { byBrand: boolean; byDesk: boolean; byWorker: boolean }) => void;
  whatsappQrCode: string;
  onWhatsappQrCodeChange?: (v: string) => void;
  whatsappDeskQrCode: string;
  onWhatsappDeskQrCodeChange?: (v: string) => void;
  whatsappWorkerEntries: WhatsAppWorkerEntry[];
  onWhatsappWorkerEntriesChange: (v: WhatsAppWorkerEntry[]) => void;
  /** Workers from CSV; filtered by current brand name */
  uploadedWorkers?: UploadedWorkerRow[];
  /** Current brand name (wizard slide) — only workers for this brand are listed */
  currentBrandName: string;
}

export const StepWhatsApp = ({
  includeWhatsApp,
  onIncludeWhatsAppChange,
  whatsappAllocationModes,
  onWhatsappAllocationModesChange,
  whatsappQrCode,
  onWhatsappQrCodeChange,
  whatsappDeskQrCode,
  onWhatsappDeskQrCodeChange,
  whatsappWorkerEntries,
  onWhatsappWorkerEntriesChange,
  uploadedWorkers = [],
  currentBrandName,
}: StepWhatsAppProps) => {
  const brandNorm = currentBrandName.trim().toLowerCase();

  const workersForBrand = useMemo(() => {
    return uploadedWorkers.filter(
      (w) =>
        w.valid &&
        (!brandNorm || w.brandName?.trim().toLowerCase() === brandNorm)
    );
  }, [uploadedWorkers, brandNorm]);

  const syncKey = useMemo(
    () => workersForBrand.map((w) => w.email).sort().join("|"),
    [workersForBrand]
  );
  const prevSyncKey = useRef<string | null>(null);
  const entriesRef = useRef(whatsappWorkerEntries);
  entriesRef.current = whatsappWorkerEntries;

  useEffect(() => {
    if (prevSyncKey.current === syncKey) return;
    prevSyncKey.current = syncKey;
    const next = syncWhatsAppWorkerEntries(
      workersForBrand.map((w) => ({ email: w.email, full_name: w.full_name })),
      entriesRef.current,
      MOCK_WHATSAPP_PAIRING_BASE
    );
    onWhatsappWorkerEntriesChange(next);
  }, [syncKey, workersForBrand, onWhatsappWorkerEntriesChange]);

  const updateWorker = (email: string, patch: Partial<WhatsAppWorkerEntry>) => {
    onWhatsappWorkerEntriesChange(
      whatsappWorkerEntries.map((w) =>
        w.workerEmail.toLowerCase() === email.toLowerCase() ? { ...w, ...patch } : w
      )
    );
  };

  const brandQrValue = whatsappQrCode || `${MOCK_WHATSAPP_PAIRING_BASE}&level=brand`;
  const deskQrValue = whatsappDeskQrCode || whatsappQrCode || `${MOCK_WHATSAPP_PAIRING_BASE}&level=desk`;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">WhatsApp Business</h2>
      <p className="text-sm text-muted-foreground">
        Enable allocation at brand, desk, and/or worker level. Workers listed are from your upload for this brand. Each worker can be
        included or excluded; when included, they get their own QR to scan — or an error state if linking fails.
      </p>

      <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <Label className="text-base font-medium">Include WhatsApp</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Enable WhatsApp for this brand</p>
          </div>
        </div>
        <Switch checked={includeWhatsApp} onCheckedChange={onIncludeWhatsAppChange} />
      </div>

      {includeWhatsApp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-3">
            <Label className="text-sm font-medium">Allocation levels</Label>
            <p className="text-xs text-muted-foreground">Turn on any combination (union of all enabled levels).</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={whatsappAllocationModes.byBrand}
                  onCheckedChange={(v) =>
                    onWhatsappAllocationModesChange({ ...whatsappAllocationModes, byBrand: v })
                  }
                />
                <Label className="text-sm cursor-pointer">By brand</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={whatsappAllocationModes.byDesk}
                  onCheckedChange={(v) =>
                    onWhatsappAllocationModesChange({ ...whatsappAllocationModes, byDesk: v })
                  }
                />
                <Label className="text-sm cursor-pointer">By desk</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={whatsappAllocationModes.byWorker}
                  onCheckedChange={(v) =>
                    onWhatsappAllocationModesChange({ ...whatsappAllocationModes, byWorker: v })
                  }
                />
                <Label className="text-sm cursor-pointer">By worker</Label>
              </div>
            </div>
          </div>

          {whatsappAllocationModes.byBrand && (
            <div className="rounded-xl border border-border/50 p-6 bg-card shadow-widget space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <Label className="text-sm font-medium">Brand — QR scan</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">One pairing flow for the whole brand.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="p-4 rounded-xl bg-white border border-border/50 shrink-0">
                  <QRCodeSVG value={brandQrValue} size={160} level="M" includeMargin className="text-foreground" />
                </div>
                <div className="space-y-2 flex-1 text-sm text-muted-foreground">
                  <p>Scan with WhatsApp → Linked Devices → Link a device.</p>
                  {onWhatsappQrCodeChange && (
                    <div>
                      <Label className="text-xs">Pairing URL (optional override)</Label>
                      <Input
                        className="mt-1 h-8 text-xs"
                        value={whatsappQrCode}
                        onChange={(e) => onWhatsappQrCodeChange(e.target.value)}
                        placeholder="Backend session URL…"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {whatsappAllocationModes.byDesk && (
            <div className="rounded-xl border border-border/50 p-6 bg-card shadow-widget space-y-4">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <Label className="text-sm font-medium">Desk — QR scan</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Default desk pairing (e.g. RE US / CO US same number). Separate QR from brand if needed.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="p-4 rounded-xl bg-white border border-border/50 shrink-0">
                  <QRCodeSVG value={deskQrValue} size={160} level="M" includeMargin className="text-foreground" />
                </div>
                {onWhatsappDeskQrCodeChange && (
                  <div className="flex-1">
                    <Label className="text-xs">Desk pairing URL (optional)</Label>
                    <Input
                      className="mt-1 h-8 text-xs"
                      value={whatsappDeskQrCode}
                      onChange={(e) => onWhatsappDeskQrCodeChange(e.target.value)}
                      placeholder="Leave empty to use brand URL"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {whatsappAllocationModes.byWorker && (
            <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <Label className="text-sm font-medium">Workers — include / exclude &amp; QR per worker</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Only workers uploaded for <strong>{currentBrandName || "this brand"}</strong> are listed. Each included worker has their own
                    QR; not everyone shares one code.
                  </p>
                </div>
              </div>

              {workersForBrand.length === 0 ? (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Upload workers in the Upload Workers step for this brand first. Then each valid worker can be toggled here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[min(420px,60vh)] pr-3">
                  <div className="space-y-3">
                    {whatsappWorkerEntries
                      .filter((e) =>
                        workersForBrand.some((w) => w.email.toLowerCase() === e.workerEmail.toLowerCase())
                      )
                      .map((entry) => (
                        <div
                          key={entry.workerEmail}
                          className="rounded-xl border border-border/40 p-4 bg-muted/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{entry.full_name || entry.workerEmail}</p>
                              <p className="text-xs text-muted-foreground">{entry.workerEmail}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">Include</Label>
                              <Switch
                                checked={entry.included}
                                onCheckedChange={(v) => updateWorker(entry.workerEmail, { included: v })}
                              />
                            </div>
                          </div>

                          {entry.included && (
                            <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-border/40">
                              <div className="p-3 rounded-lg bg-white border border-border/50 shrink-0">
                                <QRCodeSVG
                                  value={entry.pairingUrl || `${MOCK_WHATSAPP_PAIRING_BASE}&worker=${encodeURIComponent(entry.workerEmail)}`}
                                  size={120}
                                  level="M"
                                  includeMargin
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <p className="text-xs text-muted-foreground">Scan this QR on the worker&apos;s device to link WhatsApp.</p>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    className="text-xs px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25"
                                    onClick={() =>
                                      updateWorker(entry.workerEmail, { pairingStatus: "linked", errorMessage: undefined })
                                    }
                                  >
                                    Mark linked (demo)
                                  </button>
                                  <button
                                    type="button"
                                    className="text-xs px-2 py-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/25"
                                    onClick={() =>
                                      updateWorker(entry.workerEmail, {
                                        pairingStatus: "error",
                                        errorMessage: "Scan failed or session expired (demo)",
                                      })
                                    }
                                  >
                                    Mark error (demo)
                                  </button>
                                  <button
                                    type="button"
                                    className="text-xs px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40"
                                    onClick={() =>
                                      updateWorker(entry.workerEmail, { pairingStatus: "pending", errorMessage: undefined })
                                    }
                                  >
                                    Reset pending
                                  </button>
                                </div>
                                {entry.pairingStatus === "linked" && (
                                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Linked — worker WhatsApp is active for this allocation.
                                  </div>
                                )}
                                {entry.pairingStatus === "error" && (
                                  <div className="flex items-start gap-1.5 text-xs text-destructive">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>{entry.errorMessage || "Linking error"}</span>
                                  </div>
                                )}
                                {entry.pairingStatus === "pending" && (
                                  <p className="text-xs text-amber-700 dark:text-amber-300">Pending scan — show QR to worker.</p>
                                )}
                              </div>
                            </div>
                          )}

                          {!entry.included && (
                            <p className="text-xs text-muted-foreground italic">Excluded from per-worker WhatsApp.</p>
                          )}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {!whatsappAllocationModes.byBrand && !whatsappAllocationModes.byDesk && !whatsappAllocationModes.byWorker && (
            <div className="rounded-xl border border-dashed border-amber-500/40 p-4 text-sm text-amber-800 dark:text-amber-200">
              Enable at least one level (brand, desk, or worker) above.
            </div>
          )}
        </motion.div>
      )}

      {!includeWhatsApp && (
        <div className="rounded-xl border border-dashed border-border/60 p-6 bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">WhatsApp is disabled for this brand.</p>
        </div>
      )}
    </div>
  );
};
