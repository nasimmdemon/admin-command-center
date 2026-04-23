import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { EmailProviderSection } from "./communication/EmailProviderSection";
import { EmailTemplatesSection } from "./communication/EmailTemplatesSection";
import { StepShell, StepCard } from "@/views/shared/StepShell";

interface StepEmailConfigProps {
  emailProvider: "maileroo" | "alexders" | "other";
  onEmailProviderChange: (v: "maileroo" | "alexders" | "other") => void;
  mailerooApiKey?: string;
  mailerooFromEmail?: string;
  onMailerooApiKeyChange?: (v: string) => void;
  onMailerooFromEmailChange?: (v: string) => void;
  alexdersApiKey?: string;
  alexdersFromEmail?: string;
  onAlexdersApiKeyChange?: (v: string) => void;
  onAlexdersFromEmailChange?: (v: string) => void;
  selectedEmailTemplates: Record<string, boolean>;
  onEmailTemplatesChange: (t: Record<string, boolean>) => void;
  emailTemplateContent: Record<string, { subject: string; body: string }>;
  onEmailTemplateContentChange: (key: string, value: { subject: string; body: string }) => void;
  logoUrl?: string;
}

export const StepEmailConfig = (props: StepEmailConfigProps) => (
  <StepShell
    icon={Mail}
    iconBg="bg-[hsl(217,91%,96%)]"
    iconColor="text-[hsl(217,80%,55%)]"
    title="Email Configuration"
    subtitle={`Choose your provider and customise transactional email templates. Use {shortcodes} as placeholders.`}
  >
    <div className="space-y-4">
      <StepCard className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Provider</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EmailProviderSection
            value={props.emailProvider}
            onChange={props.onEmailProviderChange}
            mailerooApiKey={props.mailerooApiKey}
            mailerooFromEmail={props.mailerooFromEmail}
            onMailerooApiKeyChange={props.onMailerooApiKeyChange}
            onMailerooFromEmailChange={props.onMailerooFromEmailChange}
            alexdersApiKey={props.alexdersApiKey}
            alexdersFromEmail={props.alexdersFromEmail}
            onAlexdersApiKeyChange={props.onAlexdersApiKeyChange}
            onAlexdersFromEmailChange={props.onAlexdersFromEmailChange}
          />
        </motion.div>
      </StepCard>

      <StepCard className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Templates</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <EmailTemplatesSection
            selected={props.selectedEmailTemplates}
            onToggle={(key, val) => props.onEmailTemplatesChange({ ...props.selectedEmailTemplates, [key]: val })}
            content={props.emailTemplateContent}
            onContentChange={props.onEmailTemplateContentChange}
            logoUrl={props.logoUrl}
          />
        </motion.div>
      </StepCard>
    </div>
  </StepShell>
);
