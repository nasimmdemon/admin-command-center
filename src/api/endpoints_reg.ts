/**
 * Central registry of admin backend routes (path + method).
 *
 * Rules enforced here:
 *  - Only GET and POST are used — no PATCH, PUT, DELETE.
 *  - Every path string lives ONLY here; services import from this file.
 *  - Dynamic segments are produced by typed helper functions, not inline template literals.
 */

export type HttpMethod = "GET" | "POST";

export type AdminEndpointDef = {
  readonly path: string;
  readonly method: HttpMethod;
};

function enc(s: string): string {
  return encodeURIComponent(s);
}

// ─── Stats (Monitor KPIs) ────────────────────────────────────────────────────

export class AdminStatsEndpoints {
  /** GET /admin/stats/summary */
  static readonly summary: AdminEndpointDef = {
    path: "/admin/stats/summary",
    method: "GET",
  };
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export class ClientsEndpoints {
  /** POST /admin/clients/create */
  static readonly create: AdminEndpointDef = {
    path: "/admin/clients/create",
    method: "POST",
  };

  /** GET /admin/clients/list */
  static readonly list: AdminEndpointDef = {
    path: "/admin/clients/list",
    method: "GET",
  };

  /** POST /admin/clients/update  (document_id goes in the body) */
  static readonly update: AdminEndpointDef = {
    path: "/admin/clients/update",
    method: "POST",
  };
}

/** GET /admin/clients/get/{document_id} */
export function getClientByIdEndpoint(documentId: string): AdminEndpointDef {
  return { path: `/admin/clients/get/${enc(documentId)}`, method: "GET" };
}

// ─── Brands ──────────────────────────────────────────────────────────────────

export class BrandsEndpoints {
  /** POST /admin/brands/create  (body includes client_id) */
  static readonly create: AdminEndpointDef = {
    path: "/admin/brands/create",
    method: "POST",
  };

  /** GET /admin/brands/list  (optional ?client_id= query param) */
  static readonly list: AdminEndpointDef = {
    path: "/admin/brands/list",
    method: "GET",
  };

  /** POST /admin/brands/update  (document_id goes in the body) */
  static readonly update: AdminEndpointDef = {
    path: "/admin/brands/update",
    method: "POST",
  };
}

/** GET /admin/brands/get/{document_id} */
export function getBrandByIdEndpoint(documentId: string): AdminEndpointDef {
  return { path: `/admin/brands/get/${enc(documentId)}`, method: "GET" };
}

// ─── Deposits ────────────────────────────────────────────────────────────────

export class DepositsEndpoints {
  /** POST /admin/deposits/create  (body includes client_id) */
  static readonly create: AdminEndpointDef = {
    path: "/admin/deposits/create",
    method: "POST",
  };

  /** GET /admin/deposits/list  (optional ?client_id= query param) */
  static readonly list: AdminEndpointDef = {
    path: "/admin/deposits/list",
    method: "GET",
  };

  /** POST /admin/deposits/update  (document_id goes in the body) */
  static readonly update: AdminEndpointDef = {
    path: "/admin/deposits/update",
    method: "POST",
  };
}

/** GET /admin/deposits/get/{document_id} */
export function getDepositByIdEndpoint(documentId: string): AdminEndpointDef {
  return { path: `/admin/deposits/get/${enc(documentId)}`, method: "GET" };
}

// ─── WhatsApp Auth ────────────────────────────────────────────────────────────

export class WhatsAppAuthEndpoints {
  /**
   * GET /auth/get-qr
   * Query params: entity_id, phone_number, entity_type?, force_new?
   *
   * NOTE: Calls the WhatsApp backend (VITE_WHATSAPP_API_BASE_URL),
   *       NOT the admin backend. Use `whatsapp.service.ts`, not `adminRequest`.
   */
  static readonly getQr: AdminEndpointDef = {
    path: "/auth/get-qr",
    method: "GET",
  };
}
