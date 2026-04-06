/**
 * Step 0 — API base URL for all admin backend calls (Vite injects VITE_* at build time).
 */

export const DEFAULT_ADMIN_API_BASE_URL = "http://localhost:9302";

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
  return normalizeAdminApiBaseUrl(import.meta.env.VITE_ADMIN_API_BASE_URL);
}

// ─── WhatsApp API ────────────────────────────────────────────────

export const DEFAULT_WHATSAPP_API_BASE_URL = "http://localhost:8000";

/**
 * Base URL for the WhatsApp integration backend (WAHA/routing server).
 * Separate from the admin API — configure via VITE_WHATSAPP_API_BASE_URL.
 */
export function getWhatsAppApiBaseUrl(): string {
  return normalizeAdminApiBaseUrl(
    import.meta.env.VITE_WHATSAPP_API_BASE_URL,
    DEFAULT_WHATSAPP_API_BASE_URL
  );
}
