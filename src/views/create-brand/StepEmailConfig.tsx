import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { EmailProviderSection } from "./communication/EmailProviderSection";
import { EmailTemplatesSection } from "./communication/EmailTemplatesSection";

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
  <div className="space-y-10">
    <div className="text-center max-w-xl mx-auto">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/8 text-primary mb-4">
        <Mail className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-foreground tracking-tight">Email configuration</h2>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Choose your provider and customize templates. Use {`{shortcodes}`} as placeholders — they&apos;re fixed; backspace removes the whole token.
      </p>
    </div>

    <div className="flex flex-col gap-8 lg:gap-12">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-card/50 border border-border/30 p-6 lg:p-8 backdrop-blur-sm"
      >
        <h3 className="text-sm font-medium text-foreground mb-4">Provider</h3>
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
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-2xl bg-card/50 border border-border/30 p-6 lg:p-8 backdrop-blur-sm"
      >
        <h3 className="text-sm font-medium text-foreground mb-4">Templates</h3>
        <EmailTemplatesSection
          selected={props.selectedEmailTemplates}
          onToggle={(key, val) => props.onEmailTemplatesChange({ ...props.selectedEmailTemplates, [key]: val })}
          content={props.emailTemplateContent}
          onContentChange={props.onEmailTemplateContentChange}
          logoUrl={props.logoUrl}
        />
      </motion.section>
    </div>
  </div>
);
