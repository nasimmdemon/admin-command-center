import { FolderPlus, LayoutDashboard, Component } from "lucide-react";
import * as CreateBrandDemos from "./create-brand";
import * as MonitorDemos from "./monitor";
import * as SharedDemos from "./shared";

export type WidgetCategory = "create-brand" | "monitor" | "shared";

export interface WidgetDef {
  id: string;
  name: string;
  category: WidgetCategory;
  component: React.ReactNode;
  description?: string;
}

const CREATE_BRAND_WIDGETS: WidgetDef[] = [
  { id: "step-brands", name: "Step 1: Brands", category: "create-brand", component: <CreateBrandDemos.StepBrandsDemo />, description: "Brand name & domain inputs" },
  { id: "deposit-config", name: "Step 2: Deposit Config", category: "create-brand", component: <CreateBrandDemos.DepositConfigDemo />, description: "Deposit methods & bank details" },
  { id: "withdrawal-config", name: "Step 3: Withdrawal Config", category: "create-brand", component: <CreateBrandDemos.WithdrawalConfigDemo />, description: "Withdrawal methods" },
  { id: "step-kyc", name: "Step 4: KYC", category: "create-brand", component: <CreateBrandDemos.StepKycDemo />, description: "KYC settings" },
  { id: "step-terms", name: "Step 5: Terms", category: "create-brand", component: <CreateBrandDemos.StepTermsDemo />, description: "Privacy & terms" },
  { id: "step-email", name: "Step 6: Email", category: "create-brand", component: <CreateBrandDemos.StepEmailDemo />, description: "Email provider & templates" },
  { id: "step-voip", name: "Step 7: VoIP", category: "create-brand", component: <CreateBrandDemos.StepVoipDemo />, description: "VoIP provider" },
  { id: "step-whatsapp", name: "Step 8: WhatsApp", category: "create-brand", component: <CreateBrandDemos.StepWhatsAppDemo />, description: "WhatsApp Business connection" },
  { id: "step-upload-workers", name: "Step 9: Upload Workers", category: "create-brand", component: <CreateBrandDemos.StepUploadWorkersDemo />, description: "Worker upload" },
  { id: "step-upload-logo", name: "Step 10: Upload Logo", category: "create-brand", component: <CreateBrandDemos.StepUploadLogoDemo />, description: "Logo upload" },
  { id: "step-transform-voip", name: "Step 11: Transform VoIP", category: "create-brand", component: <CreateBrandDemos.StepTransformVoipDemo />, description: "VoIP & phone config" },
  { id: "step-transform-emails", name: "Step 11: Transform Emails", category: "create-brand", component: <CreateBrandDemos.StepTransformEmailsDemo />, description: "Email automation" },
  { id: "step-trader-platform", name: "Step 12: Trader Platform", category: "create-brand", component: <CreateBrandDemos.StepTraderPlatformDemo />, description: "CRM trading options" },
  { id: "step-trader-markets", name: "Step 14: Trader Markets", category: "create-brand", component: <CreateBrandDemos.StepTraderMarketsDemo />, description: "Market selection" },
  { id: "step-trading-fees", name: "Step 15: Trading Fees", category: "create-brand", component: <CreateBrandDemos.StepTradingFeesDemo />, description: "Open/close fees" },
  { id: "step-client-tas", name: "Step 16: Client TAS", category: "create-brand", component: <CreateBrandDemos.StepClientTasDemo />, description: "Multi TAS settings" },
  { id: "step-default-settings", name: "Step 17: Default Settings", category: "create-brand", component: <CreateBrandDemos.StepDefaultSettingsDemo />, description: "Timezone, language, currency" },
];

const MONITOR_WIDGETS: WidgetDef[] = [
  { id: "kpi-card", name: "KPI Card", category: "monitor", component: <MonitorDemos.KPICardDemo />, description: "Stats cards" },
  { id: "client-status-table", name: "Client Status Table", category: "monitor", component: <MonitorDemos.ClientStatusTableDemo />, description: "Client list" },
  { id: "system-health", name: "System Health", category: "monitor", component: <MonitorDemos.SystemHealthDemo />, description: "CPU, memory, network" },
  { id: "active-brands", name: "Active Brands", category: "monitor", component: <MonitorDemos.ActiveBrandsDemo />, description: "Brand status list" },
  { id: "quick-actions", name: "Quick Actions", category: "monitor", component: <MonitorDemos.QuickActionsDemo />, description: "Restart & shutdown" },
];

const SHARED_WIDGETS: WidgetDef[] = [
  { id: "check-card", name: "Check Card", category: "shared", component: <SharedDemos.CheckCardDemo />, description: "Checkbox card" },
  { id: "count-up", name: "CountUp", category: "shared", component: <SharedDemos.CountUpDemo />, description: "Animated counter" },
  { id: "provider-option-card", name: "Provider Option Card", category: "shared", component: <SharedDemos.ProviderOptionCardDemo />, description: "Provider selection" },
];

export const ALL_WIDGETS: WidgetDef[] = [...CREATE_BRAND_WIDGETS, ...MONITOR_WIDGETS, ...SHARED_WIDGETS];

export const WIDGETS_BY_CATEGORY = {
  "create-brand": CREATE_BRAND_WIDGETS,
  "monitor": MONITOR_WIDGETS,
  "shared": SHARED_WIDGETS,
} as const;

export const CATEGORY_INFO: Record<WidgetCategory, { label: string; icon: typeof FolderPlus }> = {
  "create-brand": { label: "Create Brand", icon: FolderPlus },
  "monitor": { label: "Monitor & Shut Down", icon: LayoutDashboard },
  "shared": { label: "Shared Components", icon: Component },
};
