import { motion } from "framer-motion";
import { MessageCircle, Smartphone, Layers, Building2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { QRCodeSVG } from "qrcode.react";

interface StepWhatsAppProps {
  includeWhatsApp: boolean;
  onIncludeWhatsAppChange: (v: boolean) => void;
  /** Default: by desk. Additional cases: by brand, by worker */
  whatsappAdditionalModes: { by_brand: boolean; by_worker: boolean };
  onWhatsappAdditionalModesChange: (v: { by_brand: boolean; by_worker: boolean }) => void;
  /** Pairing URL for WhatsApp Business - backend provides this when session is created */
  whatsappQrCode: string;
  onWhatsappQrCodeChange?: (v: string) => void;
}

/** Mock pairing URL - in production, backend creates session and returns this */
const MOCK_WHATSAPP_PAIRING_URL = "https://connect.whatsapp.com/oauth?client_id=demo&scope=whatsapp_business_messaging";

export const StepWhatsApp = ({
  includeWhatsApp,
  onIncludeWhatsAppChange,
  whatsappAdditionalModes,
  onWhatsappAdditionalModesChange,
  whatsappQrCode,
}: StepWhatsAppProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">WhatsApp Business</h2>
    <p className="text-sm text-muted-foreground">
      Connect WhatsApp Business to send messages from your admin account. Admins can scan the QR code to link their WhatsApp.
    </p>

    <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <Label className="text-base font-medium">Include WhatsApp</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Enable WhatsApp Business messaging for this brand</p>
        </div>
      </div>
      <Switch checked={includeWhatsApp} onCheckedChange={onIncludeWhatsAppChange} />
    </div>

    {includeWhatsApp && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="rounded-xl border border-border/50 p-4 bg-card shadow-widget">
          <Label className="text-sm font-medium">User initial connection</Label>
          <p className="text-xs text-muted-foreground mt-1">Default: by desk. RE US, CO US sit on same number.</p>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <Layers className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-sm">By desk</p>
              <p className="text-xs text-muted-foreground">Desk-based allocation (default)</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Include additional cases</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border/40 p-3 hover:bg-muted/30 transition-colors">
                <Checkbox
                  checked={whatsappAdditionalModes.by_brand}
                  onCheckedChange={(v) => onWhatsappAdditionalModesChange({ ...whatsappAdditionalModes, by_brand: !!v })}
                />
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">By brand</span>
                  <span className="text-xs text-muted-foreground">(brand sits on a certain number)</span>
                </div>
                <span className="text-xs text-amber-600 font-medium">Coming soon</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border/40 p-3 hover:bg-muted/30 transition-colors">
                <Checkbox
                  checked={whatsappAdditionalModes.by_worker}
                  onCheckedChange={(v) => onWhatsappAdditionalModesChange({ ...whatsappAdditionalModes, by_worker: !!v })}
                />
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">By worker</span>
                  <span className="text-xs text-muted-foreground">(worker has a specific number)</span>
                </div>
                <span className="text-xs text-amber-600 font-medium">Coming soon</span>
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/50 p-6 bg-card shadow-widget">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <Label className="text-sm font-medium">Connect WhatsApp Business</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Scan the QR code with WhatsApp on your phone to connect your admin account. This links your WhatsApp Business for sending messages.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 p-4 rounded-xl bg-white border border-border/50 shadow-widget">
              <QRCodeSVG
                value={whatsappQrCode || MOCK_WHATSAPP_PAIRING_URL}
                size={200}
                level="M"
                includeMargin
                className="text-foreground"
              />
            </div>
            <div className="flex-1 text-sm text-muted-foreground space-y-2">
              <p>1. Open WhatsApp on your phone</p>
              <p>2. Go to Settings → Linked Devices</p>
              <p>3. Tap &quot;Link a Device&quot;</p>
              <p>4. Scan this QR code</p>
              <p className="pt-2 text-primary font-medium">Your admin account will be connected for messaging.</p>
            </div>
          </div>
        </div>
      </motion.div>
    )}

    {!includeWhatsApp && (
      <div className="rounded-xl border border-dashed border-border/60 p-6 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">WhatsApp is disabled. Enable the toggle above to connect WhatsApp Business.</p>
      </div>
    )}
  </div>
);
