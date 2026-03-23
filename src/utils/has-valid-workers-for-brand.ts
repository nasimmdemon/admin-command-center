import type { BrandConfig } from "@/types/brand-config-per-brand";

/** True if there is at least one valid uploaded worker row for this brand (matches VoIP/WhatsApp filtering). */
export function hasValidWorkersForBrand(
  uploadedWorkers: BrandConfig["uploadedWorkers"] | undefined,
  brandName: string
): boolean {
  const rows = uploadedWorkers ?? [];
  const norm = brandName.trim().toLowerCase();
  return rows.some((w) => {
    if (!w.valid) return false;
    if (!norm) return true;
    return (w.brandName?.trim().toLowerCase() ?? "") === norm;
  });
}
