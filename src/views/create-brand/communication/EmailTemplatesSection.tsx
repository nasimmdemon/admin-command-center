import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EMAIL_TEMPLATES_CONFIG } from "@/models/brand-wizard-steps";

interface EmailTemplatesSectionProps {
  selected: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
  content: Record<string, { subject: string; body: string }>;
  onContentChange: (key: string, value: { subject: string; body: string }) => void;
  logoUrl?: string;
}

export const EmailTemplatesSection = ({ selected, onToggle, content, onContentChange, logoUrl }: EmailTemplatesSectionProps) => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  const openModal = (key: string) => {
    const template = EMAIL_TEMPLATES_CONFIG[key as keyof typeof EMAIL_TEMPLATES_CONFIG];
    const existing = content[key];
    setEditSubject(existing?.subject ?? template?.defaultSubject ?? "");
    setEditBody(existing?.body ?? template?.defaultBody ?? "");
    setOpenKey(key);
  };

  const closeModal = () => setOpenKey(null);

  const handleSave = () => {
    if (!openKey) return;
    onContentChange(openKey, { subject: editSubject, body: editBody });
    onToggle(openKey, true);
    closeModal();
  };

  const handleDisable = () => {
    if (!openKey) return;
    onToggle(openKey, false);
    closeModal();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email Templates</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Click a template to configure it. Add subject and message – your brand logo (Step 8) will be included.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(EMAIL_TEMPLATES_CONFIG).map(([key, template]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            role="button"
            tabIndex={0}
            onClick={() => openModal(key)}
            onKeyDown={(e) => e.key === "Enter" && openModal(key)}
            className={`rounded-xl border p-4 bg-card transition-all duration-300 ease-smooth shadow-widget hover:shadow-card cursor-pointer relative ${
              selected[key] ? "border-primary/60 bg-tint-blue ring-2 ring-primary/20" : "border-border/50 hover:border-muted-foreground/40"
            }`}
          >
            {selected[key] && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-xs font-medium">
                <Check className="w-3 h-3" /> Selected
              </span>
            )}
            <div className="flex-1 min-w-0 pr-20">
              <p className="font-medium text-foreground">{template.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
              <p className="text-xs text-muted-foreground/70 mt-1 font-mono break-all">{template.path}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {logoUrl && (
        <p className="text-xs text-success">Brand logo will be included in all emails</p>
      )}

      <Dialog open={!!openKey} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {openKey && EMAIL_TEMPLATES_CONFIG[openKey as keyof typeof EMAIL_TEMPLATES_CONFIG]?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Email subject"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message body</Label>
              <Textarea
                placeholder="Hello client..."
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="min-h-[160px] resize-y"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {openKey && selected[openKey] && (
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 order-2 sm:order-1" onClick={handleDisable}>
                Disable template
              </Button>
            )}
            <div className="flex gap-2 order-1 sm:order-2 ml-auto">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
