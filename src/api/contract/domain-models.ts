/**
 * Step 0 — Domain contract for Admin of Admins ↔ backend (Mongo-oriented shapes).
 *
 * Relationship rule (single source of truth):
 * - Child documents (e.g. Brand, Deposit) carry `client_id` pointing at the Client document.
 * - The Client model does NOT maintain `deposit_ids`, `brand_ids`, or similar reverse arrays.
 * - Query children by filtering on `client_id` instead of walking arrays on the client.
 */

/** Owning party; other entities reference this via `client_id` only. */
export interface AdminClient {
  _id?: string;
  name: string;
  /** Optional external / CRM id */
  external_id?: string;
  /** Monitor “client name” column */
  client_code?: string;
  monitor_status?: string;
  paid_label?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Brand belongs to exactly one client. The client row does not list brand ids.
 */
export interface AdminBrand {
  _id?: string;
  /** FK → AdminClient._id (authoritative link) */
  client_id: string;
  name: string;
  domain?: string;
  substitute_domain?: string;
  /** Full wizard payload or reference id — align with backend when Step 1+ land */
  config?: Record<string, unknown>;
  disabled?: boolean;
  /** Online | Offline | Warning — Monitor status dot */
  operational_status?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Deposit belongs to a client via `client_id` only (no `deposit_ids` on Client).
 */
export interface AdminDeposit {
  _id?: string;
  /** FK → AdminClient._id */
  client_id: string;
  amount?: number;
  currency?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

/** Generic API envelope — adjust when backend matches routing_server WrappedResponse. */
export type AdminApiEnvelope<T = unknown> = {
  data?: T;
  message?: string;
  status?: number;
  error?: unknown;
};

// ─── WhatsApp Auth (/auth/get-qr) ────────────────────────────────────────────

/**
 * The `qr` object inside a WhatsApp QR response.
 * `data_base64` is a raw base64 string (no data-URI prefix).
 */
export interface WhatsAppQrImage {
  content_type: string;  // e.g. "image/png"
  data_base64: string;   // pure base64, no "data:...;base64," prefix
}

/**
 * `data` payload returned by GET /auth/get-qr (both new QR and session-reuse cases).
 * When `qr` is null the session already exists and the frontend should skip the QR screen.
 */
export interface WhatsAppQrData {
  /** Present when a new QR was generated; null means session is already active. */
  qr: WhatsAppQrImage | null;
  container_id: string;
  container_name: string;
  /** Base URL of the WAHA container (e.g. "http://localhost:9001"). */
  base_url?: string;
  /** Identifies which entity (brand / desk / dep / user) owns this session. */
  entity_id: string;
  phone_number: string;
  /** WebSocket path for real-time status updates. */
  ws_path: string;
  /** Present only when an existing session was reused. */
  session_id?: string;
  reused?: boolean;
}

/** Full envelope returned by GET /auth/get-qr — mirrors the spec `status_code + message + data` shape. */
export interface WhatsAppQrResponse {
  status_code: number;
  message: string;
  data: WhatsAppQrData;
}

/**
 * Scope options for a WhatsApp session.
 * Passed as `entity_type` to GET /auth/get-qr.
 */
export type WhatsAppEntityType = "brand" | "desk" | "department" | "user";

/** Parameters for GET /auth/get-qr */
export interface GetWhatsAppQrParams {
  entity_id: string;               // e.g. brand._id, desk._id, user._id
  phone_number: string;            // e.g. "+15551234567"
  entity_type?: WhatsAppEntityType; // default: "user" per spec
  force_new?: boolean;             // default: false
}
