import { useState } from "react";
import { StepBrands } from "@/views/create-brand";

export const StepBrandsDemo = () => {
  const [brands, setBrands] = useState([{ name: "Demo Brand", domain: "demo.com", substituteDomain: "demo.com" }]);
  return (
    <StepBrands
      brands={brands}
      onAddBrand={() => setBrands((b) => [...b, { name: "", domain: "" }])}
      onRemoveBrand={(i) => setBrands((b) => b.filter((_, idx) => idx !== i))}
      onUpdateBrand={(i, field, value) => setBrands((b) => b.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)))}
    />
  );
};
