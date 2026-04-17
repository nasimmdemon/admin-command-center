/**
 * useWhatsAppQr — React hook for WhatsApp QR (create→poll pattern)
 *
 * The prod API uses a MongoDB CRUD proxy. QR generation is async:
 *  1. POST /create  → submits a qr_requests doc
 *  2. Poll /find    → waits until status != "pending"
 *
 * Exposes:
 *  - fetchQr(params)    → triggers the create+poll flow
 *  - qrDataUrl          → ready-to-use data-URI for <img src={...}>
 *  - sessionReused      → true when backend says session already exists
 *  - sessionData        → full response data
 *  - pollingMessage     → human-readable hint for the loading UI phase
 *  - loading / error
 *  - reset()            → clears state (e.g. before retrying)
 */

import { useState, useCallback, useRef } from "react";
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
  /** Friendly status hint during the loading phase (create vs poll) */
  pollingMessage: string;
}

const INITIAL_STATE: UseWhatsAppQrState = {
  status: "idle",
  qrDataUrl: null,
  sessionReused: false,
  sessionData: null,
  errorStatus: null,
  errorMessage: null,
  pollingMessage: "",
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
      return "QR retrieval timed out after 90 s. The server is slow — wait a moment and retry.";
    case 500:
      return "Internal server error. Contact the WhatsApp backend team.";
    default:
      return detail || `Unexpected error (HTTP ${status}).`;
  }
}

// ─── Polling messages cycle ───────────────────────────────────────────────────

const POLL_MESSAGES = [
  "Submitting request to WhatsApp server…",
  "Waiting for backend to start container…",
  "Generating QR code…",
  "Almost there — fetching QR…",
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWhatsAppQr() {
  const [state, setState] = useState<UseWhatsAppQrState>(INITIAL_STATE);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPollMessages = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  /**
   * Fetch a QR code (or detect a reused session) for the given entity + phone.
   * Uses create→poll pattern against the MongoDB CRUD proxy.
   */
  const fetchQr = useCallback(async (params: GetWhatsAppQrParams) => {
    stopPollMessages();

    // Start cycling through human-friendly status messages
    let msgIdx = 0;
    setState({ ...INITIAL_STATE, status: "loading", pollingMessage: POLL_MESSAGES[0] });

    pollTimerRef.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % POLL_MESSAGES.length;
      setState((prev) =>
        prev.status === "loading"
          ? { ...prev, pollingMessage: POLL_MESSAGES[msgIdx] }
          : prev
      );
    }, 4000);

    const result = await getWhatsAppQr(params);
    stopPollMessages();

    if (!result.ok) {
      const err = result as { ok: false; status: number; detail: string };
      setState({
        ...INITIAL_STATE,
        status: "error",
        errorStatus: err.status,
        errorMessage: friendlyError(err.status, err.detail),
        pollingMessage: "",
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
      pollingMessage: "",
    });
  }, []);

  /** Reset back to idle (e.g. before showing the panel again) */
  const reset = useCallback(() => {
    stopPollMessages();
    setState(INITIAL_STATE);
  }, []);

  return { ...state, fetchQr, reset };
}
