/**
 * Per-worker VoIP row (extends coverage with phone + include + status).
 */
export interface VoipWorkerConfigEntry {
  workerEmail: string;
  /** When false, this worker is excluded from per-worker VoIP allocation */
  included: boolean;
  /** Assigned VoIP line / extension (from provider) */
  phoneNumber: string;
  coverageMap: Record<string, string[]>;
  /** pending = not provisioned yet; ready = number assigned; error = provisioning failed */
  voipStatus: "pending" | "ready" | "error";
  errorMessage?: string;
}

/**
 * Per-worker WhatsApp: include/exclude + QR pairing state (not one QR for everyone).
 */
export interface WhatsAppWorkerEntry {
  workerEmail: string;
  full_name: string;
  included: boolean;
  /** Pairing URL encoded in QR; backend sets when session is created */
  pairingUrl: string;
  /** pending = scan QR; linked = session ok; error = scan failed / session error */
  pairingStatus: "pending" | "linked" | "error";
  errorMessage?: string;
}

/** Example origin→destinations for UI map preview (not from provider). */
export const SAMPLE_WORKER_COVERAGE_MAP: Record<string, string[]> = {
  US: ["US", "CA", "GB", "FR"],
  GB: ["GB", "US", "DE"],
};

export function defaultVoipWorkerEntry(email: string, coverageMap: Record<string, string[]> = {}): VoipWorkerConfigEntry {
  return {
    workerEmail: email,
    included: true,
    phoneNumber: "",
    coverageMap,
    voipStatus: "pending",
  };
}

export function defaultWhatsAppWorkerEntry(email: string, fullName: string, pairingUrl: string): WhatsAppWorkerEntry {
  return {
    workerEmail: email,
    full_name: fullName,
    included: true,
    pairingUrl,
    pairingStatus: "pending",
  };
}

/** Merge uploaded valid workers with existing configs (preserve by email). */
export function syncVoipWorkerConfigs(
  validWorkers: Array<{ email: string; full_name: string }>,
  existing: Partial<VoipWorkerConfigEntry>[]
): VoipWorkerConfigEntry[] {
  const byEmail = new Map<string, VoipWorkerConfigEntry>();
  for (const e of existing) {
    const email = e.workerEmail?.trim().toLowerCase();
    if (!email) continue;
    byEmail.set(email, {
      workerEmail: e.workerEmail!,
      included: e.included !== false,
      phoneNumber: e.phoneNumber ?? "",
      coverageMap: e.coverageMap && Object.keys(e.coverageMap).length ? e.coverageMap : {},
      voipStatus: e.voipStatus ?? "pending",
      errorMessage: e.errorMessage,
    });
  }
  const next: VoipWorkerConfigEntry[] = [];
  for (const w of validWorkers) {
    const key = w.email.trim().toLowerCase();
    const prev = byEmail.get(key);
    if (prev) {
      next.push({ ...prev, workerEmail: w.email });
    } else {
      next.push(defaultVoipWorkerEntry(w.email));
    }
  }
  return next;
}

export function syncWhatsAppWorkerEntries(
  validWorkers: Array<{ email: string; full_name: string }>,
  existing: Partial<WhatsAppWorkerEntry>[],
  mockPairingBase: string
): WhatsAppWorkerEntry[] {
  const byEmail = new Map<string, WhatsAppWorkerEntry>();
  for (const e of existing) {
    const email = e.workerEmail?.trim().toLowerCase();
    if (!email) continue;
    byEmail.set(email, {
      workerEmail: e.workerEmail!,
      full_name: e.full_name ?? "",
      included: e.included !== false,
      pairingUrl: e.pairingUrl ?? `${mockPairingBase}&worker=${encodeURIComponent(e.workerEmail!)}`,
      pairingStatus: e.pairingStatus ?? "pending",
      errorMessage: e.errorMessage,
    });
  }
  const next: WhatsAppWorkerEntry[] = [];
  for (const w of validWorkers) {
    const key = w.email.trim().toLowerCase();
    const prev = byEmail.get(key);
    const url = `${mockPairingBase}&worker=${encodeURIComponent(w.email)}`;
    if (prev) {
      next.push({ ...prev, workerEmail: w.email, full_name: w.full_name || prev.full_name, pairingUrl: prev.pairingUrl || url });
    } else {
      next.push(defaultWhatsAppWorkerEntry(w.email, w.full_name, url));
    }
  }
  return next;
}
