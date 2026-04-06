/**
 * useWhatsAppQr — React hook for GET /auth/get-qr
 *
 * Manages loading / error / success states and exposes:
 *  - fetchQr(params)  → triggers the API call
 *  - qrDataUrl        → ready-to-use data-URI for <img src={...}>
 *  - sessionReused    → true when backend says session already exists
 *  - sessionData      → full response data (container info, ws_path, etc.)
 *  - loading / error
 *  - reset()          → clears state (e.g. before retrying)
 */

import { useState, useCallback } from "react";
import {
  getWhatsAppQr,
  qrToDataUrl,
} from "@/api/services/whatsapp.service";
import type { GetWhatsAppQrParams, WhatsAppQrData } from "@/api/contract/domain-models";

// ─── State shape ──────────────────────────────────────────────────────────────

export type WhatsAppQrStatus =
  | "idle"
  | "loading"
  | "qr_ready"       // fresh QR image returned
  | "session_reused" // backend said existing session → no QR needed
  | "error";

export interface UseWhatsAppQrState {
  status: WhatsAppQrStatus;
  /** Ready-to-use data-URI: "data:image/png;base64,..." — null if not yet fetched or session reused */
  qrDataUrl: string | null;
  /** True when the backend reused an existing session (qr is null) */
  sessionReused: boolean;
  /** Full data payload from the API (container info, ws_path, phone_number, etc.) */
  sessionData: WhatsAppQrData | null;
  /** HTTP status code of the last error (0 = network error) */
  errorStatus: number | null;
  /** Human-readable error string */
  errorMessage: string | null;
}

const INITIAL_STATE: UseWhatsAppQrState = {
  status: "idle",
  qrDataUrl: null,
  sessionReused: false,
  sessionData: null,
  errorStatus: null,
  errorMessage: null,
};

// ─── Friendly error messages for known status codes ───────────────────────────

function friendlyError(status: number, detail: string): string {
  switch (status) {
    case 0:
      return "Cannot reach the WhatsApp server. Make sure it is running.";
    case 400:
      return `Bad request — ${detail}`;
    case 409:
      return "This phone number is already linked to a different entity. Use a different number or contact support.";
    case 504:
      return "QR retrieval timed out. The server is slow — wait a moment and retry.";
    case 500:
      return "Internal server error. Contact the WhatsApp backend team.";
    default:
      return detail || `Unexpected error (HTTP ${status}).`;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWhatsAppQr() {
  const [state, setState] = useState<UseWhatsAppQrState>(INITIAL_STATE);

  /**
   * Fetch a QR code (or detect a reused session) for the given entity + phone.
   *
   * @param params  entity_id, phone_number, entity_type, force_new
   */
  const fetchQr = useCallback(async (params: GetWhatsAppQrParams) => {
    setState({ ...INITIAL_STATE, status: "loading" });

    const result = await getWhatsAppQr(params);

    if (!result.ok) {
      const err = result as { ok: false; status: number; detail: string };
      setState({
        ...INITIAL_STATE,
        status: "error",
        errorStatus: err.status,
        errorMessage: friendlyError(err.status, err.detail),
      });
      return;
    }

    const { data } = result;
    const dataUrl = qrToDataUrl(data.qr);
    const reused = data.reused === true || data.qr === null;

    setState({
      status: reused ? "session_reused" : "qr_ready",
      qrDataUrl: dataUrl,
      sessionReused: reused,
      sessionData: data,
      errorStatus: null,
      errorMessage: null,
    });
  }, []);

  /** Reset back to idle (e.g. before showing the panel again) */
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { ...state, fetchQr, reset };
}
