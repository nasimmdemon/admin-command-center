export const MOCK_CLIENTS = [
  { id: 1, name: "maiclptd", clientName: "GT45", status: "Good", paid: "12K" },
  { id: 2, name: "johnwk", clientName: "BX12", status: "Good", paid: "8.5K" },
  { id: 3, name: "sarahm", clientName: "LP78", status: "Bad", paid: "2.1K" },
  { id: 4, name: "alexfr", clientName: "NQ33", status: "Good", paid: "15K" },
  { id: 5, name: "robertl", clientName: "DW91", status: "Bad", paid: "500" },
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
