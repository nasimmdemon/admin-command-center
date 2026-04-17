/** Last step index (Brand design). Create flow: 0 … 18. */
export const TOTAL_BRAND_WIZARD_STEPS = 18;
/** Total steps when creating (includes mode selection at step 0) */
export const TOTAL_CREATE_STEPS = 18;

/** Departments + workers merged here — redirect when By worker needs CSV */
export const STEP_DEPARTMENTS_AND_WORKERS = 2;

/** Fixed shortcodes – use these in templates; they are replaced at send time. Do not change the format. */
export const EMAIL_SHORTCODES = [
  { code: "{user_name}", label: "User name" },
  { code: "{brand_name}", label: "Brand name" },
  { code: "{client_first_name}", label: "Client first name" },
  { code: "{message}", label: "Message" },
  { code: "{user_role}", label: "User role" },
] as const;

export const EMAIL_TEMPLATES_CONFIG = {
  ClientCardEmailFromUser: {
    label: "Client Card – Message from user",
    description: "Send email from a user to a client (e.g. support message)",
    path: "client_card.email_from_user",
    shortcodes: ["{user_name}", "{brand_name}", "{client_first_name}", "{message}", "{user_role}"] as const,
    defaultSubject: "A message from {user_name} at {brand_name}",
    defaultBody: `Hi {client_first_name},

{user_name} from {brand_name} has sent you a new message:

"{message}"

If you have any questions, you can reply directly to this email.

Best regards,
{user_name}
{user_role} · {brand_name}`,
  },
  ClientAuth: {
    label: "Client Authentication",
    description: "Client signup from auth gate (Classic)",
    path: "BLAPI\\EmailsUsecases\\ClientAuth",
    shortcodes: ["{user_name}", "{brand_name}", "{client_first_name}"] as const,
    defaultSubject: "Welcome to {brand_name}",
    defaultBody: `Hi {client_first_name},

Welcome to {brand_name}! Your account has been created successfully.

You can now log in and start trading. If you have any questions, contact our support team.

Best regards,
{user_name}
{brand_name} Support`,
  },
  LeadInitialDetails: {
    label: "Lead Initial Details",
    description: "Lead → Client (auto gen password and lead info used for sending initial password)",
    path: "BLAPI\\EmailsUsecases\\LeadInitialDeatils",
    shortcodes: ["{user_name}", "{brand_name}", "{client_first_name}"] as const,
    defaultSubject: "Your {brand_name} account details",
    defaultBody: `Hi {client_first_name},

Your account at {brand_name} has been created. Please find your login credentials below.

Username: [auto-generated]
Password: [auto-generated]

Please change your password after your first login.

Best regards,
{user_name}
{brand_name}`,
  },
  ClientChangeCreds: {
    label: "Client Change Credentials",
    description: "Change client credentials",
    path: "BLAPI\\EmailsUsecases\\ClientChangeCreds",
    shortcodes: ["{user_name}", "{brand_name}"] as const,
    defaultSubject: "Your credentials have been updated",
    defaultBody: `Hello,

Your account credentials at {brand_name} have been changed successfully.

If you did not make this change, please contact support immediately.

Best regards,
{user_name}
{brand_name}`,
  },
  UserChangeCreds: {
    label: "User Change Credentials",
    description: "Change user credentials",
    path: "BLAPI\\EmailsUsecases\\UserChangeCreds",
    shortcodes: ["{user_name}", "{brand_name}"] as const,
    defaultSubject: "Your credentials have been updated",
    defaultBody: `Hello,

Your user credentials at {brand_name} have been changed successfully.

If you did not make this change, please contact your administrator.

Best regards,
{user_name}
{brand_name}`,
  },
} as const;
