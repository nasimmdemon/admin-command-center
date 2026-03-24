/** Creation pipeline for status automation */
export type BrandStatusCreationMode = "off" | "yes" | "mandatory_yes";

/** Auto routing for transfer / alloc / creation (transform is mandatory elsewhere — not toggled here) */
export interface BrandStatusAutoConfig {
  transferAutoBrand: boolean;
  transferAutoDepartment: boolean;
  transferAutoDesk: boolean;
  allocPull: boolean;
  creation: BrandStatusCreationMode;
}

/** Registration: which candidate statuses are allowed (never includes fixed auto-reject reasons) */
export const REGISTRATION_STATUS_CANDIDATES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "callback_requested", label: "Callback requested" },
  { id: "interested", label: "Interested" },
  { id: "pending_review", label: "Pending review" },
  { id: "follow_up", label: "Follow up" },
  { id: "scheduled", label: "Scheduled" },
] as const;

/** Fixed auto-rejecting statuses (informational; not selectable as “allowed reg” statuses) */
export const AUTO_REJECT_STATUS_INFO = [
  {
    id: "no_answer",
    title: "No answer",
    description:
      "When interactivity check failed and the case must be corrected manually.",
  },
  {
    id: "wrong_language",
    title: "Wrong language",
    description: "Expected language does not match the client (e.g. thought FR, only RU).",
  },
  {
    id: "wrong_country",
    title: "Wrong country",
    description: "Location mismatch (e.g. thought Germany, client lives in US).",
  },
  {
    id: "wrong_person",
    title: "Wrong person",
    description: "Mismatch such as wrong gender or age.",
  },
] as const;

export type AppBarNamingScheme = "brand_first" | "desk_first" | "minimal" | "custom";
export type BoxStyle = "rounded" | "sharp" | "soft" | "outline";

/** Variations of the same product under one case-of-design (flow unchanged) */
export interface BrandCaseDesignConfig {
  appBarNamingScheme: AppBarNamingScheme;
  customAppBarLabel: string;
  boxStyle: BoxStyle;
  variationNotes: string;
}

/** Fonts (1–4) and core colors for brand theming */
export interface BrandDesignTokens {
  fontSlot1: string;
  fontSlot2: string;
  fontSlot3: string;
  fontSlot4: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
}

export const DEFAULT_BRAND_STATUS_AUTO: BrandStatusAutoConfig = {
  transferAutoBrand: false,
  transferAutoDepartment: false,
  transferAutoDesk: false,
  allocPull: false,
  creation: "yes",
};

export const DEFAULT_BRAND_CASE_DESIGN: BrandCaseDesignConfig = {
  appBarNamingScheme: "brand_first",
  customAppBarLabel: "",
  boxStyle: "rounded",
  variationNotes: "",
};

export const DEFAULT_BRAND_DESIGN_TOKENS: BrandDesignTokens = {
  fontSlot1: "",
  fontSlot2: "",
  fontSlot3: "",
  fontSlot4: "",
  colorPrimary: "#2563eb",
  colorSecondary: "#64748b",
  colorAccent: "#0ea5e9",
  colorBackground: "#f8fafc",
  colorSurface: "#ffffff",
};
