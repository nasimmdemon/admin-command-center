import { useState } from "react";
import { StepWhatsApp } from "@/views/create-brand";

export const StepWhatsAppDemo = () => {
  const [includeWhatsApp, setIncludeWhatsApp] = useState(true);
  const [whatsappAllocationModes, setWhatsappAllocationModes] = useState({
    byBrand: true,
    byDesk: true,
    byWorker: true,
  });
  const [whatsappQrCode, setWhatsappQrCode] = useState("");
  const [whatsappDeskQrCode, setWhatsappDeskQrCode] = useState("");
  const [whatsappWorkerEntries, setWhatsappWorkerEntries] = useState<
    import("@/types/worker-comms").WhatsAppWorkerEntry[]
  >([]);
  const uploadedWorkers = [
    { email: "a@example.com", full_name: "Alice", brandName: "Demo", valid: true },
    { email: "b@example.com", full_name: "Bob", brandName: "Demo", valid: true },
  ];
  return (
    <StepWhatsApp
      includeWhatsApp={includeWhatsApp}
      onIncludeWhatsAppChange={setIncludeWhatsApp}
      whatsappAllocationModes={whatsappAllocationModes}
      onWhatsappAllocationModesChange={setWhatsappAllocationModes}
      whatsappQrCode={whatsappQrCode}
      onWhatsappQrCodeChange={setWhatsappQrCode}
      whatsappDeskQrCode={whatsappDeskQrCode}
      onWhatsappDeskQrCodeChange={setWhatsappDeskQrCode}
      whatsappWorkerEntries={whatsappWorkerEntries}
      onWhatsappWorkerEntriesChange={setWhatsappWorkerEntries}
      uploadedWorkers={uploadedWorkers}
      currentBrandName="Demo"
    />
  );
};
