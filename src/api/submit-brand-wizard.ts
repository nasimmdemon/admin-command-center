/**
 * Orchestrates Step 2–3: create/find client, then create each brand with ``client_id`` + config in DB.
 */
import * as brandsService from "@/api/services/brands.service";
import * as clientsService from "@/api/services/clients.service";
import type { BrandEntry } from "@/controllers/useCreateBrand";
import type { BrandConfig } from "@/types/brand-config-per-brand";
import { buildCleanExportConfig } from "@/types/brand-config-per-brand";

export type SubmitWizardInput = {
  brands: BrandEntry[];
  brandConfigs: BrandConfig[];
  /** From ``location.state.clientId`` when navigating from monitor, etc. */
  existingClientId?: string;
};

export type SubmitWizardResult = {
  clientId: string;
  brandIds: string[];
};

function idFromEnvelope(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const inner = (body as { data?: { _id?: unknown } }).data;
  const id = inner?._id;
  return id != null && String(id) !== "" ? String(id) : undefined;
}

/**
 * POST /admin/clients (if needed) then POST /admin/brands for each row.
 */
export async function submitBrandWizardToServer(
  input: SubmitWizardInput
): Promise<SubmitWizardResult> {
  const { brands, brandConfigs, existingClientId } = input;
  if (!brands.length) {
    throw new Error("No brands to save");
  }

  let clientId = existingClientId?.trim();
  if (!clientId) {
    const label =
      brands[0]?.name?.trim() ||
      brands[0]?.domain?.trim() ||
      "Wizard client";
    const cr = await clientsService.createClient({ name: label });
    if (!cr.ok) {
      throw new Error(cr.rawText || `Create client failed (HTTP ${cr.status})`);
    }
    clientId = idFromEnvelope(cr.data);
    if (!clientId) {
      throw new Error("Client created but response had no data._id");
    }
  }

  const brandIds: string[] = [];
  for (let i = 0; i < brands.length; i++) {
    const b = brands[i];
    const cfg = brandConfigs[i];
    const clean = cfg ? buildCleanExportConfig(cfg) : undefined;
    
    if (b._id) {
      const br = await brandsService.updateBrand(b._id, {
        name: b.name?.trim() || b.domain?.trim() || `Brand ${i + 1}`,
        domain: b.domain?.trim() || undefined,
        substitute_domain: b.substituteDomain?.trim() || undefined,
        config: clean as Record<string, unknown>,
      });
      if (!br.ok) {
        throw new Error(br.rawText || `Update brand failed (HTTP ${br.status})`);
      }
      brandIds.push(b._id);
    } else {
      const br = await brandsService.createBrand({
        client_id: clientId,
        name: b.name?.trim() || b.domain?.trim() || `Brand ${i + 1}`,
        domain: b.domain?.trim() || undefined,
        substitute_domain: b.substituteDomain?.trim() || undefined,
        config: clean as Record<string, unknown>,
      });
      if (!br.ok) {
        throw new Error(br.rawText || `Create brand failed (HTTP ${br.status})`);
      }
      const bid = idFromEnvelope(br.data);
      if (!bid) {
        throw new Error("Brand created but response had no data._id");
      }
      brandIds.push(bid);
    }
  }

  return { clientId, brandIds };
}
