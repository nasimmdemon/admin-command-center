/**
 * Step 0 — API base URL for all admin backend calls (Vite injects VITE_* at build time).
 */

export const DEFAULT_ADMIN_API_BASE_URL = "http://localhost:9302";
export const DEFAULT_ADMIN_PROD_API_BASE_URL = "https://beadmin.gogamify.xyz";

/**
 * Pure normalizer for tests and callers that inject a raw base string.
 */
export function normalizeAdminApiBaseUrl(
  raw: string | undefined | null,
  fallback: string = DEFAULT_ADMIN_API_BASE_URL
): string {
  const base = (raw?.trim() || fallback).trim();
  return base.replace(/\/+$/, "");
}

/**
 * Base URL with no trailing slash. Used by `http-client` to resolve full URLs.
 */
export function getAdminApiBaseUrl(): string {
  if (import.meta.env.PROD) {
    return normalizeAdminApiBaseUrl(
      import.meta.env.VITE_ADMIN_PROD_API_BASE_URL,
      DEFAULT_ADMIN_PROD_API_BASE_URL
    );
  }

  return normalizeAdminApiBaseUrl(
    import.meta.env.VITE_ADMIN_API_BASE_URL,
    DEFAULT_ADMIN_API_BASE_URL
  );
}

// ─── WhatsApp API ────────────────────────────────────────────────

export const DEFAULT_WHATSAPP_API_LOCAL_BASE_URL = "http://localhost:9080";
export const DEFAULT_WHATSAPP_API_BASE_URL =
  "https://whatsapp.mainstreetcpltd.com";

/**
 * Base URL for the WhatsApp integration backend (WAHA/routing server).
 * Separate from the admin API.
 *
 * - Dev:  VITE_WHATSAPP_API_LOCAL_BASE_URL (defaults to localhost)
 * - Prod: VITE_WHATSAPP_API_BASE_URL (defaults to whatsapp.mainstreetcpltd.com)
 */
export function getWhatsAppApiBaseUrl(): string {
  if (import.meta.env.PROD) {
    return normalizeAdminApiBaseUrl(
      import.meta.env.VITE_WHATSAPP_API_BASE_URL,
      DEFAULT_WHATSAPP_API_BASE_URL
    );
  }

  return normalizeAdminApiBaseUrl(
    import.meta.env.VITE_WHATSAPP_API_LOCAL_BASE_URL,
    DEFAULT_WHATSAPP_API_LOCAL_BASE_URL
  );
}
