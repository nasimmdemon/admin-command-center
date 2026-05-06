import type { AdminBrand, AdminClient } from "@/api/contract/domain-models";
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
  // Fire stats + clients in parallel
  const [statsRes, clRes] = await Promise.all([
    statsService.fetchAdminStatsSummary(),
    clientsService.listClients(),
  ]);

  if (!clRes.ok) {
    throw new Error(clRes.rawText || `Failed to load clients (HTTP ${clRes.status})`);
  }

  // Handle both { data: { client_count, ... } } and flat { client_count, ... } shapes
  let stats: statsService.AdminStatsPayload | null = null;
  if (statsRes.ok && statsRes.data) {
    const d = statsRes.data as Record<string, unknown>;
    const inner = (d.data ?? d) as Partial<statsService.AdminStatsPayload>;
    if (typeof inner.client_count === "number") {
      stats = inner as statsService.AdminStatsPayload;
    }
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

  // If the stats endpoint returned 0 or failed, derive counts from loaded data
  if (!stats || (stats.client_count === 0 && clients.length > 0)) {
    const brandCount = clients.reduce((sum, c) => sum + c.brands.length, 0);
    stats = {
      client_count: clients.length,
      brand_count: brandCount,
      deposit_count: stats?.deposit_count ?? 0,
      deposit_amount_total: stats?.deposit_amount_total ?? 0,
    };
  }

  return { clients, stats };
}

