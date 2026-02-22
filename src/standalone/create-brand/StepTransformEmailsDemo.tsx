import { useState } from "react";
import { StepTransformEmails } from "@/views/create-brand";

export const StepTransformEmailsDemo = () => {
  const [autoGenPasswordForLeads, setAutoGenPasswordForLeads] = useState(true);
  const [autoRejectNoInteractivity, setAutoRejectNoInteractivity] = useState(true);
  const [blockedEmailProviders, setBlockedEmailProviders] = useState(["tempmail.com", "guerrillamail.com"]);
  const [newEmailProvider, setNewEmailProvider] = useState("");
  return (
    <StepTransformEmails
      brandLabel="Demo Brand"
      autoGenPasswordForLeads={autoGenPasswordForLeads}
      onAutoGenPasswordForLeadsChange={(v) => {
        setAutoGenPasswordForLeads(v);
        if (v) setAutoRejectNoInteractivity(true);
      }}
      autoRejectNoInteractivity={autoRejectNoInteractivity}
      onAutoRejectNoInteractivityChange={setAutoRejectNoInteractivity}
      blockedEmailProviders={blockedEmailProviders}
      onBlockedEmailProvidersChange={setBlockedEmailProviders}
      newEmailProvider={newEmailProvider}
      onNewEmailProviderChange={setNewEmailProvider}
    />
  );
};
