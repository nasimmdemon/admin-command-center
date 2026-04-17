export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  CREATE_BRAND: "/create-brand",
  MONITOR: "/monitor",
  PROVIDERS: "/providers",
  STANDALONE: "/standalone",
  API_TEST: "/api-test",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
