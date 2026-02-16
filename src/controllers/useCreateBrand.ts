import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { TOTAL_BRAND_WIZARD_STEPS } from "@/models/brand-wizard-steps";
import { BrandConfig, getDefaultBrandConfig } from "@/types/brand-config-per-brand";

export interface BrandEntry {
  name: string;
  domain: string;
}

export interface CreateBrandState {
  step: number;
  brands: BrandEntry[];
  brandConfigs: BrandConfig[];
  currentBrandSlide: number;
}

export interface CreateBrandLocationState {
  clientId?: number;
  clientName?: string;
  editBrand?: { id: number; name: string; domain: string };
}

const getDefaultInitialState = (): CreateBrandState => ({
  step: 1,
  brands: [{ name: "", domain: "" }],
  brandConfigs: [getDefaultBrandConfig()],
  currentBrandSlide: 0,
});

function getInitialStateFromLocation(locationState: CreateBrandLocationState | null): CreateBrandState {
  if (locationState?.editBrand) {
    return {
      step: 1,
      brands: [{ name: locationState.editBrand.name, domain: locationState.editBrand.domain }],
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

  const addBrand = () =>
    setState((s) => ({
      ...s,
      brands: [...s.brands, { name: "", domain: "" }],
      brandConfigs: [...s.brandConfigs, getDefaultBrandConfig()],
    }));

  const removeBrand = (i: number) =>
    setState((s) => ({
      ...s,
      brands: s.brands.filter((_, idx) => idx !== i),
      brandConfigs: s.brandConfigs.filter((_, idx) => idx !== i),
      currentBrandSlide: Math.min(s.currentBrandSlide, Math.max(0, s.brands.length - 2)),
    }));

  const updateBrand = (i: number, field: "name" | "domain", value: string) => {
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
    setState((s) => ({
      ...s,
      step: Math.min(s.step + 1, TOTAL_BRAND_WIZARD_STEPS),
      currentBrandSlide: 0,
    }));
  const prev = () =>
    setState((s) => ({
      ...s,
      step: Math.max(s.step - 1, 1),
      currentBrandSlide: 0,
    }));

  const brandLabel = state.brands[state.currentBrandSlide]?.name || state.brands[state.currentBrandSlide]?.domain || `Brand ${state.currentBrandSlide + 1}`;
  const currentConfig = state.brandConfigs[state.currentBrandSlide] ?? getDefaultBrandConfig();
  const isEditMode = !!locationState?.editBrand;

  return {
    state,
    isEditMode,
    update,
    addBrand,
    removeBrand,
    updateBrand,
    updateBrandConfig,
    next,
    prev,
    nextSlide,
    prevSlide,
    brandLabel,
    currentConfig,
    totalSteps: TOTAL_BRAND_WIZARD_STEPS,
  };
}
