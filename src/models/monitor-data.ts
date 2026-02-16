export interface ClientBrand {
  id: number;
  name: string;
  domain: string;
  status: "Online" | "Offline" | "Warning";
  disabled?: boolean;
}

export interface MonitorClient {
  id: number;
  name: string;
  clientName: string;
  status: string;
  paid: string;
  brands: ClientBrand[];
}

export const MOCK_CLIENTS: MonitorClient[] = [
  { id: 1, name: "maiclptd", clientName: "GT45", status: "Good", paid: "12K", brands: [{ id: 1, name: "Brand Alpha", domain: "alpha.com", status: "Online", disabled: false }, { id: 2, name: "Brand Beta", domain: "beta.com", status: "Offline", disabled: false }] },
  { id: 2, name: "johnwk", clientName: "BX12", status: "Good", paid: "8.5K", brands: [{ id: 3, name: "Brand Gamma", domain: "gamma.com", status: "Online", disabled: false }] },
  { id: 3, name: "sarahm", clientName: "LP78", status: "Bad", paid: "2.1K", brands: [] },
  { id: 4, name: "alexfr", clientName: "NQ33", status: "Good", paid: "15K", brands: [{ id: 4, name: "Brand Delta", domain: "delta.com", status: "Online", disabled: false }] },
  { id: 5, name: "robertl", clientName: "DW91", status: "Bad", paid: "500", brands: [] },
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
