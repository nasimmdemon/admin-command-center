/**
 * WhatsApp Auth Service — GET /auth/get-qr
 *
 * Uses the WHATSAPP backend (VITE_WHATSAPP_API_BASE_URL), not the admin API.
 * All error handling and result shaping is done here so callers get clean data.
 */

import { getWhatsAppApiBaseUrl } from "@/api/contract/env";
import type {
  GetWhatsAppQrParams,
  WhatsAppQrResponse,
} from "@/api/contract/domain-models";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WhatsAppQrResult =
  | { ok: true; data: WhatsAppQrResponse["data"] }
  | { ok: false; status: number; detail: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts the `qr` object from the API into a ready-to-use data-URI
 * that can be placed directly in an <img src={...}> tag.
 * Returns null if `qr` is null (session reused / already connected).
 */
export function qrToDataUrl(
  qr: WhatsAppQrResponse["data"]["qr"]
): string | null {
  if (!qr) return null;
  return `data:${qr.content_type};base64,${qr.data_base64}`;
}

// ─── API call ─────────────────────────────────────────────────────────────────

/**
 * Calls GET /auth/get-qr on the WhatsApp backend.
 *
 * Entity types and when to use them:
 *  - "brand"      → entity_id = brand._id  (one session shared by brand)
 *  - "desk"       → entity_id = desk._id   (one session shared by desk)
 *  - "department" → entity_id = dept._id   (one session per department)
 *  - "user"       → entity_id = user._id   (one session per worker/user)
 *
 * Does NOT throw — always returns a typed result union.
 */
export async function getWhatsAppQr(
  params: GetWhatsAppQrParams
): Promise<WhatsAppQrResult> {
  const base = getWhatsAppApiBaseUrl();

  const searchParams = new URLSearchParams({
    entity_id: params.entity_id,
    phone_number: params.phone_number,
    entity_type: params.entity_type ?? "user",
    force_new: String(params.force_new ?? false),
  });

  const url = `${base}/auth/get-qr?${searchParams.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { method: "GET" });
  } catch (networkErr) {
    return {
      ok: false,
      status: 0,
      detail:
        "Cannot reach the WhatsApp server. Check VITE_WHATSAPP_API_BASE_URL and make sure the server is running.",
    };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return {
      ok: false,
      status: res.status,
      detail: `Server returned non-JSON response (HTTP ${res.status}).`,
    };
  }

  // 200 — success or session reused
  if (res.status === 200) {
    const typed = body as WhatsAppQrResponse;
    return { ok: true, data: typed.data };
  }

  // 4xx / 5xx — extract `detail` from error body
  const errorBody = body as Record<string, unknown>;
  const detail =
    typeof errorBody?.detail === "string"
      ? errorBody.detail
      : typeof errorBody?.message === "string"
      ? errorBody.message
      : `Request failed with status ${res.status}`;

  return { ok: false, status: res.status, detail };
}
