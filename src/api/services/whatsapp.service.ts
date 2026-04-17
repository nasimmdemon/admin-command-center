/**
 * WhatsApp Auth Service — MongoDB CRUD proxy pattern
 *
 * The prod API at VITE_WHATSAPP_API_BASE_URL (whatsapp.mainstreetcpltd.com) is a
 * generic MongoDB CRUD proxy. QR generation follows a two-step flow:
 *
 *  1. POST /create  { collection_name: "qr_requests", document_data: { entity_id, phone_number, entity_type, force_new } }
 *     → Backend worker picks this up, starts WAHA container, writes QR data back to the doc
 *
 *  2. Poll POST /find { query: { entity_id, status: { $in: ["ready","session_reused","error"] } }, collection_name: "qr_requests" }
 *     → Resolves when status flips away from "pending"
 *
 * All error handling and result shaping is done here so callers get clean data.
 */

import { getWhatsAppApiBaseUrl } from "@/api/contract/env";
import type {
  GetWhatsAppQrParams,
  WhatsAppQrData,
} from "@/api/contract/domain-models";

// ─── Wire shapes from the CRUD proxy ──────────────────────────────────────────

/** What we POST to /create */
interface QrRequestDoc {
  entity_id: string;
  phone_number: string;
  entity_type: string;
  force_new: boolean;
}

/** What we get back from /find after the backend processes the request */
export interface QrRequestResult extends QrRequestDoc {
  _id: string;
  status: "pending" | "ready" | "session_reused" | "error";
  /** ISO timestamp */
  created_at?: string;
  /** Full WhatsApp session data — present when status is "ready" or "session_reused" */
  session?: WhatsAppQrData;
  /** Raw base64 QR image — some backends put it here directly */
  qr_base64?: string;
  qr_content_type?: string;
  /** Human readable error when status === "error" */
  error?: string;
}

// ─── Public result union ───────────────────────────────────────────────────────

export type WhatsAppQrResult =
  | { ok: true; data: WhatsAppQrData }
  | { ok: false; status: number; detail: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts the `qr` object from the API into a ready-to-use data-URI
 * that can be placed directly in an <img src={...}> tag.
 * Returns null if `qr` is null (session reused / already connected).
 */
export function qrToDataUrl(
  qr: WhatsAppQrData["qr"]
): string | null {
  if (!qr) return null;
  return `data:${qr.content_type};base64,${qr.data_base64}`;
}

// ─── Low-level helpers ────────────────────────────────────────────────────────

const COLLECTION = "qr_requests";
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90_000; // 90 seconds max

async function apiPost(
  base: string,
  path: string,
  body: unknown
): Promise<{ ok: boolean; status: number; json: unknown }> {
  try {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let json: unknown;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { ok: res.ok, status: res.status, json };
  } catch {
    return { ok: false, status: 0, json: null };
  }
}

// ─── Step 1: create the QR request ───────────────────────────────────────────

async function createQrRequest(
  base: string,
  params: GetWhatsAppQrParams
): Promise<{ ok: boolean; docId?: string; detail?: string }> {
  const doc: QrRequestDoc = {
    entity_id: params.entity_id,
    phone_number: params.phone_number,
    entity_type: params.entity_type ?? "user",
    force_new: params.force_new ?? false,
  };

  const res = await apiPost(base, "/create", {
    collection_name: COLLECTION,
    document_data: doc,
  });

  if (!res.ok || res.status === 0) {
    return {
      ok: false,
      detail:
        res.status === 0
          ? "Cannot reach the WhatsApp server. Check VITE_WHATSAPP_API_BASE_URL."
          : `Failed to submit QR request (HTTP ${res.status}).`,
    };
  }

  const body = res.json as Record<string, unknown>;
  const dataObj = body?.data as Record<string, unknown> | undefined;
  const docId = dataObj?._id as string | undefined;

  if (!docId) {
    return { ok: false, detail: "Server did not return a document ID." };
  }

  return { ok: true, docId };
}

// ─── Step 2: poll until status resolves ──────────────────────────────────────

async function pollForQrResult(
  base: string,
  entityId: string,
  phoneNumber: string
): Promise<QrRequestResult | null> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const res = await apiPost(base, "/find", {
      collection_name: COLLECTION,
      query: {
        entity_id: entityId,
        phone_number: phoneNumber,
      },
    });

    if (res.ok && res.status !== 0) {
      const body = res.json as Record<string, unknown>;
      const docs = body?.data as QrRequestResult[] | undefined;

      if (Array.isArray(docs) && docs.length > 0) {
        // Sort by created_at descending to get the most recent request
        const sorted = [...docs].sort((a, b) =>
          (b.created_at ?? "").localeCompare(a.created_at ?? "")
        );
        const latest = sorted[0];

        if (latest.status !== "pending") {
          return latest;
        }
      }
    }

    // Still pending — wait before next poll
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  return null; // timed out
}

// ─── Shape the resolved doc into WhatsAppQrData ───────────────────────────────

function docToQrData(doc: QrRequestResult): WhatsAppQrData {
  // If the backend embedded a full session object, use it
  if (doc.session) return doc.session;

  // Otherwise reconstruct from flat fields on the doc
  const qr =
    doc.qr_base64
      ? {
          content_type: doc.qr_content_type ?? "image/png",
          data_base64: doc.qr_base64,
        }
      : null;

  return {
    qr,
    container_id: doc._id,
    container_name: doc._id,
    entity_id: doc.entity_id,
    phone_number: doc.phone_number,
    ws_path: "",
    reused: doc.status === "session_reused",
  };
}

// ─── Main API function ────────────────────────────────────────────────────────

/**
 * Requests a WhatsApp QR code (or detects a reused session) for the given entity + phone.
 *
 * Entity types and when to use them:
 *  - "brand"      → entity_id = brand._id  (one session shared by brand)
 *  - "desk"       → entity_id = desk._id   (one session shared by desk)
 *  - "department" → entity_id = dept._id   (one session per department)
 *  - "user"       → entity_id = user._id   (one session per worker)
 *
 * Does NOT throw — always returns a typed result union.
 */
export async function getWhatsAppQr(
  params: GetWhatsAppQrParams
): Promise<WhatsAppQrResult> {
  const base = getWhatsAppApiBaseUrl();

  // ── Step 1: submit the QR request ─────────────────────────────────────────
  const createResult = await createQrRequest(base, params);
  if (!createResult.ok) {
    return { ok: false, status: 0, detail: createResult.detail! };
  }

  // ── Step 2: poll until resolved ────────────────────────────────────────────
  const doc = await pollForQrResult(base, params.entity_id, params.phone_number);

  if (!doc) {
    return {
      ok: false,
      status: 504,
      detail:
        "QR retrieval timed out after 90 seconds. The server is slow — wait a moment and retry.",
    };
  }

  if (doc.status === "error") {
    return {
      ok: false,
      status: 500,
      detail: doc.error ?? "The WhatsApp backend reported an error.",
    };
  }

  // status === "ready" | "session_reused"
  const data = docToQrData(doc);
  return { ok: true, data };
}
