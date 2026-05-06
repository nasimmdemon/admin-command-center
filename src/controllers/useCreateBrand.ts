import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { TOTAL_BRAND_WIZARD_STEPS } from "@/models/brand-wizard-steps";
import { BrandConfig, getDefaultBrandConfig, buildExportConfig } from "@/types/brand-config-per-brand";
import type { UseCase } from "@/types/brand-config-per-brand";
import { detectConfigMismatches, ALWAYS_STRIP_KEYS } from "@/utils/config-mismatch";
import type { ConfigMismatch } from "@/utils/config-mismatch";
export type { UseCase } from "@/types/brand-config-per-brand";
export type { ConfigMismatch } from "@/utils/config-mismatch";

export interface BrandEntry {
  /** Populated by the server after the brand is saved to the database. Used as entity_id for WhatsApp QR sessions. */
  _id?: string;
  name: string;
  domain: string;
  /** Fallback domain; same content deployed to both. When main is not live, substitute shows content automatically */
  substituteDomain: string;
}

export type CreateMode = "simple" | "same_db" | "same_config";

/** The source brand the user has chosen to clone (same_db / same_config mode) */
export interface SourceBrandSelection {
  clientId: string;
  clientName: string;
  brandId: string;
  brandName: string;
  /** Raw config blob fetched from the DB. Undefined until the brand is fetched. */
  brandConfig?: Record<string, unknown>;
}

export interface CreateBrandState {
  step: number;
  createMode: CreateMode | null;
  /** Use case governs feature enforcement (regulated/unregulated/brand_recovery) */
  useCase: UseCase | null;
  brands: BrandEntry[];
  brandConfigs: BrandConfig[];
  currentBrandSlide: number;
  /** Chosen source brand for same_db / same_config modes */
  sourceBrandSelection: SourceBrandSelection | null;
  /** Mismatch warnings computed when config is copied from source brand */
  configMismatchWarnings: ConfigMismatch[];
}

export interface CreateBrandLocationState {
  clientId?: string | number;
  clientName?: string;
  editBrand?: { id: string | number; name: string; domain: string };
  /** When editing, start at this step (from category modal) */
  startStep?: number;
}

const getDefaultInitialState = (): CreateBrandState => ({
  step: 0,
  createMode: null,
  useCase: null,
  brands: [{ name: "", domain: "", substituteDomain: "" }],
  brandConfigs: [getDefaultBrandConfig()],
  currentBrandSlide: 0,
  sourceBrandSelection: null,
  configMismatchWarnings: [],
});

function getInitialStateFromLocation(locationState: CreateBrandLocationState | null): CreateBrandState {
  if (locationState?.editBrand) {
    const d = locationState.editBrand.domain;
    const startStep = Math.max(1, Math.min(locationState.startStep ?? 1, TOTAL_BRAND_WIZARD_STEPS));
    const id =
      locationState.editBrand.id != null ? String(locationState.editBrand.id) : undefined;
    return {
      step: startStep,
      createMode: "simple",
      useCase: null,
      brands: [
        {
          name: locationState.editBrand.name,
          domain: d,
          substituteDomain: d,
          ...(id ? { _id: id } : {}),
        },
      ],
      brandConfigs: [getDefaultBrandConfig()],
      currentBrandSlide: 0,
      sourceBrandSelection: null,
      configMismatchWarnings: [],
    };
  }
  return getDefaultInitialState();
}

/**
 * Strips sensitive / device-specific fields from a raw source config blob
 * so they are never blindly copied to a new brand.
 */
function stripSensitiveFields(raw: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...raw };
  for (const key of ALWAYS_STRIP_KEYS) {
    delete copy[key];
  }
  return copy;
}

export function useCreateBrand() {
  const location = useLocation();
  const locationState = location.state as CreateBrandLocationState | null;
  const initialState = useMemo(
    () => getInitialStateFromLocation(locationState),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [state, setState] = useState<CreateBrandState>(initialState);

  const update = <K extends keyof CreateBrandState>(key: K, value: CreateBrandState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const setCreateMode = (mode: CreateMode) => {
    setState((s) => ({
      ...s,
      createMode: mode,
      // Clear source selection when mode changes away from clone modes
      sourceBrandSelection:
        mode === "same_db" || mode === "same_config" ? s.sourceBrandSelection : null,
      configMismatchWarnings: [],
    }));
  };

  const setUseCase = (uc: UseCase) => {
    setState((s) => ({ ...s, useCase: uc }));
  };

  const setSourceBrandSelection = (sel: SourceBrandSelection | null) => {
    setState((s) => ({ ...s, sourceBrandSelection: sel, configMismatchWarnings: [] }));
  };

  /**
   * Called when advancing from Step 0 in same_db / same_config mode.
   * Merges the source brand config into all brandConfigs (stripping sensitive fields),
   * then computes mismatch warnings for the target use case.
   */
  const applySourceBrandConfig = () => {
    setState((s) => {
      const { sourceBrandSelection, useCase, brandConfigs } = s;
      if (!sourceBrandSelection?.brandConfig || !useCase) return s;

      const stripped = stripSensitiveFields(sourceBrandSelection.brandConfig);

      // Merge stripped source config into every brand config slot
      const updatedConfigs = brandConfigs.map((existing) =>
        buildExportConfig({ ...stripped, ...existing } as Parameters<typeof buildExportConfig>[0])
      );

      // Detect mismatches between source and target use case
      const warnings = detectConfigMismatches(stripped, useCase);

      return { ...s, brandConfigs: updatedConfigs, configMismatchWarnings: warnings };
    });
  };

  /**
   * Dismisses mismatch warnings without changing any config values.
   */
  const dismissMismatchWarnings = () => {
    setState((s) => ({ ...s, configMismatchWarnings: [] }));
  };

  /**
   * Resets only the fields flagged by a specific mismatch warning back to
   * their use-case-appropriate defaults across all brand config slots.
   */
  const resetMismatchedFields = (overrides: Record<string, unknown>) => {
    setState((s) => ({
      ...s,
      brandConfigs: s.brandConfigs.map((cfg) =>
        buildExportConfig({ ...cfg, ...overrides } as Parameters<typeof buildExportConfig>[0])
      ),
      configMismatchWarnings: [],
    }));
  };

  const addBrand = () =>
    setState((s) => ({
      ...s,
      brands: [...s.brands, { name: "", domain: "", substituteDomain: "" }],
      brandConfigs: [...s.brandConfigs, getDefaultBrandConfig()],
    }));

  const removeBrand = (i: number) =>
    setState((s) => ({
      ...s,
      brands: s.brands.filter((_, idx) => idx !== i),
      brandConfigs: s.brandConfigs.filter((_, idx) => idx !== i),
      currentBrandSlide: Math.min(s.currentBrandSlide, Math.max(0, s.brands.length - 2)),
    }));

  const updateBrand = (i: number, field: keyof BrandEntry, value: string) => {
    setState((s) => {
      const updated = [...s.brands];
      updated[i] = { ...updated[i], [field]: value };
      return { ...s, brands: updated };
    });
  };

  const updateBrandConfig = <K extends keyof BrandConfig>(brandIndex: number, key: K, value: BrandConfig[K]) => {
    setState((s) => {
      const updated = [...s.brandConfigs];
      if (!updated[brandIndex]) return s;
      updated[brandIndex] = { ...updated[brandIndex], [key]: value };
      return { ...s, brandConfigs: updated };
    });
  };

  /** After POST /admin/brands, merge returned Mongo ids so WhatsApp QR can use entity_id */
  const applyBrandIdsFromSave = (brandIds: string[]) => {
    setState((s) => ({
      ...s,
      brands: s.brands.map((b, i) => ({ ...b, _id: brandIds[i] ?? b._id })),
    }));
  };

  const nextSlide = () =>
    setState((s) => ({
      ...s,
      currentBrandSlide: Math.min(s.currentBrandSlide + 1, s.brands.length - 1),
    }));
  const prevSlide = () =>
    setState((s) => ({
      ...s,
      currentBrandSlide: Math.max(s.currentBrandSlide - 1, 0),
    }));

  const next = () => {
    // Apply source brand config when leaving Step 0 in clone modes
    const currentStep = state.step;
    if (
      currentStep === 0 &&
      (state.createMode === "same_db" || state.createMode === "same_config") &&
      state.sourceBrandSelection?.brandConfig
    ) {
      applySourceBrandConfig();
    }
    setState((s) => {
      const maxStep = TOTAL_BRAND_WIZARD_STEPS;
      return {
        ...s,
        step: Math.min(s.step + 1, maxStep),
        currentBrandSlide: 0,
      };
    });
  };
  const prev = () =>
    setState((s) => {
      const isEdit = !!locationState?.editBrand;
      const minStep = isEdit ? 1 : 0;
      return {
        ...s,
        step: Math.max(s.step - 1, minStep),
        currentBrandSlide: 0,
      };
    });

  /** Jump to a specific wizard step (e.g. redirect to Upload Workers). */
  const setStep = (step: number) =>
    setState((s) => {
      const isEdit = !!locationState?.editBrand;
      const maxStep = TOTAL_BRAND_WIZARD_STEPS;
      const minStep = isEdit ? 1 : 0;
      return {
        ...s,
        step: Math.max(minStep, Math.min(step, maxStep)),
      };
    });

  const brandLabel = state.brands[state.currentBrandSlide]?.name || state.brands[state.currentBrandSlide]?.domain || `Brand ${state.currentBrandSlide + 1}`;
  const currentConfig = state.brandConfigs[state.currentBrandSlide] ?? getDefaultBrandConfig();
  const isEditMode = !!locationState?.editBrand;
  const totalSteps = TOTAL_BRAND_WIZARD_STEPS;

  return {
    state,
    isEditMode,
    update,
    setCreateMode,
    setUseCase,
    setSourceBrandSelection,
    dismissMismatchWarnings,
    resetMismatchedFields,
    addBrand,
    removeBrand,
    updateBrand,
    updateBrandConfig,
    applyBrandIdsFromSave,
    next,
    prev,
    setStep,
    nextSlide,
    prevSlide,
    brandLabel,
    currentConfig,
    totalSteps,
  };
}
