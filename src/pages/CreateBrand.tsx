import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import DepositConfigStep from "@/components/brand-wizard/DepositConfigStep";
import WithdrawalConfigStep from "@/components/brand-wizard/WithdrawalConfigStep";
import { useCreateBrand } from "@/controllers/useCreateBrand";
import { ROUTES } from "@/models/routes";
import {
  StepBrands,
  StepKyc,
  StepTerms,
  StepCommunicationProviders,
  StepUploadWorkers,
  StepUploadLogo,
  StepTransform,
  StepTraderPlatform,
  StepTraderMarkets,
  StepTradingFees,
  StepClientTas,
  StepDefaultSettings,
} from "@/views/create-brand";

const CreateBrand = () => {
  const navigate = useNavigate();
  const { state, update, addBrand, removeBrand, updateBrand, next, prev, brandLabel, totalSteps } = useCreateBrand();

  const renderStep = () => {
    switch (state.step) {
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
          <DepositConfigStep
            brandLabel={brandLabel}
            brandDomain={state.brands[0]?.domain || "domain.com"}
            methods={state.depositMethods}
            onMethodsChange={(m) => update("depositMethods", m)}
            bankDetails={state.bankDetails}
            onBankDetailsChange={(d) => update("bankDetails", d)}
            wireDetails={state.wireDetails}
            onWireDetailsChange={(d) => update("wireDetails", d)}
          />
        );
      case 3:
        return (
          <WithdrawalConfigStep
            brandLabel={brandLabel}
            brandDomain={state.brands[0]?.domain || "domain.com"}
            methods={state.withdrawalMethods}
            onMethodsChange={(m) => update("withdrawalMethods", m)}
            globalSettings={state.globalSettings}
            onGlobalSettingsChange={(s) => update("globalSettings", s)}
            withdrawalBankDetails={state.withdrawalBankDetails}
            onWithdrawalBankDetailsChange={(d) => update("withdrawalBankDetails", d)}
            withdrawalWireDetails={state.withdrawalWireDetails}
            onWithdrawalWireDetailsChange={(d) => update("withdrawalWireDetails", d)}
          />
        );
      case 4:
        return (
          <StepKyc
            brandLabel={brandLabel}
            brandDomain={state.brands[0]?.domain || "domain.com"}
            kycEnabled={state.kycEnabled}
            onKycEnabledChange={(v) => update("kycEnabled", v)}
            kycDocs={state.kycDocs}
            onKycDocsChange={(d) => update("kycDocs", d)}
          />
        );
      case 5:
        return (
          <StepTerms
            brandLabel={brandLabel}
            brandDomain={state.brands[0]?.domain || "domain.com"}
            privacyPolicy={state.privacyPolicy}
            terms={state.terms}
            onPrivacyPolicyChange={(v) => update("privacyPolicy", v)}
            onTermsChange={(v) => update("terms", v)}
          />
        );
      case 6:
        return (
          <StepCommunicationProviders
            emailProvider={state.emailProvider}
            onEmailProviderChange={(v) => update("emailProvider", v)}
            mailerooApiKey={state.mailerooApiKey}
            mailerooFromEmail={state.mailerooFromEmail}
            onMailerooApiKeyChange={(v) => update("mailerooApiKey", v)}
            onMailerooFromEmailChange={(v) => update("mailerooFromEmail", v)}
            alexdersApiKey={state.alexdersApiKey}
            alexdersFromEmail={state.alexdersFromEmail}
            onAlexdersApiKeyChange={(v) => update("alexdersApiKey", v)}
            onAlexdersFromEmailChange={(v) => update("alexdersFromEmail", v)}
            selectedEmailTemplates={state.selectedEmailTemplates}
            onEmailTemplatesChange={(t) => update("selectedEmailTemplates", t)}
            voipProvider={state.voipProvider}
            onVoipProviderChange={(v) => update("voipProvider", v)}
            voipPhoneNumbers={state.voipPhoneNumbers}
            voipCountries={state.voipCountries}
            voipCoverageMap={state.voipCoverageMap}
            voipOriginCountryInput={state.voipOriginCountryInput}
            voipAddOutboundFrom={state.voipAddOutboundFrom}
            voipOutboundCountryInput={state.voipOutboundCountryInput}
            providersMapData={state.providersMapData}
            onVoipPhoneNumbersChange={(v) => update("voipPhoneNumbers", v)}
            onVoipCountriesChange={(v) => update("voipCountries", v)}
            onVoipCoverageMapChange={(m) => update("voipCoverageMap", m)}
            onVoipOriginCountryInputChange={(v) => update("voipOriginCountryInput", v)}
            onVoipAddOutboundFromChange={(v) => update("voipAddOutboundFrom", v)}
            onVoipOutboundCountryInputChange={(v) => update("voipOutboundCountryInput", v)}
            onProvidersMapDataChange={(v) => update("providersMapData", v)}
          />
        );
      case 7:
        return <StepUploadWorkers brands={state.brands} />;
      case 8:
        return <StepUploadLogo brands={state.brands} />;
      case 9:
        return (
          <StepTransform
            brandLabel={brandLabel}
            emailProvidersAllowed={state.emailProvidersAllowed}
            onEmailProvidersAllowedChange={(v) => update("emailProvidersAllowed", v)}
            phoneExtensionsAllowed={state.phoneExtensionsAllowed}
            onPhoneExtensionsAllowedChange={(v) => update("phoneExtensionsAllowed", v)}
            allowedExtensionPhones={state.allowedExtensionPhones}
            newAllowedExtensionPhone={state.newAllowedExtensionPhone}
            onAllowedExtensionPhonesChange={(v) => update("allowedExtensionPhones", v)}
            onNewAllowedExtensionPhoneChange={(v) => update("newAllowedExtensionPhone", v)}
            autoGenPasswordForLeads={state.autoGenPasswordForLeads}
            onAutoGenPasswordForLeadsChange={(v) => {
              update("autoGenPasswordForLeads", v);
              if (v) update("autoRejectNoInteractivity", true);
            }}
            autoRejectNoInteractivity={state.autoRejectNoInteractivity}
            onAutoRejectNoInteractivityChange={(v) => update("autoRejectNoInteractivity", v)}
            blockedCountries={state.blockedCountries}
            onBlockedCountriesChange={(v) => update("blockedCountries", v)}
            newCountryCode={state.newCountryCode}
            onNewCountryCodeChange={(v) => update("newCountryCode", v)}
            countryCodeError={state.countryCodeError}
            onCountryCodeErrorChange={(v) => update("countryCodeError", v)}
            rejectedCodes={state.rejectedCodes}
            onRejectedCodesChange={(v) => update("rejectedCodes", v)}
            newPhoneCode={state.newPhoneCode}
            onNewPhoneCodeChange={(v) => update("newPhoneCode", v)}
            phoneCodeError={state.phoneCodeError}
            onPhoneCodeErrorChange={(v) => update("phoneCodeError", v)}
            blockedEmailProviders={state.blockedEmailProviders}
            onBlockedEmailProvidersChange={(v) => update("blockedEmailProviders", v)}
            newEmailProvider={state.newEmailProvider}
            onNewEmailProviderChange={(v) => update("newEmailProvider", v)}
          />
        );
      case 10:
        return <StepTraderPlatform value={state.traderPlatform} onChange={(v) => update("traderPlatform", v)} />;
      case 11:
        return <StepTraderMarkets markets={state.traderMarkets} onChange={(m) => update("traderMarkets", m)} />;
      case 12:
                    return (
          <StepTradingFees
            openPosition={{
              enabled: state.openPositionFeeEnabled,
              type: state.openPositionFeeType,
              value: state.openPositionFeeValue,
            }}
            onOpenPositionChange={(v) => {
              if (v.enabled !== undefined) update("openPositionFeeEnabled", v.enabled);
              if (v.type !== undefined) update("openPositionFeeType", v.type);
              if (v.value !== undefined) update("openPositionFeeValue", v.value);
            }}
            closePosition={{
              enabled: state.closePositionFeeEnabled,
              type: state.closePositionFeeType,
              value: state.closePositionFeeValue,
            }}
            onClosePositionChange={(v) => {
              if (v.enabled !== undefined) update("closePositionFeeEnabled", v.enabled);
              if (v.type !== undefined) update("closePositionFeeType", v.type);
              if (v.value !== undefined) update("closePositionFeeValue", v.value);
            }}
            currency={state.currency}
          />
        );
      case 13:
        return (
          <StepClientTas
            allowMultiTas={state.allowMultiTas}
            onAllowMultiTasChange={(v) => update("allowMultiTas", v)}
            maxPerClient={state.maxPerClient}
            onMaxPerClientChange={(v) => update("maxPerClient", v)}
            maxLeverage={state.maxLeverage}
            onMaxLeverageChange={(v) => update("maxLeverage", v)}
          />
        );
      case 14:
        return (
          <StepDefaultSettings
            timezone={state.timezone}
            onTimezoneChange={(v) => update("timezone", v)}
            language={state.language}
            onLanguageChange={(v) => update("language", v)}
            currency={state.currency}
            onCurrencyChange={(v) => update("currency", v)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(ROUTES.HOME)} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-foreground">Create New Brand</h1>
              <span className="text-sm text-muted-foreground">Step {state.step} of {totalSteps}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(state.step / totalSteps) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="p-6 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 border-t flex justify-between">
            <Button variant="outline" onClick={prev} disabled={state.step === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            {state.step === totalSteps ? (
              <Button onClick={() => { alert("Brand created! (mock)"); navigate(ROUTES.HOME); }}>
                Finish Setup
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
