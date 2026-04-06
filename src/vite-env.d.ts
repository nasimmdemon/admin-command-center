/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for admin_of_admins_be (no trailing slash). */
  readonly VITE_ADMIN_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
