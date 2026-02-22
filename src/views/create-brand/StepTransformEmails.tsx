import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepTransformEmailsProps {
  brandLabel: string;
  autoGenPasswordForLeads: boolean;
  onAutoGenPasswordForLeadsChange: (v: boolean) => void;
  autoRejectNoInteractivity: boolean;
  onAutoRejectNoInteractivityChange: (v: boolean) => void;
  blockedEmailProviders: string[];
  onBlockedEmailProvidersChange: (v: string[]) => void;
  newEmailProvider: string;
  onNewEmailProviderChange: (v: string) => void;
}

export const StepTransformEmails = (props: StepTransformEmailsProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">Email Automation</h2>
    <p className="text-sm text-muted-foreground">{props.brandLabel}</p>

    <div className="space-y-4 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-muted/20">
        <div>
          <Label>Auto gen password for leads with welcome email</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Generate password automatically when converting lead to client</p>
        </div>
        <Switch checked={props.autoGenPasswordForLeads} onCheckedChange={props.onAutoGenPasswordForLeadsChange} />
      </div>
      <div className={`flex items-center justify-between rounded-xl border border-border/50 p-3 ${props.autoGenPasswordForLeads ? "bg-tint-blue/50" : "bg-muted/20"}`}>
        <div>
          <Label>Auto reject for no interactivity</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Reject clients who don&apos;t interact after receiving welcome email</p>
        </div>
        <Switch
          checked={props.autoRejectNoInteractivity}
          onCheckedChange={props.onAutoRejectNoInteractivityChange}
          disabled={props.autoGenPasswordForLeads}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Reject clients with these email providers:</Label>
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
      <p className="text-xs text-muted-foreground">Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">email_provider_criteria</code> with <code className="text-xs bg-secondary px-1 py-0.5 rounded">blocked_providers</code>.</p>
    </div>
  </div>
);
