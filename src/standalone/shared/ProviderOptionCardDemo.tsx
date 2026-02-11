import { useState } from "react";
import { ProviderOptionCard } from "@/views/create-brand/communication/ProviderOptionCard";

export const ProviderOptionCardDemo = () => {
  const [selected, setSelected] = useState("maileroo");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
      <ProviderOptionCard label="Maileroo" sublabel="Lower cost" selected={selected === "maileroo"} onClick={() => setSelected("maileroo")} />
      <ProviderOptionCard label="Alexders" sublabel="Higher cost" selected={selected === "alexders"} onClick={() => setSelected("alexders")} />
      <ProviderOptionCard label="Other" sublabel="External" selected={selected === "other"} onClick={() => setSelected("other")} />
    </div>
  );
};
