export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  CREATE_BRAND: "/create-brand",
  MONITOR: "/monitor",
  PROVIDERS: "/providers",
  STANDALONE: "/standalone",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
