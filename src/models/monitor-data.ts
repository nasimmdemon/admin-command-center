export interface BrandMetrics {
  deposits: string;
  withdrawals: string;
  clients: number;
  leads: number;
  /** Monthly revenue in USD - for quick position assessment */
  monthlyRevenue?: number;
}

export interface ClientBrand {
  /** Mongo ``_id`` string from admin API */
  id: string;
  name: string;
  domain: string;
  status: "Online" | "Offline" | "Warning";
  disabled?: boolean;
  metrics?: BrandMetrics;
}

export interface MonitorClient {
  /** Mongo ``_id`` string from admin API */
  id: string;
  name: string;
  clientName: string;
  status: string;
  paid: string;
  brands: ClientBrand[];
}

/** Local-only demo data (Monitor uses live API by default). */
export const MOCK_CLIENTS: MonitorClient[] = [
  {
    id: "1",
    name: "maiclptd",
    clientName: "GT45",
    status: "Good",
    paid: "12K",
    brands: [
      { id: "b1", name: "Brand Alpha", domain: "alpha.com", status: "Online", disabled: false, metrics: { deposits: "1.2M", withdrawals: "890K", clients: 342, leads: 1205, monthlyRevenue: 1250000 } },
      { id: "b2", name: "Brand Beta", domain: "beta.com", status: "Offline", disabled: false, metrics: { deposits: "45K", withdrawals: "38K", clients: 12, leads: 89, monthlyRevenue: 8500 } },
    ],
  },
  {
    id: "2",
    name: "johnwk",
    clientName: "BX12",
    status: "Good",
    paid: "8.5K",
    brands: [{ id: "b3", name: "Brand Gamma", domain: "gamma.com", status: "Online", disabled: false, metrics: { deposits: "520K", withdrawals: "410K", clients: 156, leads: 432, monthlyRevenue: 420000 } }],
  },
  { id: "3", name: "sarahm", clientName: "LP78", status: "Bad", paid: "2.1K", brands: [] },
  {
    id: "4",
    name: "alexfr",
    clientName: "NQ33",
    status: "Good",
    paid: "15K",
    brands: [{ id: "b4", name: "Brand Delta", domain: "delta.com", status: "Online", disabled: false, metrics: { deposits: "85K", withdrawals: "72K", clients: 28, leads: 156, monthlyRevenue: 18500 } }],
  },
  { id: "5", name: "robertl", clientName: "DW91", status: "Bad", paid: "500", brands: [] },
];

export const ACTIVE_BRANDS = [
  { name: "Brand Alpha", status: "Online", domain: "alpha.com" },
  { name: "Brand Beta", status: "Offline", domain: "beta.com" },
  { name: "Brand Gamma", status: "Warning", domain: "gamma.com" },
  { name: "Brand Delta", status: "Online", domain: "delta.com" },
];

export const SYSTEM_HEALTH_ITEMS = [
  { label: "CPU", value: 45, iconKey: "cpu", color: "bg-primary" },
  { label: "Memory", value: 62, iconKey: "hardDrive", color: "bg-warning" },
  { label: "Network", value: 75, iconKey: "wifi", suffix: "120 Mbps", color: "bg-success" },
] as const;
