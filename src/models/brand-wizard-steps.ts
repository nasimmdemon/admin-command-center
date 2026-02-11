export const TOTAL_BRAND_WIZARD_STEPS = 14;

export const EMAIL_TEMPLATES_CONFIG = {
  ClientAuth: {
    label: "Client Authentication",
    description: "Client signup from auth gate (Classic)",
    path: "BLAPI\\EmailsUsecases\\ClientAuth",
  },
  LeadInitialDetails: {
    label: "Lead Initial Details",
    description: "Lead → Client (auto gen password and lead info used for sending initial password)",
    path: "BLAPI\\EmailsUsecases\\LeadInitialDeatils",
  },
  ClientChangeCreds: {
    label: "Client Change Credentials",
    description: "Change client credentials",
    path: "BLAPI\\EmailsUsecases\\ClientChangeCreds",
  },
  UserChangeCreds: {
    label: "User Change Credentials",
    description: "Change user credentials",
    path: "BLAPI\\EmailsUsecases\\UserChangeCreds",
  },
} as const;
