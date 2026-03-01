import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepTransformEmailsProps {
  brandLabel: string;
  emailFormatValidation: boolean;
  onEmailFormatValidationChange: (v: boolean) => void;
  autoGenPasswordForLeads: boolean;
  onAutoGenPasswordForLeadsChange: (v: boolean) => void;
  includePasswordChangeLinkInEmail: boolean;
  onIncludePasswordChangeLinkInEmailChange: (v: boolean) => void;
  autoRejectNoInteractivity: boolean;
  onAutoRejectNoInteractivityChange: (v: boolean) => void;
  autoRejectDaysAfterWelcome: number;
  onAutoRejectDaysAfterWelcomeChange: (v: number) => void;
  blockedEmailProviders: string[];
  onBlockedEmailProvidersChange: (v: string[]) => void;
  newEmailProvider: string;
  onNewEmailProviderChange: (v: string) => void;
}

export const StepTransformEmails = (props: StepTransformEmailsProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Email Automation</h2>
    <p className="text-sm text-muted-foreground">{props.brandLabel}</p>

    <div className="space-y-2 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <Label className="text-sm font-medium">Email format</Label>
      <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-muted/20">
        <div>
          <Label className="text-sm">Require standard email format</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Validate client emails as user@domain.com</p>
        </div>
        <Switch checked={props.emailFormatValidation} onCheckedChange={props.onEmailFormatValidationChange} />
      </div>
    </div>

    <div className="space-y-4 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-muted/20">
        <div>
          <Label>Auto gen password for leads with welcome email</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Generate password automatically when converting lead to client. Provider can also set password manually.</p>
        </div>
        <Switch checked={props.autoGenPasswordForLeads} onCheckedChange={props.onAutoGenPasswordForLeadsChange} />
      </div>
      {props.autoGenPasswordForLeads && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-tint-blue/30">
          <div>
            <Label className="text-sm">Include password change link in welcome email</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Send email with link for client to change password</p>
          </div>
          <Switch checked={props.includePasswordChangeLinkInEmail} onCheckedChange={props.onIncludePasswordChangeLinkInEmailChange} />
        </motion.div>
      )}
      <div className={`flex items-center justify-between gap-4 rounded-xl border border-border/50 p-3 ${props.autoGenPasswordForLeads ? "bg-tint-blue/50" : "bg-muted/20"}`}>
        <div>
          <Label>Auto reject for no interactivity</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Reject clients who don&apos;t interact after receiving welcome email</p>
        </div>
        <Switch
          checked={props.autoRejectNoInteractivity}
          onCheckedChange={props.onAutoRejectNoInteractivityChange}
          disabled={!props.autoGenPasswordForLeads}
        />
      </div>
      {props.autoRejectNoInteractivity && props.autoGenPasswordForLeads && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-4 rounded-xl border border-border/50 p-3 bg-muted/20">
          <Label className="text-sm whitespace-nowrap">Reject after (days):</Label>
          <Input
            type="number"
            min={1}
            max={365}
            value={props.autoRejectDaysAfterWelcome}
            onChange={(e) => props.onAutoRejectDaysAfterWelcomeChange(Math.max(1, Math.min(365, parseInt(e.target.value, 10) || 7)))}
            className="w-20"
          />
          <p className="text-xs text-muted-foreground">Days of no interaction before auto-reject</p>
        </motion.div>
      )}
    </div>

    <div className="space-y-2">
      <Label>Blocked email providers (reject clients using these):</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {props.blockedEmailProviders.map((provider) => (
          <motion.span
            key={provider}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
          >
            {provider}
            <button onClick={() => props.onBlockedEmailProvidersChange(props.blockedEmailProviders.filter((p) => p !== provider))} className="hover:text-destructive/70 ml-1">×</button>
          </motion.span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="tempmail.com"
          value={props.newEmailProvider}
          onChange={(e) => props.onNewEmailProviderChange(e.target.value.toLowerCase().trim())}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.newEmailProvider && !props.blockedEmailProviders.includes(props.newEmailProvider)) {
              props.onBlockedEmailProvidersChange([...props.blockedEmailProviders, props.newEmailProvider]);
              props.onNewEmailProviderChange("");
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (props.newEmailProvider && !props.blockedEmailProviders.includes(props.newEmailProvider)) {
              props.onBlockedEmailProvidersChange([...props.blockedEmailProviders, props.newEmailProvider]);
              props.onNewEmailProviderChange("");
            }
          }}
        >
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">email_provider_criteria</code> with <code className="text-xs bg-secondary px-1 py-0.5 rounded">blocked_providers</code>. Allowed providers are configured in Email step.</p>
    </div>
  </div>
);
