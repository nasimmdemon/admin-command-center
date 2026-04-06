import type { AdminBrand, AdminClient } from "@/api/contract/domain-models";
import type { ClientBrand, MonitorClient } from "@/models/monitor-data";

function mapOperationalStatus(s?: string): ClientBrand["status"] {
  if (s === "Offline") return "Offline";
  if (s === "Warning") return "Warning";
  return "Online";
}

export function mapBrandDoc(doc: AdminBrand): ClientBrand {
  const id = doc._id != null ? String(doc._id) : "";
  return {
    id,
    name: doc.name ?? "",
    domain: doc.domain ?? "",
    status: mapOperationalStatus(doc.operational_status),
    disabled: !!doc.disabled,
    metrics: undefined,
  };
}

export function mapClientDoc(doc: AdminClient): MonitorClient {
  const id = doc._id != null ? String(doc._id) : "";
  return {
    id,
    name: doc.name ?? "",
    clientName: doc.client_code ?? doc.external_id ?? doc.name ?? "—",
    status: doc.monitor_status === "Bad" ? "Bad" : "Good",
    paid: doc.paid_label ?? "—",
    brands: [],
  };
}
