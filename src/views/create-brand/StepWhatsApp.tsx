/**
 * StepWhatsApp — Brand wizard step 9
 *
 * Allocation levels:
 *  - By Brand  → one WhatsApp session for the whole brand  (entity_type="brand")
 *  - By Desk   → one WhatsApp session per desk             (entity_type="desk")
 *  - By Worker → one WhatsApp session per worker           (entity_type="user")
 *
 * QR codes are fetched from the real backend via WhatsAppQrFetcher.
 * Workers still use the existing per-worker entry system (syncWhatsAppWorkerEntries).
 */

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Layers,
  Building2,
  User,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QRCodeSVG } from "qrcode.react";
import type { WhatsAppWorkerEntry } from "@/types/worker-comms";
import { syncWhatsAppWorkerEntries } from "@/types/worker-comms";
import { WhatsAppQrFetcher } from "@/views/create-brand/whatsapp/WhatsAppQrFetcher";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fallback mock pairing URL — used for worker QR display only (per-worker flow). */
const MOCK_WHATSAPP_PAIRING_BASE =
  "https://connect.whatsapp.com/oauth?client_id=demo&scope=whatsapp_business_messaging";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedWorkerRow {
  email: string;
  full_name: string;
  brandName: string;
  valid: boolean;
}

interface StepWhatsAppProps {
  /** Brand or desk entity ID — used as entity_id for QR API calls */
  entityId?: string;
  includeWhatsApp: boolean;
  onIncludeWhatsAppChange: (v: boolean) => void;
  whatsappAllocationModes: { byBrand: boolean; byDesk: boolean; byWorker: boolean };
  onWhatsappAllocationModesChange: (v: {
    byBrand: boolean;
    byDesk: boolean;
    byWorker: boolean;
  }) => void;
  /** Legacy — kept for JSON export compat; no longer drives the QR display */
  whatsappQrCode: string;
  onWhatsappQrCodeChange?: (v: string) => void;
  whatsappDeskQrCode: string;
  onWhatsappDeskQrCodeChange?: (v: string) => void;
  whatsappWorkerEntries: WhatsAppWorkerEntry[];
  onWhatsappWorkerEntriesChange: (v: WhatsAppWorkerEntry[]) => void;
  /** Workers from CSV; filtered by current brand name */
  uploadedWorkers?: UploadedWorkerRow[];
  /** Current brand name (wizard slide) */
  currentBrandName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StepWhatsApp = ({
  entityId = "",
  includeWhatsApp,
  onIncludeWhatsAppChange,
  whatsappAllocationModes,
  onWhatsappAllocationModesChange,
  whatsappWorkerEntries,
  onWhatsappWorkerEntriesChange,
  uploadedWorkers = [],
  currentBrandName,
  // Legacy props — kept for backward compat / JSON export only
  whatsappQrCode,
  onWhatsappQrCodeChange: _onWhatsappQrCodeChange,
  whatsappDeskQrCode,
  onWhatsappDeskQrCodeChange: _onWhatsappDeskQrCodeChange,
}: StepWhatsAppProps) => {
  const brandNorm = currentBrandName.trim().toLowerCase();

  // ── Worker sync ─────────────────────────────────────────────────────────────
  const workersForBrand = useMemo(
    () =>
      uploadedWorkers.filter(
        (w) =>
          w.valid &&
          (!brandNorm || w.brandName?.trim().toLowerCase() === brandNorm)
      ),
    [uploadedWorkers, brandNorm]
  );

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
        w.workerEmail.toLowerCase() === email.toLowerCase()
          ? { ...w, ...patch }
          : w
      )
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">WhatsApp Business</h2>
      <p className="text-sm text-muted-foreground">
        Enable WhatsApp and configure at which level sessions are created —
        brand, desk, and/or per-worker. The QR code is fetched from the real
        WhatsApp backend.
      </p>

      {/* ── Include toggle ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <Label className="text-base font-medium">Include WhatsApp</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable WhatsApp for this brand
            </p>
          </div>
        </div>
        <Switch
          checked={includeWhatsApp}
          onCheckedChange={onIncludeWhatsAppChange}
        />
      </div>

      {/* ── Expanded section ────────────────────────────────────────────────── */}
      {includeWhatsApp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Allocation levels */}
          <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-3">
            <Label className="text-sm font-medium">Allocation levels</Label>
            <p className="text-xs text-muted-foreground">
              Turn on any combination (union of all enabled levels).
            </p>
            <div className="flex flex-wrap gap-6">
              {(
                [
                  { key: "byBrand", label: "By brand" },
                  { key: "byDesk", label: "By desk" },
                  { key: "byWorker", label: "By worker" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Switch
                    checked={whatsappAllocationModes[key]}
                    onCheckedChange={(v) =>
                      onWhatsappAllocationModesChange({
                        ...whatsappAllocationModes,
                        [key]: v,
                      })
                    }
                  />
                  <Label className="text-sm cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* ── By Brand QR ──────────────────────────────────────────────────── */}
          {whatsappAllocationModes.byBrand && (
            <div className="rounded-xl border border-border/50 p-6 bg-card shadow-widget space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <Label className="text-sm font-medium">Brand — QR scan</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    One WhatsApp session shared across the whole brand.
                  </p>
                </div>
              </div>
              <WhatsAppQrFetcher
                entityId={entityId}
                entityType="brand"
                label="Brand"
                defaultPhone={whatsappQrCode || ""}
              />
            </div>
          )}

          {/* ── By Desk QR ───────────────────────────────────────────────────── */}
          {whatsappAllocationModes.byDesk && (
            <div className="rounded-xl border border-border/50 p-6 bg-card shadow-widget space-y-4">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <Label className="text-sm font-medium">Desk — QR scan</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    One session per desk (e.g. RE US / CO US share a number).
                  </p>
                </div>
              </div>
              <WhatsAppQrFetcher
                entityId={entityId}
                entityType="desk"
                label="Desk"
                defaultPhone={whatsappDeskQrCode || whatsappQrCode || ""}
              />
            </div>
          )}

          {/* ── By Worker QR ─────────────────────────────────────────────────── */}
          {whatsappAllocationModes.byWorker && (
            <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <Label className="text-sm font-medium">
                    Workers — include / exclude &amp; QR per worker
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Only workers uploaded for{" "}
                    <strong>{currentBrandName || "this brand"}</strong> are
                    listed. Each included worker gets their own QR.
                  </p>
                </div>
              </div>

              {workersForBrand.length === 0 ? (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Upload workers in the Upload Workers step for this brand
                    first. Then each valid worker can be toggled here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[min(420px,60vh)] pr-3">
                  <div className="space-y-3">
                    {whatsappWorkerEntries
                      .filter((e) =>
                        workersForBrand.some(
                          (w) =>
                            w.email.toLowerCase() ===
                            e.workerEmail.toLowerCase()
                        )
                      )
                      .map((entry) => (
                        <div
                          key={entry.workerEmail}
                          className="rounded-xl border border-border/40 p-4 bg-muted/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">
                                {entry.full_name || entry.workerEmail}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {entry.workerEmail}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs text-muted-foreground">
                                Include
                              </Label>
                              <Switch
                                checked={entry.included}
                                onCheckedChange={(v) =>
                                  updateWorker(entry.workerEmail, {
                                    included: v,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {entry.included && (
                            <div className="pt-2 border-t border-border/40">
                              {/* Real QR fetcher per worker */}
                              <WhatsAppQrFetcher
                                entityId={entry.workerEmail}
                                entityType="user"
                                label={entry.full_name || entry.workerEmail}
                                onSessionReady={() =>
                                  updateWorker(entry.workerEmail, {
                                    pairingStatus: "linked",
                                    errorMessage: undefined,
                                  })
                                }
                              />

                              {/* Legacy status badges */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                  type="button"
                                  className="text-xs px-2 py-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/25"
                                  onClick={() =>
                                    updateWorker(entry.workerEmail, {
                                      pairingStatus: "error",
                                      errorMessage:
                                        "Scan failed or session expired",
                                    })
                                  }
                                >
                                  Mark error
                                </button>
                                <button
                                  type="button"
                                  className="text-xs px-2 py-1 rounded-md border border-border/60 hover:bg-muted/40"
                                  onClick={() =>
                                    updateWorker(entry.workerEmail, {
                                      pairingStatus: "pending",
                                      errorMessage: undefined,
                                    })
                                  }
                                >
                                  Reset pending
                                </button>
                              </div>

                              {entry.pairingStatus === "linked" && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Linked — worker WhatsApp is active.
                                </div>
                              )}
                              {entry.pairingStatus === "error" && (
                                <div className="flex items-start gap-1.5 text-xs text-destructive mt-2">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span>
                                    {entry.errorMessage || "Linking error"}
                                  </span>
                                </div>
                              )}
                              {entry.pairingStatus === "pending" && (
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                                  Pending scan — show QR to worker.
                                </p>
                              )}
                            </div>
                          )}

                          {!entry.included && (
                            <p className="text-xs text-muted-foreground italic">
                              Excluded from per-worker WhatsApp.
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {/* No level selected warning */}
          {!whatsappAllocationModes.byBrand &&
            !whatsappAllocationModes.byDesk &&
            !whatsappAllocationModes.byWorker && (
              <div className="rounded-xl border border-dashed border-amber-500/40 p-4 text-sm text-amber-800 dark:text-amber-200">
                Enable at least one level (brand, desk, or worker) above.
              </div>
            )}
        </motion.div>
      )}

      {/* WhatsApp disabled placeholder */}
      {!includeWhatsApp && (
        <div className="rounded-xl border border-dashed border-border/60 p-6 bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            WhatsApp is disabled for this brand.
          </p>
        </div>
      )}
    </div>
  );
};
