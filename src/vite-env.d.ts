/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for admin_of_admins_be (no trailing slash). */
  readonly VITE_ADMIN_API_BASE_URL?: string;
  /** Base URL for admin_of_admins_be when building for prod/preprod. */
  readonly VITE_ADMIN_PROD_API_BASE_URL?: string;

  /** WhatsApp integration backend base URL for local dev. */
  readonly VITE_WHATSAPP_API_LOCAL_BASE_URL?: string;
  /** WhatsApp integration backend base URL for prod/preprod. */
  readonly VITE_WHATSAPP_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
