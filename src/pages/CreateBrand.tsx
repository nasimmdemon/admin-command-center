import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import DepositConfigStep from "@/components/brand-wizard/DepositConfigStep";
import WithdrawalConfigStep from "@/components/brand-wizard/WithdrawalConfigStep";
import { BrandStepWrapper } from "@/components/brand-wizard/BrandStepWrapper";
import {
  useCreateBrand,
  type CreateBrandLocationState,
} from "@/controllers/useCreateBrand";
import { submitBrandWizardToServer } from "@/api/submit-brand-wizard";
import { buildCleanExportConfig } from "@/types/brand-config-per-brand";
import { ROUTES } from "@/models/routes";
import { getCategoryLabelForStep } from "@/models/brand-wizard-categories";
import { STEP_DEPARTMENTS_AND_WORKERS } from "@/models/brand-wizard-steps";
import { hasValidWorkersForBrand } from "@/utils/has-valid-workers-for-brand";
import { StepCreateMode } from "@/views/create-brand/StepCreateMode";
import {
  StepBrands,
  StepDepartments,
  StepKyc,
  StepTerms,
  StepEmailConfig,
  StepVoipConfig,
  StepWhatsApp,
  StepUploadLogo,
  StepTraderPlatform,
  StepTraderMarkets,
  StepTradingFees,
  StepClientTas,
  StepDefaultSettings,
  StepBrandStatuses,
  StepCaseOfDesign,
  StepBrandDesign,
} from "@/views/create-brand";

const CreateBrand = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as CreateBrandLocationState | null;
  const existingClientId =
    locationState?.clientId != null
      ? String(locationState.clientId)
      : undefined;

  const {
    state,
    isEditMode,
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
    setCreateMode,
  } = useCreateBrand();
  const bi = state.currentBrandSlide;

  const [workerUploadRedirectMessage, setWorkerUploadRedirectMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveToServer = async () => {
    setSaving(true);
    try {
      const r = await submitBrandWizardToServer({
        brands: state.brands,
        brandConfigs: state.brandConfigs,
        existingClientId,
      });
      applyBrandIdsFromSave(r.brandIds);
      toast.success(
        `Saved to database — client: ${r.clientId}, brands: ${r.brandIds.length}`
      );
      return r;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
      throw e;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (state.step !== STEP_DEPARTMENTS_AND_WORKERS) setWorkerUploadRedirectMessage(null);
  }, [state.step]);

  const resolveVoipAllocationModes = useCallback(() => {
    return (
      currentConfig.voipAllocationModes ??
      (currentConfig.voipMode
        ? {
            byBrand: currentConfig.voipMode === "legacy",
            byDesk: currentConfig.voipMode === "desk",
            byWorker: currentConfig.voipMode === "worker",
          }
        : { byBrand: true, byDesk: false, byWorker: false })
    );
  }, [currentConfig.voipAllocationModes, currentConfig.voipMode]);

  const resolveWhatsappAllocationModes = useCallback(() => {
    return (
      currentConfig.whatsappAllocationModes ??
      (currentConfig.whatsappAdditionalModes
        ? {
            byBrand: !!currentConfig.whatsappAdditionalModes.by_brand,
            byDesk: true,
            byWorker: !!currentConfig.whatsappAdditionalModes.by_worker,
          }
        : { byBrand: false, byDesk: true, byWorker: false })
    );
  }, [currentConfig.whatsappAllocationModes, currentConfig.whatsappAdditionalModes]);

  const handleVoipAllocationModesChange = useCallback(
    (v: { byBrand: boolean; byDesk: boolean; byWorker: boolean }) => {
      const prev = resolveVoipAllocationModes();
      const turningOnWorker = v.byWorker && !prev.byWorker;
      const brandName = state.brands[bi]?.name ?? "";
      if (turningOnWorker && !hasValidWorkersForBrand(currentConfig.uploadedWorkers, brandName)) {
        updateBrandConfig(bi, "voipAllocationModes", v);
        setWorkerUploadRedirectMessage(
          "You turned on By worker for VoIP. Upload a worker CSV on the Departments step first (valid rows for this brand), then return to the VoIP step."
        );
        setStep(STEP_DEPARTMENTS_AND_WORKERS);
        return;
      }
      updateBrandConfig(bi, "voipAllocationModes", v);
    },
    [bi, currentConfig.uploadedWorkers, resolveVoipAllocationModes, setStep, state.brands, updateBrandConfig]
  );

  const handleWhatsappAllocationModesChange = useCallback(
    (v: { byBrand: boolean; byDesk: boolean; byWorker: boolean }) => {
      const prev = resolveWhatsappAllocationModes();
      const turningOnWorker = v.byWorker && !prev.byWorker;
      const brandName = state.brands[bi]?.name ?? "";
      if (turningOnWorker && !hasValidWorkersForBrand(currentConfig.uploadedWorkers, brandName)) {
        updateBrandConfig(bi, "whatsappAllocationModes", v);
        setWorkerUploadRedirectMessage(
          "You turned on By worker for WhatsApp. Upload a worker CSV on the Departments step first (valid rows for this brand), then return to the WhatsApp step."
        );
        setStep(STEP_DEPARTMENTS_AND_WORKERS);
        return;
      }
      updateBrandConfig(bi, "whatsappAllocationModes", v);
    },
    [bi, currentConfig.uploadedWorkers, resolveWhatsappAllocationModes, setStep, state.brands, updateBrandConfig]
  );

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return (
          <StepCreateMode
            value={state.createMode}
            onChange={setCreateMode}
          />
        );
      case 1:
        return (
          <StepBrands
            brands={state.brands}
            onAddBrand={addBrand}
            onRemoveBrand={removeBrand}
            onUpdateBrand={updateBrand}
          />
        );
      case 2:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepDepartments
              brandLabel={brandLabel}
              brandDesks={currentConfig.brandDesks}
              onBrandDesksChange={(v) => updateBrandConfig(bi, "brandDesks", v)}
              brands={state.brands}
              brandIndex={bi}
              uploadedWorkers={currentConfig.uploadedWorkers}
              onUploadedWorkersChange={(v) => updateBrandConfig(bi, "uploadedWorkers", v)}
              redirectBannerMessage={workerUploadRedirectMessage}
              onDismissRedirectBanner={() => setWorkerUploadRedirectMessage(null)}
            />
          </BrandStepWrapper>
        );
      case 3:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <DepositConfigStep
              brandLabel={brandLabel}
              brandDomain={state.brands[bi]?.domain || "domain.com"}
              methods={currentConfig.depositMethods}
              onMethodsChange={(m) => updateBrandConfig(bi, "depositMethods", m)}
              bankDetails={currentConfig.bankDetails}
              onBankDetailsChange={(d) => updateBrandConfig(bi, "bankDetails", d)}
              wireDetails={currentConfig.wireDetails}
              onWireDetailsChange={(d) => updateBrandConfig(bi, "wireDetails", d)}
            />
          </BrandStepWrapper>
        );
      case 4:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <WithdrawalConfigStep
              brandLabel={brandLabel}
              brandDomain={state.brands[bi]?.domain || "domain.com"}
              methods={currentConfig.withdrawalMethods}
              onMethodsChange={(m) => updateBrandConfig(bi, "withdrawalMethods", m)}
              globalSettings={currentConfig.globalSettings}
              onGlobalSettingsChange={(s) => updateBrandConfig(bi, "globalSettings", s)}
            />
          </BrandStepWrapper>
        );
      case 5:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepKyc
              brandLabel={brandLabel}
              brandDomain={state.brands[bi]?.domain || "domain.com"}
              brandHasKyc={currentConfig.brandHasKyc ?? currentConfig.kycEnabled}
              onBrandHasKycChange={(v) => {
                updateBrandConfig(bi, "brandHasKyc", v);
                if (!v) {
                  updateBrandConfig(bi, "brandRequiresKycToTrade", false);
                  updateBrandConfig(bi, "kycEnabled", false);
                }
              }}
              brandRequiresKycToTrade={currentConfig.brandRequiresKycToTrade ?? currentConfig.kycEnabled}
              onBrandRequiresKycToTradeChange={(v) => {
                updateBrandConfig(bi, "brandRequiresKycToTrade", v);
                updateBrandConfig(bi, "kycEnabled", currentConfig.brandHasKyc !== false ? v : false);
              }}
              kycRequireSelfie={currentConfig.kycRequireSelfie}
              onKycRequireSelfieChange={(v) => updateBrandConfig(bi, "kycRequireSelfie", v)}
              kycDocs={currentConfig.kycDocs}
              onKycDocsChange={(d) => updateBrandConfig(bi, "kycDocs", d)}
              kycSpecificDocumentClientNeeds={currentConfig.kycSpecificDocumentClientNeeds}
              onKycSpecificDocumentClientNeedsChange={(v) => updateBrandConfig(bi, "kycSpecificDocumentClientNeeds", v)}
            />
          </BrandStepWrapper>
        );
      case 6:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepTerms
              brandLabel={brandLabel}
              brandDomain={state.brands[bi]?.domain || "domain.com"}
              privacyPolicy={currentConfig.privacyPolicy}
              terms={currentConfig.terms}
              onPrivacyPolicyChange={(v) => updateBrandConfig(bi, "privacyPolicy", v)}
              onTermsChange={(v) => updateBrandConfig(bi, "terms", v)}
            />
          </BrandStepWrapper>
        );
      case 7:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepEmailConfig
              emailProvider={currentConfig.emailProvider}
              onEmailProviderChange={(v) => updateBrandConfig(bi, "emailProvider", v)}
              mailerooApiKey={currentConfig.mailerooApiKey}
              mailerooFromEmail={currentConfig.mailerooFromEmail}
              onMailerooApiKeyChange={(v) => updateBrandConfig(bi, "mailerooApiKey", v)}
              onMailerooFromEmailChange={(v) => updateBrandConfig(bi, "mailerooFromEmail", v)}
              alexdersApiKey={currentConfig.alexdersApiKey}
              alexdersFromEmail={currentConfig.alexdersFromEmail}
              onAlexdersApiKeyChange={(v) => updateBrandConfig(bi, "alexdersApiKey", v)}
              onAlexdersFromEmailChange={(v) => updateBrandConfig(bi, "alexdersFromEmail", v)}
              selectedEmailTemplates={currentConfig.selectedEmailTemplates}
              onEmailTemplatesChange={(t) => updateBrandConfig(bi, "selectedEmailTemplates", t)}
              emailTemplateContent={currentConfig.emailTemplateContent}
              onEmailTemplateContentChange={(key, val) => updateBrandConfig(bi, "emailTemplateContent", { ...currentConfig.emailTemplateContent, [key]: val })}
              logoUrl={currentConfig.logoUrl}
            />
          </BrandStepWrapper>
        );
      case 8:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepVoipConfig
              voipProvider={currentConfig.voipProvider}
              onVoipProviderChange={(v) => updateBrandConfig(bi, "voipProvider", v)}
              voipPhoneNumbers={currentConfig.voipPhoneNumbers}
              voipCountries={currentConfig.voipCountries}
              voipCoverageMap={currentConfig.voipCoverageMap}
              voipOriginCountryInput={currentConfig.voipOriginCountryInput}
              voipAddOutboundFrom={currentConfig.voipAddOutboundFrom}
              voipOutboundCountryInput={currentConfig.voipOutboundCountryInput}
              providersMapData={currentConfig.providersMapData}
              onVoipPhoneNumbersChange={(v) => updateBrandConfig(bi, "voipPhoneNumbers", v)}
              onVoipCountriesChange={(v) => updateBrandConfig(bi, "voipCountries", v)}
              onVoipCoverageMapChange={(m) => updateBrandConfig(bi, "voipCoverageMap", m)}
              onVoipOriginCountryInputChange={(v) => updateBrandConfig(bi, "voipOriginCountryInput", v)}
              onVoipAddOutboundFromChange={(v) => updateBrandConfig(bi, "voipAddOutboundFrom", v)}
              onVoipOutboundCountryInputChange={(v) => updateBrandConfig(bi, "voipOutboundCountryInput", v)}
              onProvidersMapDataChange={(v) => updateBrandConfig(bi, "providersMapData", v)}
              voipAllocationModes={
                currentConfig.voipAllocationModes ??
                (currentConfig.voipMode
                  ? {
                      byBrand: currentConfig.voipMode === "legacy",
                      byDesk: currentConfig.voipMode === "desk",
                      byWorker: currentConfig.voipMode === "worker",
                    }
                  : undefined)
              }
              onVoipAllocationModesChange={handleVoipAllocationModesChange}
              voipDeskConfigs={currentConfig.voipDeskConfigs}
              onVoipDeskConfigsChange={(v) => updateBrandConfig(bi, "voipDeskConfigs", v)}
              voipQaDefault={currentConfig.voipQaDefault}
              onVoipQaDefaultChange={(v) => updateBrandConfig(bi, "voipQaDefault", v)}
              voipWorkerConfigs={currentConfig.voipWorkerConfigs}
              onVoipWorkerConfigsChange={(v) => updateBrandConfig(bi, "voipWorkerConfigs", v)}
              uploadedWorkers={currentConfig.uploadedWorkers}
              currentBrandName={state.brands[bi]?.name ?? ""}
            />
          </BrandStepWrapper>
        );
      case 9:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepWhatsApp
              entityId={state.brands[bi]?._id ?? ""}
              includeWhatsApp={currentConfig.includeWhatsApp}
              onIncludeWhatsAppChange={(v) => updateBrandConfig(bi, "includeWhatsApp", v)}
              whatsappAllocationModes={
                currentConfig.whatsappAllocationModes ??
                (currentConfig.whatsappAdditionalModes
                  ? {
                      byBrand: !!currentConfig.whatsappAdditionalModes.by_brand,
                      byDesk: true,
                      byWorker: !!currentConfig.whatsappAdditionalModes.by_worker,
                    }
                  : { byBrand: false, byDesk: true, byWorker: false })
              }
              onWhatsappAllocationModesChange={handleWhatsappAllocationModesChange}
              whatsappQrCode={currentConfig.whatsappQrCode}
              onWhatsappQrCodeChange={(v) => updateBrandConfig(bi, "whatsappQrCode", v)}
              whatsappDeskQrCode={currentConfig.whatsappDeskQrCode ?? ""}
              onWhatsappDeskQrCodeChange={(v) => updateBrandConfig(bi, "whatsappDeskQrCode", v)}
              whatsappWorkerEntries={currentConfig.whatsappWorkerEntries ?? []}
              onWhatsappWorkerEntriesChange={(v) => updateBrandConfig(bi, "whatsappWorkerEntries", v)}
              uploadedWorkers={currentConfig.uploadedWorkers ?? []}
              currentBrandName={state.brands[bi]?.name ?? ""}
            />
          </BrandStepWrapper>
        );
      case 10:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepUploadLogo
              brands={state.brands}
              brandIndex={bi}
              logoUrl={currentConfig.logoUrl}
              onLogoChange={(url) => updateBrandConfig(bi, "logoUrl", url)}
            />
          </BrandStepWrapper>
        );
      case 12:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepTraderPlatform value={currentConfig.traderPlatform} onChange={(v) => updateBrandConfig(bi, "traderPlatform", v)} />
          </BrandStepWrapper>
        );
      case 13:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepTraderMarkets markets={currentConfig.traderMarkets} onChange={(m) => updateBrandConfig(bi, "traderMarkets", m)} />
          </BrandStepWrapper>
        );
      case 14:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepTradingFees
              openPosition={{
                enabled: currentConfig.openPositionFeeEnabled,
                type: currentConfig.openPositionFeeType,
                value: currentConfig.openPositionFeeValue,
              }}
              onOpenPositionChange={(v) => {
                if (v.enabled !== undefined) updateBrandConfig(bi, "openPositionFeeEnabled", v.enabled);
                if (v.type !== undefined) updateBrandConfig(bi, "openPositionFeeType", v.type);
                if (v.value !== undefined) updateBrandConfig(bi, "openPositionFeeValue", v.value);
              }}
              closePosition={{
                enabled: currentConfig.closePositionFeeEnabled,
                type: currentConfig.closePositionFeeType,
                value: currentConfig.closePositionFeeValue,
              }}
              onClosePositionChange={(v) => {
                if (v.enabled !== undefined) updateBrandConfig(bi, "closePositionFeeEnabled", v.enabled);
                if (v.type !== undefined) updateBrandConfig(bi, "closePositionFeeType", v.type);
                if (v.value !== undefined) updateBrandConfig(bi, "closePositionFeeValue", v.value);
              }}
              currency={currentConfig.currency}
            />
          </BrandStepWrapper>
        );
      case 15:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepClientTas
              allowMultiTas={currentConfig.allowMultiTas}
              onAllowMultiTasChange={(v) => updateBrandConfig(bi, "allowMultiTas", v)}
              maxPerClient={currentConfig.maxPerClient}
              onMaxPerClientChange={(v) => updateBrandConfig(bi, "maxPerClient", v)}
              allowClientSelectLeverage={currentConfig.allowClientSelectLeverage}
              onAllowClientSelectLeverageChange={(v) => updateBrandConfig(bi, "allowClientSelectLeverage", v)}
              maxLeverage={currentConfig.maxLeverage}
              onMaxLeverageChange={(v) => updateBrandConfig(bi, "maxLeverage", v)}
            />
          </BrandStepWrapper>
        );
      case 16:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepDefaultSettings
              timezone={currentConfig.timezone}
              onTimezoneChange={(v) => updateBrandConfig(bi, "timezone", v)}
              language={currentConfig.language}
              onLanguageChange={(v) => updateBrandConfig(bi, "language", v)}
              currency={currentConfig.currency}
              onCurrencyChange={(v) => updateBrandConfig(bi, "currency", v)}
            />
          </BrandStepWrapper>
        );
      case 17:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepBrandStatuses
              auto={currentConfig.brandStatusAuto}
              onAutoChange={(patch) =>
                updateBrandConfig(bi, "brandStatusAuto", { ...currentConfig.brandStatusAuto, ...patch })
              }
              regSelectableIds={currentConfig.brandStatusRegSelectableIds}
              onRegSelectableIdsChange={(ids) => updateBrandConfig(bi, "brandStatusRegSelectableIds", ids)}
            />
          </BrandStepWrapper>
        );
      case 18:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepCaseOfDesign
              value={currentConfig.brandCaseDesign}
              onChange={(patch) =>
                updateBrandConfig(bi, "brandCaseDesign", { ...currentConfig.brandCaseDesign, ...patch })
              }
            />
          </BrandStepWrapper>
        );
      case 19:
        return (
          <BrandStepWrapper brands={state.brands} currentSlide={bi} onPrevSlide={prevSlide} onNextSlide={nextSlide}>
            <StepBrandDesign
              value={currentConfig.brandDesign}
              onChange={(patch) => updateBrandConfig(bi, "brandDesign", { ...currentConfig.brandDesign, ...patch })}
            />
          </BrandStepWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dotted w-full px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <PageTransition className="w-full max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(ROUTES.HOME)} className="mb-6 text-muted-foreground hover:text-foreground -ml-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="bg-card rounded-[1.5rem] shadow-card border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-tint-blue/30">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-foreground">{isEditMode ? "Edit Brand" : "Create New Brand"}</h1>
              <span className="text-sm text-muted-foreground font-medium">Step {state.step} of {totalSteps}</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(state.step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <div className="p-6 min-h-[300px]">
            {getCategoryLabelForStep(state.step) && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {getCategoryLabelForStep(state.step)}
              </p>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={state.step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 pt-4 border-t border-border/40 space-y-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  void saveToServer().catch(() => {
                    /* toast in saveToServer */
                  });
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:opacity-50"
              >
                Save all brands to database
              </button>
              <button
                type="button"
                onClick={() => {
                  const cleanConfigs = state.brandConfigs.map((c) => buildCleanExportConfig(c));
                  const json = JSON.stringify(
                    { brands: state.brands, brandConfigs: cleanConfigs },
                    null,
                    2
                  );
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `brand-${state.brands[bi]?.name || "config"}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-4 h-4" />
                Download JSON (all brands)
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentConfig = state.brandConfigs[bi];
                  const clean = buildCleanExportConfig(currentConfig);
                  const json = JSON.stringify(
                    { brand: state.brands[bi], brandConfig: clean },
                    null,
                    2
                  );
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `brand-${state.brands[bi]?.name || "config"}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Download JSON (current brand only)
              </button>
            </div>
          </div>

          <div className="p-6 border-t border-border/50 flex justify-between bg-muted/20">
            <Button variant="outline" onClick={prev} disabled={state.step === (isEditMode ? 1 : 0)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            {state.step === 0 ? (
              <Button onClick={next} disabled={!state.createMode}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : state.step === totalSteps ? (
              <Button
                disabled={saving}
                onClick={() => {
                  void saveToServer()
                    .then(() => navigate(ROUTES.HOME))
                    .catch(() => {
                      /* toast in saveToServer */
                    });
                }}
              >
                {saving ? "Saving…" : "Finish setup & save"}
              </Button>
            ) : (
              <Button onClick={next}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default CreateBrand;
