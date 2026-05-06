/**
 * Detects configuration mismatches between a source brand's config blob
 * and the target use-case's constraints.
 *
 * Called after the user picks a source brand in same_db / same_config mode
 * and before they advance to Step 1, so we can surface warnings.
 */

import type { UseCase } from "@/types/brand-config-per-brand";

export interface ConfigMismatch {
  /** Short field label shown in the warning list */
  field: string;
  /** Full explanation for the user */
  message: string;
  /**
   * Which fields in BrandConfig are affected.
   * Used by the "Reset to use-case defaults" action.
   */
  affectedKeys: string[];
}

// ─── Fields considered "sensitive" that should NEVER be copied verbatim ──────

/**
 * These keys are always stripped from the cloned config regardless of use case.
 * (API keys, phone numbers, QR codes, uploaded CSV data, etc.)
 */
export const ALWAYS_STRIP_KEYS: string[] = [
  "mailerooApiKey",
  "mailerooFromEmail",
  "alexdersApiKey",
  "alexdersFromEmail",
  "voipPhoneNumbers",
  "voipCoverageMap",
  "voipDeskConfigs",
  "voipWorkerConfigs",
  "voipOriginCountryInput",
  "voipAddOutboundFrom",
  "voipOutboundCountryInput",
  "providersMapData",
  "whatsappQrCode",
  "whatsappDeskQrCode",
  "whatsappWorkerEntries",
  "uploadedWorkers",
  "logoUrl",
];

// ─── Mismatch detection ────────────────────────────────────────────────────────

/**
 * Compares a source brand config (raw object from the DB) against the target
 * use case and returns an array of human-readable mismatch warnings.
 *
 * Returns an empty array when there are no issues.
 */
export function detectConfigMismatches(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceConfig: Record<string, any>,
  targetUseCase: UseCase
): ConfigMismatch[] {
  const warnings: ConfigMismatch[] = [];

  // ── regulated constraints ───────────────────────────────────────────────────
  if (targetUseCase === "regulated") {
    // KYC must be enabled in regulated mode
    if (sourceConfig.brandHasKyc === false || sourceConfig.kycEnabled === false) {
      warnings.push({
        field: "KYC — disabled in source",
        message:
          "The source brand had KYC disabled. Regulated mode requires KYC to be active. It will be forced on.",
        affectedKeys: ["brandHasKyc", "kycEnabled"],
      });
    }

    // KYC must be required to trade in regulated mode
    if (
      sourceConfig.brandHasKyc !== false &&
      sourceConfig.brandRequiresKycToTrade === false
    ) {
      warnings.push({
        field: "KYC to trade — not required in source",
        message:
          "The source brand did not require KYC to trade. Regulated mode enforces KYC before trading.",
        affectedKeys: ["brandRequiresKycToTrade"],
      });
    }

    // File Complaint should not be on in regulated mode
    if (sourceConfig.enableFileComplaint === true) {
      warnings.push({
        field: "File Complaint — enabled in source",
        message:
          'The source brand had "File Complaint" enabled. This feature is only for Brand Recovery mode and will be turned off.',
        affectedKeys: ["enableFileComplaint"],
      });
    }
  }

  // ── brand_recovery constraints ──────────────────────────────────────────────
  if (targetUseCase === "brand_recovery") {
    // WebTrader / trading platform is irrelevant in recovery mode
    const hasTrader =
      sourceConfig.traderPlatform &&
      sourceConfig.traderPlatform !== "" &&
      sourceConfig.traderPlatform !== "NONE";
    if (hasTrader) {
      warnings.push({
        field: "Trader Platform",
        message:
          "The source brand had a trading platform configured. Brand Recovery mode disables internal dealing and WebTrader.",
        affectedKeys: ["traderPlatform", "traderMarkets"],
      });
    }

    // Trading fees are irrelevant in recovery mode
    const hasOpenFee =
      sourceConfig.openPositionFeeEnabled === true &&
      parseFloat(sourceConfig.openPositionFeeValue ?? "0") !== 0;
    const hasCloseFee =
      sourceConfig.closePositionFeeEnabled === true &&
      parseFloat(sourceConfig.closePositionFeeValue ?? "0") !== 0;
    if (hasOpenFee || hasCloseFee) {
      warnings.push({
        field: "Trading Fees",
        message:
          "The source brand had trading fees configured. Brand Recovery has no dealing, so fees will be ignored.",
        affectedKeys: [
          "openPositionFeeEnabled",
          "openPositionFeeValue",
          "closePositionFeeEnabled",
          "closePositionFeeValue",
        ],
      });
    }

    // Client TAs not relevant in recovery
    if (sourceConfig.allowMultiTas === true) {
      warnings.push({
        field: "Client Trading Accounts",
        message:
          "The source brand allowed multiple trading accounts. Brand Recovery mode does not use trading accounts.",
        affectedKeys: ["allowMultiTas", "maxPerClient", "allowClientSelectLeverage", "maxLeverage"],
      });
    }
  }

  // ── unregulated constraints ─────────────────────────────────────────────────
  if (targetUseCase === "unregulated") {
    // File Complaint should not be on in unregulated mode
    if (sourceConfig.enableFileComplaint === true) {
      warnings.push({
        field: "File Complaint — enabled in source",
        message:
          '"File Complaint" is a Brand Recovery-only feature. It will be turned off for this brand.',
        affectedKeys: ["enableFileComplaint"],
      });
    }
  }

  return warnings;
}

// ─── Use-case default overrides ───────────────────────────────────────────────

/**
 * Returns the field key → value pairs that should be reset to defaults
 * for a given mismatch (used by the "Reset to use-case defaults" action).
 */
export function getMismatchResetValues(
  mismatch: ConfigMismatch,
  targetUseCase: UseCase
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of mismatch.affectedKeys) {
    switch (key) {
      case "brandHasKyc":
        result[key] = targetUseCase === "regulated" ? true : true; // stays true either way
        break;
      case "kycEnabled":
        result[key] = targetUseCase === "regulated" ? true : true;
        break;
      case "brandRequiresKycToTrade":
        result[key] = targetUseCase === "regulated" ? true : false;
        break;
      case "enableFileComplaint":
        result[key] = targetUseCase === "brand_recovery" ? true : false;
        break;
      case "traderPlatform":
        result[key] = targetUseCase === "brand_recovery" ? "NONE" : "DEALING_MENU_WEBTRADER";
        break;
      case "openPositionFeeEnabled":
      case "closePositionFeeEnabled":
        result[key] = false;
        break;
      case "openPositionFeeValue":
      case "closePositionFeeValue":
        result[key] = "0";
        break;
      case "allowMultiTas":
        result[key] = false;
        break;
      case "maxPerClient":
        result[key] = "1";
        break;
      case "allowClientSelectLeverage":
        result[key] = false;
        break;
      case "maxLeverage":
        result[key] = "1";
        break;
      default:
        // no default for unknown keys
        break;
    }
  }

  return result;
}
