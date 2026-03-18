import { useState } from "react";
import { StepTransformEmails } from "@/views/create-brand";

export const StepTransformEmailsDemo = () => {
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [autoGenPasswordForLeads, setAutoGenPasswordForLeads] = useState(true);
  const [includePasswordChangeLinkInEmail, setIncludePasswordChangeLinkInEmail] = useState(true);
  const [autoRejectNoInteractivity, setAutoRejectNoInteractivity] = useState(true);
  const [autoRejectDaysAfterWelcome, setAutoRejectDaysAfterWelcome] = useState(7);
  return (
    <StepTransformEmails
      brandLabel="Demo Brand"
      emailFormatValidation={emailFormatValidation}
      onEmailFormatValidationChange={setEmailFormatValidation}
      autoGenPasswordForLeads={autoGenPasswordForLeads}
      onAutoGenPasswordForLeadsChange={(v) => {
        setAutoGenPasswordForLeads(v);
        if (v) setAutoRejectNoInteractivity(true);
      }}
      includePasswordChangeLinkInEmail={includePasswordChangeLinkInEmail}
      onIncludePasswordChangeLinkInEmailChange={setIncludePasswordChangeLinkInEmail}
      autoRejectNoInteractivity={autoRejectNoInteractivity}
      onAutoRejectNoInteractivityChange={setAutoRejectNoInteractivity}
      autoRejectDaysAfterWelcome={autoRejectDaysAfterWelcome}
      onAutoRejectDaysAfterWelcomeChange={setAutoRejectDaysAfterWelcome}
    />
  );
};
