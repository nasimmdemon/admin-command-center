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
  { id: "departments", label: "Departments & workers", firstStep: 2, group: "Brand Scopes" },
  { id: "desks", label: "Desks", firstStep: 2, group: "Brand Scopes" },
  { id: "payment", label: "Payment", firstStep: 3, group: "Providers" },
  { id: "voip", label: "VoIP", firstStep: 8, group: "Providers" },
  { id: "email", label: "Email", firstStep: 7, group: "Providers" },
  { id: "kyc", label: "KYC", firstStep: 5, group: "Other" },
  { id: "terms", label: "Terms", firstStep: 6, group: "Other" },
  { id: "workers", label: "Upload Workers", firstStep: 2, group: "Other" },
  { id: "logo", label: "Logo", firstStep: 10, group: "Other" },
  { id: "trader", label: "Trader Platform & Markets", firstStep: 11, group: "Other" },
  { id: "fees", label: "Trading Fees", firstStep: 13, group: "Other" },
  { id: "clientTas", label: "Client TAs", firstStep: 14, group: "Other" },
  { id: "defaults", label: "Default Settings", firstStep: 15, group: "Other" },
  { id: "brandStatuses", label: "Brand statuses", firstStep: 16, group: "Other" },
  { id: "caseOfDesign", label: "Case of design", firstStep: 17, group: "Other" },
  { id: "brandDesign", label: "Brand design", firstStep: 18, group: "Other" },
];

/** Get category label for a step (for create flow header) */
export function getCategoryLabelForStep(step: number): string | null {
  if (step === 0) return null;
  if (step === 1) return "Brand Scopes: Brands";
  if (step === 2) return "Brand Scopes: Departments & workers";
  if (step >= 3 && step <= 4) return "Providers: Payment";
  if (step === 5) return "KYC";
  if (step === 6) return "Terms";
  if (step === 7) return "Providers: Email";
  if (step === 8) return "Providers: VoIP";
  if (step === 9) return "Providers: WhatsApp";
  if (step === 10) return "Logo";
  if (step === 11) return "Trader Platform";
  if (step === 12) return "Trader Markets";
  if (step === 13) return "Trading Fees";
  if (step === 14) return "Client TAs";
  if (step === 15) return "Default Settings";
  if (step === 16) return "Brand statuses";
  if (step === 17) return "Case of design";
  if (step === 18) return "Brand design";
  return null;
}
