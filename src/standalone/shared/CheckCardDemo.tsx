import { useState } from "react";
import { CheckCard } from "@/views/shared/CheckCard";

export const CheckCardDemo = () => {
  const [items, setItems] = useState<Record<string, boolean>>({
    Passport: false,
    "ID": true,
    "Utility Bill": false,
    "Require Selfie": false,
  });
  return (
    <div className="grid grid-cols-2 gap-3 max-w-md">
      {Object.entries(items).map(([key, val]) => (
        <CheckCard key={key} label={key} checked={val} onChange={(v) => setItems((s) => ({ ...s, [key]: v }))} />
      ))}
    </div>
  );
};
