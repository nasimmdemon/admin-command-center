/**
 * Step 1 — Central registry of admin backend routes (path + method).
 * Pattern: static readonly for fixed routes; helpers for dynamic path segments.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AdminEndpointDef = {
  readonly path: string;
  readonly method: HttpMethod;
};

function enc(s: string): string {
  return encodeURIComponent(s);
}

// ─── Aggregated stats (Monitor KPIs) ─────────────────────────────────────────

export class AdminStatsEndpoints {
  /** GET /admin/stats/summary */
  static readonly summary: AdminEndpointDef = {
    path: "/admin/stats/summary",
    method: "GET",
  };
}

// ─── Clients (aggregate root; no nested id lists on document) ───────────────

export class ClientsEndpoints {
  /** POST /admin/clients */
  static readonly create: AdminEndpointDef = {
    path: "/admin/clients",
    method: "POST",
  };

  /** GET /admin/clients */
  static readonly list: AdminEndpointDef = {
    path: "/admin/clients",
    method: "GET",
  };
}

/** GET /admin/clients/{client_id} — use with {@link ClientsEndpoints.list}.method */
export function getClientByIdPath(clientId: string): string {
  return `/admin/clients/${enc(clientId)}`;
}

export function clientByIdEndpoint(
  clientId: string,
  method: Extract<HttpMethod, "GET" | "PUT" | "PATCH" | "DELETE">
): AdminEndpointDef {
  return { path: getClientByIdPath(clientId), method };
}

// ─── Brands (each doc has client_id) ───────────────────────────────────────

export class BrandsEndpoints {
  /** POST /admin/brands — body includes client_id */
  static readonly create: AdminEndpointDef = {
    path: "/admin/brands",
    method: "POST",
  };

  /** GET /admin/brands — optional ?client_id= on caller side */
  static readonly list: AdminEndpointDef = {
    path: "/admin/brands",
    method: "GET",
  };
}

/** GET /admin/brands/{brand_id} */
export function getBrandByIdPath(brandId: string): string {
  return `/admin/brands/${enc(brandId)}`;
}

export function brandByIdEndpoint(
  brandId: string,
  method: Extract<HttpMethod, "GET" | "PUT" | "PATCH" | "DELETE">
): AdminEndpointDef {
  return { path: getBrandByIdPath(brandId), method };
}

// ─── Deposits (each doc has client_id; Client has no deposit_ids) ───────────

export class DepositsEndpoints {
  /** POST /admin/deposits — body includes client_id */
  static readonly create: AdminEndpointDef = {
    path: "/admin/deposits",
    method: "POST",
  };

  /** GET /admin/deposits — filter with ?client_id= on caller side */
  static readonly list: AdminEndpointDef = {
    path: "/admin/deposits",
    method: "GET",
  };
}

/** GET /admin/deposits/{deposit_id} */
export function getDepositByIdPath(depositId: string): string {
  return `/admin/deposits/${enc(depositId)}`;
}

export function depositByIdEndpoint(
  depositId: string,
  method: Extract<HttpMethod, "GET" | "PUT" | "PATCH" | "DELETE">
): AdminEndpointDef {
  return { path: getDepositByIdPath(depositId), method };
}

// ─── WhatsApp Auth ─────────────────────────────────────────────────────────

export class WhatsAppAuthEndpoints {
  /**
   * GET /auth/get-qr
   * Query params: entity_id, phone_number, entity_type?, force_new?
   * Response: WhatsAppQrResponse (see domain-models.ts)
   *
   * NOTE: Calls the WhatsApp backend (VITE_WHATSAPP_API_BASE_URL),
   *       NOT the admin backend. Use `whatsapp.service.ts`, not `adminRequest`.
   */
  static readonly getQr: AdminEndpointDef = {
    path: "/auth/get-qr",
    method: "GET",
  };
}

