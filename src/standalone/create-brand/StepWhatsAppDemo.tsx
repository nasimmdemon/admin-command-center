import { useState } from "react";
import { StepWhatsApp } from "@/views/create-brand";

export const StepWhatsAppDemo = () => {
  const [includeWhatsApp, setIncludeWhatsApp] = useState(false);
  const [whatsappAdditionalModes, setWhatsappAdditionalModes] = useState({ by_brand: false, by_worker: false });
  const [whatsappQrCode, setWhatsappQrCode] = useState("");
  return (
    <StepWhatsApp
      includeWhatsApp={includeWhatsApp}
      onIncludeWhatsAppChange={setIncludeWhatsApp}
      whatsappAdditionalModes={whatsappAdditionalModes}
      onWhatsappAdditionalModesChange={setWhatsappAdditionalModes}
      whatsappQrCode={whatsappQrCode}
    />
  );
};
