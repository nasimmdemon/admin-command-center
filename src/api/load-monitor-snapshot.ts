import type { AdminApiEnvelope, AdminBrand, AdminClient } from "@/api/contract/domain-models";
import { mapBrandDoc, mapClientDoc } from "@/api/map-admin-to-monitor";
import * as brandsService from "@/api/services/brands.service";
import * as clientsService from "@/api/services/clients.service";
import * as statsService from "@/api/services/admin-stats.service";
import type { MonitorClient } from "@/models/monitor-data";

function listFromEnvelope<T>(parsed: unknown): T[] {
  if (!parsed || typeof parsed !== "object") return [];
  const d = (parsed as AdminApiEnvelope<T[]>).data;
  return Array.isArray(d) ? d : [];
}

export type MonitorSnapshot = {
  clients: MonitorClient[];
  stats: statsService.AdminStatsPayload | null;
};

/**
 * Loads clients, nested brands (via ``client_id``), and summary stats from the API.
 */
export async function loadMonitorSnapshot(): Promise<MonitorSnapshot> {
  const statsRes = await statsService.fetchAdminStatsSummary();
  const stats =
    statsRes.ok && statsRes.data && typeof statsRes.data === "object"
      ? (statsRes.data as AdminApiEnvelope<statsService.AdminStatsPayload>).data ??
        null
      : null;

  const clRes = await clientsService.listClients();
  if (!clRes.ok) {
    throw new Error(clRes.rawText || `Failed to load clients (HTTP ${clRes.status})`);
  }

  const rawClients = listFromEnvelope<AdminClient>(clRes.data);
  const clients: MonitorClient[] = [];

  for (const row of rawClients) {
    const mc = mapClientDoc(row);
    if (!mc.id) continue;

    const bRes = await brandsService.listBrands(mc.id);
    if (!bRes.ok) {
      throw new Error(bRes.rawText || `Failed to load brands (HTTP ${bRes.status})`);
    }
    const rawBrands = listFromEnvelope<AdminBrand>(bRes.data);
    mc.brands = rawBrands.map((b) => mapBrandDoc(b));
    clients.push(mc);
  }

  return { clients, stats };
}
