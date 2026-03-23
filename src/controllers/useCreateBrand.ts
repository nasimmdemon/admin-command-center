import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { TOTAL_BRAND_WIZARD_STEPS } from "@/models/brand-wizard-steps";
import { BrandConfig, getDefaultBrandConfig } from "@/types/brand-config-per-brand";

export interface BrandEntry {
  name: string;
  domain: string;
  /** Fallback domain; same content deployed to both. When main is not live, substitute shows content automatically */
  substituteDomain: string;
}

export type CreateMode = "simple" | "same_db" | "same_config" | "from_scratch";

export interface CreateBrandState {
  step: number;
  createMode: CreateMode | null;
  brands: BrandEntry[];
  brandConfigs: BrandConfig[];
  currentBrandSlide: number;
}

export interface CreateBrandLocationState {
  clientId?: number;
  clientName?: string;
  editBrand?: { id: number; name: string; domain: string };
  /** When editing, start at this step (from category modal) */
  startStep?: number;
}

const getDefaultInitialState = (): CreateBrandState => ({
  step: 0,
  createMode: null,
  brands: [{ name: "", domain: "", substituteDomain: "" }],
  brandConfigs: [getDefaultBrandConfig()],
  currentBrandSlide: 0,
});

function getInitialStateFromLocation(locationState: CreateBrandLocationState | null): CreateBrandState {
  if (locationState?.editBrand) {
    const d = locationState.editBrand.domain;
    const startStep = Math.max(1, Math.min(locationState.startStep ?? 1, TOTAL_BRAND_WIZARD_STEPS));
    return {
      step: startStep,
      createMode: "simple",
      brands: [{ name: locationState.editBrand.name, domain: d, substituteDomain: d }],
      brandConfigs: [getDefaultBrandConfig()],
      currentBrandSlide: 0,
    };
  }
  return getDefaultInitialState();
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
    setState((s) => ({ ...s, createMode: mode }));
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

  const next = () =>
    setState((s) => {
      const isEdit = !!locationState?.editBrand;
      const maxStep = isEdit ? TOTAL_BRAND_WIZARD_STEPS : 17;
      const minStep = isEdit ? 1 : 0;
      return {
        ...s,
        step: Math.min(s.step + 1, maxStep),
        currentBrandSlide: 0,
      };
    });
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
      const maxStep = isEdit ? TOTAL_BRAND_WIZARD_STEPS : 17;
      const minStep = isEdit ? 1 : 0;
      return {
        ...s,
        step: Math.max(minStep, Math.min(step, maxStep)),
      };
    });

  const brandLabel = state.brands[state.currentBrandSlide]?.name || state.brands[state.currentBrandSlide]?.domain || `Brand ${state.currentBrandSlide + 1}`;
  const currentConfig = state.brandConfigs[state.currentBrandSlide] ?? getDefaultBrandConfig();
  const isEditMode = !!locationState?.editBrand;
  const totalSteps = isEditMode ? TOTAL_BRAND_WIZARD_STEPS : 17;

  return {
    state,
    isEditMode,
    update,
    setCreateMode,
    addBrand,
    removeBrand,
    updateBrand,
    updateBrandConfig,
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
