import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { EMAIL_TEMPLATES_CONFIG } from "@/models/brand-wizard-steps";

interface EmailTemplatesSectionProps {
  selected: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
}

export const EmailTemplatesSection = ({ selected, onToggle }: EmailTemplatesSectionProps) => (
  <div className="space-y-3">
    <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Templates</Label>
    <p className="text-sm text-muted-foreground">Select which email templates to enable for this brand</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Object.entries(EMAIL_TEMPLATES_CONFIG).map(([key, template]) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`rounded-lg border p-4 bg-card transition-all ${
            selected[key] ? "border-primary/50 bg-primary/5" : "hover:border-muted-foreground/50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                selected[key] ? "bg-primary border-primary" : "border-muted-foreground/30"
              }`}
            >
              {selected[key] && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <button onClick={() => onToggle(key, !selected[key])} className="text-left w-full">
                <p className="font-medium text-foreground">{template.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                <p className="text-xs text-muted-foreground/70 mt-1 font-mono break-all">{template.path}</p>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
