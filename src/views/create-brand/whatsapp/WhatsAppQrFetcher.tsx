/**
 * WhatsAppQrFetcher — self-contained panel for fetching and displaying a real WhatsApp QR.
 *
 * Used inside StepWhatsApp for brand-level and desk-level allocation.
 * For worker-level, each worker row calls this with entity_type="user".
 *
 * Props:
 *   entityId        — brand._id / desk._id / user._id (the session scope)
 *   entityType      — "brand" | "desk" | "department" | "user"
 *   label           — display label (e.g. "Brand QR" / "Desk QR" / worker name)
 *   defaultPhone    — pre-filled phone number (optional)
 *   onSessionReady  — called when QR scan succeeds or session is reused
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWhatsAppQr } from "@/hooks/useWhatsAppQr";
import type { WhatsAppEntityType } from "@/api/contract/domain-models";

// ─── Props ────────────────────────────────────────────────────────────────────

interface WhatsAppQrFetcherProps {
  entityId: string;
  entityType: WhatsAppEntityType;
  label: string;
  defaultPhone?: string;
  /** Called when a QR is displayed or a session is reused (connection confirmed) */
  onSessionReady?: (phoneNumber: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WhatsAppQrFetcher({
  entityId,
  entityType,
  label,
  defaultPhone = "",
  onSessionReady,
}: WhatsAppQrFetcherProps) {
  const [phone, setPhone] = useState(defaultPhone);
  const [forceNew, setForceNew] = useState(false);

  const { status, qrDataUrl, sessionData, errorMessage, fetchQr, reset } =
    useWhatsAppQr();

  const canFetch = entityId.trim().length > 0 && phone.trim().length > 0;

  const handleFetch = () => {
    if (!canFetch) return;
    void fetchQr({
      entity_id: entityId.trim(),
      phone_number: phone.trim(),
      entity_type: entityType,
      force_new: forceNew,
    });
  };

  const handleRetry = () => {
    setForceNew(true);
    reset();
  };

  const handleNewQr = () => {
    setForceNew(true);
    void fetchQr({
      entity_id: entityId.trim(),
      phone_number: phone.trim(),
      entity_type: entityType,
      force_new: true,
    });
  };

  // Notify parent when ready
  if (
    (status === "qr_ready" || status === "session_reused") &&
    onSessionReady
  ) {
    onSessionReady(sessionData?.phone_number ?? phone);
  }

  return (
    <div className="space-y-3">
      {/* Phone number input */}
      {status === "idle" || status === "error" ? (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Phone number for {label}
          </Label>
          <div className="flex gap-2">
            <Input
              id={`wa-phone-${entityId}-${entityType}`}
              type="tel"
              placeholder="+15551234567"
              className="h-9 text-sm flex-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              disabled={status === "error" && !forceNew}
            />
            <Button
              type="button"
              size="sm"
              disabled={!canFetch || status === "error"}
              onClick={handleFetch}
              className="shrink-0 bg-[#25D366] hover:bg-[#1ebe5b] text-white border-0"
            >
              <Smartphone className="w-4 h-4 mr-1.5" />
              Get QR
            </Button>
          </div>
          {!entityId && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              Save the brand to the database first to generate a real entity ID.
            </p>
          )}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {/* Loading */}
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-8 rounded-xl border border-border/50 bg-muted/20"
          >
            <Loader2 className="w-8 h-8 text-[#25D366] animate-spin" />
            <p className="text-sm text-muted-foreground">
              Requesting QR from WhatsApp server…
            </p>
            <p className="text-xs text-muted-foreground/60">
              This can take several seconds
            </p>
          </motion.div>
        )}

        {/* QR Ready */}
        {status === "qr_ready" && qrDataUrl && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* QR image */}
              <div className="p-3 rounded-xl bg-white border border-border/50 shrink-0 shadow-sm">
                <img
                  src={qrDataUrl}
                  alt="WhatsApp QR Code"
                  className="w-[160px] h-[160px] object-contain"
                />
              </div>

              {/* Instructions + meta */}
              <div className="flex-1 space-y-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">Scan with WhatsApp</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Open WhatsApp → Linked Devices → Link a Device
                  </p>
                </div>

                {sessionData && (
                  <div className="text-xs text-muted-foreground space-y-0.5 font-mono bg-muted/30 rounded-lg p-2.5">
                    <p>
                      <span className="text-foreground/60">container:</span>{" "}
                      {sessionData.container_name}
                    </p>
                    <p>
                      <span className="text-foreground/60">phone:</span>{" "}
                      {sessionData.phone_number}
                    </p>
                    <p>
                      <span className="text-foreground/60">entity:</span>{" "}
                      {sessionData.entity_id} ({entityType})
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={handleNewQr}
                >
                  <RefreshCw className="w-3 h-3 mr-1.5" />
                  Force new QR
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Session reused — already connected */}
        {status === "session_reused" && (
          <motion.div
            key="reused"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-5 space-y-3"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Already connected
                </p>
                <p className="text-xs text-muted-foreground">
                  An active WhatsApp session exists for this{" "}
                  <strong>{entityType}</strong>. No QR scan needed.
                </p>
                {sessionData && (
                  <div className="text-xs font-mono text-muted-foreground/70">
                    {sessionData.phone_number} · {sessionData.container_name}
                  </div>
                )}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={handleRetry}
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Force new session
            </Button>
          </motion.div>
        )}

        {/* Error */}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-destructive/30 bg-destructive/6 p-4 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-destructive">
                  QR fetch failed
                </p>
                <p className="text-xs text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs h-7 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => {
                setForceNew(false);
                reset();
              }}
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Try again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
