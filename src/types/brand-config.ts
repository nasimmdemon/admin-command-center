export interface FeeConfig {
  type: "percentage" | "fixed" | "combined";
  value: number;
  percentage?: number;
  fixed?: number;
  min_fee: number | null;
  max_fee: number | null;
}

export interface ApprovalConfig {
  mode: "auto" | "manual";
  required_approver_roles?: string[];
}

export interface ExternalProviderConfig {
  domain?: string;
  api_key?: string;
  docs_url?: string;
}

/** iPay config when fiat provider is "ours" */
export interface IpayProviderConfig {
  base_url?: string;
  api_key?: string;
}

/** Crypto Now config when crypto provider is "ours" */
export interface CryptoNowProviderConfig {
  base_url?: string;
  checkout_url?: string;
  public_key?: string;
  private_key?: string;
}

export interface DepositMethod {
  enabled: boolean;
  fee: FeeConfig;
  approval: ApprovalConfig;
  min_amount?: number;
  /** "ours" = our solution (iPay, Crypto Now) | "other" = external */
  provider_source?: "ours" | "other";
  external_config?: ExternalProviderConfig;
  /** iPay config (fiat only, when provider_source is "ours") */
  ipay_config?: IpayProviderConfig;
  /** Crypto Now config (crypto only, when provider_source is "ours") */
  crypto_now_config?: CryptoNowProviderConfig;
}

export interface WithdrawalMethod {
  enabled: boolean;
  fee: FeeConfig;
  approval: ApprovalConfig;
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  routing_number: string;
  beneficiary_name: string;
}

export interface WireTransferDetails {
  bank_name: string;
  account_number: string;
  swift_code: string;
}

export interface GlobalSettings {
  default_fee_type: string;
  default_fee_value: number;
  default_approval_mode: string;
  min_deposit_amount: number;
  max_deposit_amount: number;
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
  /** When bank transfer withdrawal is enabled: use client's credit/deposit data instead of asking for bank details */
  useCreditDataOnWithdrawal?: boolean;
}

export interface DepositConfig {
  deposit_methods: Record<string, DepositMethod>;
  bank_details: BankDetails;
  wire_transfer_details: WireTransferDetails;
}

export interface WithdrawalConfig {
  withdrawal_methods: Record<string, WithdrawalMethod>;
  global_settings: GlobalSettings;
}

export const DEFAULT_DEPOSIT_METHODS: Record<string, DepositMethod> = {
  fiat: { enabled: true, fee: { type: "percentage", value: 3.0, min_fee: null, max_fee: null }, approval: { mode: "auto" } },
  crypto: { enabled: false, fee: { type: "percentage", value: 2.0, min_fee: null, max_fee: null }, approval: { mode: "auto" } },
  wire_transfer: { enabled: true, fee: { type: "fixed", value: 10.0, min_fee: null, max_fee: null }, approval: { mode: "manual" } },
  bank_transfer: { enabled: false, fee: { type: "fixed", value: 25.0, min_fee: null, max_fee: null }, approval: { mode: "manual" }, min_amount: 100 },
  loan: { enabled: false, fee: { type: "percentage", value: 2.0, min_fee: null, max_fee: null }, approval: { mode: "auto", required_approver_roles: ["Department Manager", "Super Admin"] } },
  future_pay: { enabled: false, fee: { type: "percentage", value: 1.0, min_fee: null, max_fee: null }, approval: { mode: "auto" } },
  token_payments: { enabled: false, fee: { type: "percentage", value: 1.5, min_fee: null, max_fee: null }, approval: { mode: "auto" } },
};

export const DEFAULT_WITHDRAWAL_METHODS: Record<string, WithdrawalMethod> = {
  wire_transfer: { enabled: true, fee: { type: "fixed", value: 10.0, min_fee: null, max_fee: null }, approval: { mode: "manual" } },
  crypto: { enabled: true, fee: { type: "combined", value: 10.0, percentage: 3.0, fixed: 10.0, min_fee: null, max_fee: null }, approval: { mode: "manual" } },
  bank_account: { enabled: false, fee: { type: "percentage", value: 2.0, min_fee: null, max_fee: null }, approval: { mode: "manual" } },
};

export const DEFAULT_BANK_DETAILS: BankDetails = {
  bank_name: "", account_number: "", routing_number: "", beneficiary_name: "",
};

export const DEFAULT_WIRE_DETAILS: WireTransferDetails = {
  bank_name: "", account_number: "", swift_code: "",
};

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  default_fee_type: "percentage",
  default_fee_value: 2.5,
  default_approval_mode: "manual",
  min_deposit_amount: 10,
  max_deposit_amount: 100000,
  min_withdrawal_amount: 10,
  max_withdrawal_amount: 50000,
  useCreditDataOnWithdrawal: false,
};

export const METHOD_LABELS: Record<string, string> = {
  fiat: "Fiat Payments",
  crypto: "Crypto Payments",
  wire_transfer: "Wire Transfer",
  bank_transfer: "Bank Deposit",
  loan: "Loan",
  future_pay: "FUTURE PAY",
  token_payments: "TOKEN PAYMENTS",
  bank_account: "Bank Account",
};
