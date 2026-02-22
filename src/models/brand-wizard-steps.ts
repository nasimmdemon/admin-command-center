export const TOTAL_BRAND_WIZARD_STEPS = 15;

export const EMAIL_TEMPLATES_CONFIG = {
  ClientAuth: {
    label: "Client Authentication",
    description: "Client signup from auth gate (Classic)",
    path: "BLAPI\\EmailsUsecases\\ClientAuth",
    defaultSubject: "Welcome to your account",
    defaultBody: "Hello,\n\nThank you for signing up. Your account has been created successfully.\n\nBest regards",
  },
  LeadInitialDetails: {
    label: "Lead Initial Details",
    description: "Lead → Client (auto gen password and lead info used for sending initial password)",
    path: "BLAPI\\EmailsUsecases\\LeadInitialDeatils",
    defaultSubject: "Your account details",
    defaultBody: "Hello,\n\nYour account has been created. Please find your login credentials below.\n\nBest regards",
  },
  ClientChangeCreds: {
    label: "Client Change Credentials",
    description: "Change client credentials",
    path: "BLAPI\\EmailsUsecases\\ClientChangeCreds",
    defaultSubject: "Your credentials have been updated",
    defaultBody: "Hello,\n\nYour account credentials have been changed successfully.\n\nBest regards",
  },
  UserChangeCreds: {
    label: "User Change Credentials",
    description: "Change user credentials",
    path: "BLAPI\\EmailsUsecases\\UserChangeCreds",
    defaultSubject: "Your credentials have been updated",
    defaultBody: "Hello,\n\nYour user credentials have been changed successfully.\n\nBest regards",
  },
} as const;
