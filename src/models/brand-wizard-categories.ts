/** Edit category: id and first step to jump to */
export interface EditCategoryOption {
  id: string;
  label: string;
  firstStep: number;
  group: "Providers" | "Brand Scopes" | "Other";
}

/** Options for edit modal - select category to jump to that section */
export const EDIT_CATEGORY_OPTIONS: EditCategoryOption[] = [
  { id: "brands", label: "Brands", firstStep: 1, group: "Brand Scopes" },
  { id: "departments", label: "Departments", firstStep: 2, group: "Brand Scopes" },
  { id: "desks", label: "Desks", firstStep: 2, group: "Brand Scopes" },
  { id: "payment", label: "Payment", firstStep: 3, group: "Providers" },
  { id: "voip", label: "VoIP", firstStep: 9, group: "Providers" },
  { id: "email", label: "Email", firstStep: 8, group: "Providers" },
  { id: "kyc", label: "KYC", firstStep: 5, group: "Other" },
  { id: "terms", label: "Terms", firstStep: 6, group: "Other" },
  { id: "workers", label: "Upload Workers", firstStep: 7, group: "Other" },
  { id: "logo", label: "Logo", firstStep: 11, group: "Other" },
  { id: "transform", label: "Transform (VoIP & Email)", firstStep: 12, group: "Other" },
  { id: "trader", label: "Trader Platform & Markets", firstStep: 13, group: "Other" },
  { id: "fees", label: "Trading Fees", firstStep: 15, group: "Other" },
  { id: "clientTas", label: "Client TAs", firstStep: 16, group: "Other" },
  { id: "defaults", label: "Default Settings", firstStep: 17, group: "Other" },
];

/** Get category label for a step (for create flow header) */
export function getCategoryLabelForStep(step: number): string | null {
  if (step === 0) return null;
  if (step === 1) return "Brand Scopes: Brands";
  if (step === 2) return "Brand Scopes: Departments";
  if (step >= 3 && step <= 4) return "Providers: Payment";
  if (step === 5) return "KYC";
  if (step === 6) return "Terms";
  if (step === 7) return "Upload Workers";
  if (step === 8) return "Providers: Email";
  if (step === 9) return "Providers: VoIP";
  if (step === 10) return "Providers: WhatsApp";
  if (step === 11) return "Logo";
  if (step === 12) return "Transform (VoIP & Phone & Email)";
  if (step === 13) return "Trader Platform";
  if (step === 14) return "Trader Markets";
  if (step === 15) return "Trading Fees";
  if (step === 16) return "Client TAs";
  if (step === 17) return "Default Settings";
  return null;
}
