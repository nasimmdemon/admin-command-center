import { useState } from "react";
import { StepWhatsApp } from "@/views/create-brand";

export const StepWhatsAppDemo = () => {
  const [includeWhatsApp, setIncludeWhatsApp] = useState(false);
  const [whatsappQrCode, setWhatsappQrCode] = useState("");
  return (
    <StepWhatsApp
      includeWhatsApp={includeWhatsApp}
      onIncludeWhatsAppChange={setIncludeWhatsApp}
      whatsappQrCode={whatsappQrCode}
    />
  );
};
