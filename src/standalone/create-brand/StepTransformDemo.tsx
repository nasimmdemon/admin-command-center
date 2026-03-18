import { useState } from "react";
import { StepTransformVoip, StepTransformEmails } from "@/views/create-brand";

export const StepTransformDemo = () => {
  const [autoGenPasswordForLeads, setAutoGenPasswordForLeads] = useState(true);
  const [autoRejectNoInteractivity, setAutoRejectNoInteractivity] = useState(true);
  return (
    <div className="space-y-12">
      <StepTransformVoip
        brandLabel="Demo Brand"
        voipCoverageMap={{ RU: ["RU"], US: ["US", "CA", "MX"] }}
      />
      <StepTransformEmails
        brandLabel="Demo Brand"
        emailFormatValidation={true}
        onEmailFormatValidationChange={() => {}}
        autoGenPasswordForLeads={autoGenPasswordForLeads}
        onAutoGenPasswordForLeadsChange={(v) => {
          setAutoGenPasswordForLeads(v);
          if (v) setAutoRejectNoInteractivity(true);
        }}
        includePasswordChangeLinkInEmail={true}
        onIncludePasswordChangeLinkInEmailChange={() => {}}
        autoRejectNoInteractivity={autoRejectNoInteractivity}
        onAutoRejectNoInteractivityChange={setAutoRejectNoInteractivity}
        autoRejectDaysAfterWelcome={7}
        onAutoRejectDaysAfterWelcomeChange={() => {}}
      />
    </div>
  );
};
