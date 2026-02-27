import { useState } from "react";
import { StepEmailConfig } from "@/views/create-brand";

export const StepEmailDemo = () => {
  const [emailProvider, setEmailProvider] = useState<"maileroo" | "alexders" | "other">("maileroo");
  const [selectedEmailTemplates, setSelectedEmailTemplates] = useState<Record<string, boolean>>({
    ClientCardEmailFromUser: false, ClientAuth: false, LeadInitialDetails: false, ClientChangeCreds: false, UserChangeCreds: false,
  });
  const [emailTemplateContent, setEmailTemplateContent] = useState<Record<string, { subject: string; body: string }>>({
    ClientCardEmailFromUser: { subject: "", body: "" },
    ClientAuth: { subject: "", body: "" },
    LeadInitialDetails: { subject: "", body: "" },
    ClientChangeCreds: { subject: "", body: "" },
    UserChangeCreds: { subject: "", body: "" },
  });
  return (
    <StepEmailConfig
      emailProvider={emailProvider}
      onEmailProviderChange={setEmailProvider}
      selectedEmailTemplates={selectedEmailTemplates}
      onEmailTemplatesChange={setSelectedEmailTemplates}
      emailTemplateContent={emailTemplateContent}
      onEmailTemplateContentChange={(key, val) => setEmailTemplateContent((prev) => ({ ...prev, [key]: val }))}
    />
  );
};
