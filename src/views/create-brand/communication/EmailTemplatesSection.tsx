import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ShortcodeProtectedInput, ShortcodeProtectedTextarea } from "@/components/brand-wizard/ShortcodeProtectedInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EMAIL_TEMPLATES_CONFIG, EMAIL_SHORTCODES } from "@/models/brand-wizard-steps";

interface EmailTemplatesSectionProps {
  selected: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
  content: Record<string, { subject: string; body: string }>;
  onContentChange: (key: string, value: { subject: string; body: string }) => void;
  logoUrl?: string;
}

const insertAtCursor = (value: string, start: number, end: number, text: string) => {
  const before = value.slice(0, start);
  const after = value.slice(end);
  return before + text + after;
};

export const EmailTemplatesSection = ({ selected, onToggle, content, onContentChange, logoUrl }: EmailTemplatesSectionProps) => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const pendingCursorRef = useRef<{ target: "subject" | "body"; pos: number } | null>(null);

  useEffect(() => {
    if (!pendingCursorRef.current) return;
    const { target, pos } = pendingCursorRef.current;
    pendingCursorRef.current = null;
    const el = target === "subject" ? subjectRef.current : bodyRef.current;
    if (!el) return;
    const apply = () => {
      el.focus();
      el.setSelectionRange(pos, pos);
    };
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }, [editSubject, editBody]);

  const openModal = (key: string) => {
    const template = EMAIL_TEMPLATES_CONFIG[key as keyof typeof EMAIL_TEMPLATES_CONFIG];
    const existing = content[key];
    setEditSubject(existing?.subject || template?.defaultSubject || "");
    setEditBody(existing?.body || template?.defaultBody || "");
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

  const insertShortcodeInBody = (code: string) => {
    const ta = bodyRef.current;
    const start = ta?.selectionStart ?? editBody.length;
    const end = ta?.selectionEnd ?? editBody.length;
    const newValue = insertAtCursor(editBody, start, end, code);
    pendingCursorRef.current = { target: "body", pos: start + code.length };
    setEditBody(newValue);
  };

  const insertShortcodeInSubject = (code: string) => {
    const input = subjectRef.current;
    const start = input?.selectionStart ?? editSubject.length;
    const end = input?.selectionEnd ?? editSubject.length;
    const newValue = insertAtCursor(editSubject, start, end, code);
    pendingCursorRef.current = { target: "subject", pos: start + code.length };
    setEditSubject(newValue);
  };

  const templateOrder = ["ClientCardEmailFromUser", "ClientAuth", "LeadInitialDetails", "ClientChangeCreds", "UserChangeCreds"] as const;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click a template to edit. Use <span className="font-mono text-xs bg-muted/80 px-1.5 py-0.5 rounded">{`{shortcodes}`}</span> as placeholders — fixed at send time. Edit the rest freely.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {templateOrder.map((key, i) => {
          const template = EMAIL_TEMPLATES_CONFIG[key];
          if (!template) return null;
          return (
            <motion.button
              key={key}
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              onClick={() => openModal(key)}
              className={`text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer relative ${
                selected[key]
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/30 bg-muted/10 hover:bg-muted/20 hover:border-border/50"
              }`}
            >
              {selected[key] && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-xs font-medium">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
              <p className="font-medium text-foreground text-sm pr-16">{template.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
            </motion.button>
          );
        })}
      </div>
      {logoUrl && (
        <p className="text-xs text-success">Brand logo will be included in all emails</p>
      )}

      <Dialog open={!!openKey} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-xl rounded-2xl border-border/30">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {openKey && EMAIL_TEMPLATES_CONFIG[openKey as keyof typeof EMAIL_TEMPLATES_CONFIG]?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-1">
            <div className="rounded-xl border border-dashed border-primary/30 p-4 bg-primary/5">
              <p className="text-xs font-medium text-foreground mb-4">Click to insert into subject</p>
              <div className="flex flex-wrap gap-2">
                {EMAIL_SHORTCODES.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => insertShortcodeInSubject(code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium text-xs hover:bg-primary/20 hover:border-primary/50 transition-colors shadow-sm"
                    title={`Insert ${label} into subject`}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span className="font-mono">{code}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject</Label>
              <ShortcodeProtectedInput
                ref={subjectRef}
                placeholder="Email subject"
                value={editSubject}
                onChange={setEditSubject}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Message body</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EMAIL_SHORTCODES.map(({ code }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => insertShortcodeInBody(code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium text-xs hover:bg-primary/20 hover:border-primary/50 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span className="font-mono">{code}</span>
                  </button>
                ))}
              </div>
              <ShortcodeProtectedTextarea
                ref={bodyRef}
                placeholder="Hi {client_first_name}, ..."
                value={editBody}
                onChange={setEditBody}
                className="min-h-[200px] resize-y rounded-xl border-border/30"
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
