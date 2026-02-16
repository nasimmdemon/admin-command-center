import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ArrowLeft, CreditCard, Phone, Mail, FileText, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/models/routes";

type ProviderTab = "payments" | "voip" | "email" | "trader";

const Providers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as ProviderTab | null;
  const [activeTab, setActiveTab] = useState<ProviderTab>(tabParam && ["payments", "voip", "email", "trader"].includes(tabParam) ? tabParam : "payments");

  useEffect(() => {
    if (tabParam && ["payments", "voip", "email", "trader"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const tabs: { id: ProviderTab; label: string; icon: typeof CreditCard }[] = [
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "voip", label: "VoIP", icon: Phone },
    { id: "email", label: "Email", icon: Mail },
    { id: "trader", label: "Trader Platform", icon: BarChart3 },
  ];

  const paymentDocs = [
    { title: "Connecting external payment solutions to our CRM", content: "If the payment provider is not our built-in solution, you will need to integrate their API with our CRM. Document your provider's webhook URL, API keys, and required headers. Our CRM expects webhook payloads in a normalized format. Contact support for the integration spec." },
    { title: "Webhook format", content: "All payment webhooks must be POST requests with JSON payload. Required fields: transaction_id, amount, currency, status, provider_reference." },
    { title: "Testing", content: "Use the sandbox environment provided by your payment provider before going live. Our CRM supports both test and production modes." },
  ];

  const voipDocs = [
    { title: "VoIP providers (other / not ours)", content: "For VoIP providers that are not our built-in VoiceX solution, integration documentation is required. You will need to provide: API endpoint, authentication method, country coverage map (from country → to countries), and call pricing." },
    { title: "Country map format", content: "Coverage is defined as JSON: {\"FROM_COUNTRY\": [\"TO_COUNTRY1\", \"TO_COUNTRY2\"]}. Each origin must include itself for same-country calls (e.g. US → US)." },
    { title: "Required provider details", content: "Document: provider name, supported countries, phone number format (E.164), webhook URL for call events, and any rate limits." },
  ];

  const emailDocs = [
    { title: "Email provider integration", content: "Document your email provider's SMTP settings, API keys (if applicable), and sending domains. Our CRM supports both SMTP and transactional API integrations." },
    { title: "Required configuration", content: "From address, Reply-To, SPF/DKIM records for your domain, and rate limits. For providers like Maileroo or Alexders, ensure DNS records are correctly configured." },
    { title: "Template variables", content: "Supported variables: {{client_name}}, {{brand_name}}, {{reset_link}}, {{login_url}}. Templates are stored per brand in BLAPI/EmailsUsecases." },
  ];

  const traderDocs = [
    { title: "External trading platform integration", content: "For trading platforms other than our built-in MT5, you will need to integrate via our API. Document your platform's API endpoint, authentication (API key or OAuth), and supported instruments. Our CRM expects normalized order and position formats." },
    { title: "API requirements", content: "Required endpoints: account balance, open positions, order placement, order history. All requests must use HTTPS. Webhook URL for order/position updates is required for real-time sync." },
    { title: "WebTrader embedding", content: "If your platform provides a WebTrader or iframe embed, provide the embed URL and any required parameters. Our CRM supports custom iframe dimensions and postMessage for cross-origin communication." },
  ];

  const getDocs = () => {
    switch (activeTab) {
      case "payments": return paymentDocs;
      case "voip": return voipDocs;
      case "email": return emailDocs;
      case "trader": return traderDocs;
    }
  };

  return (
    <div className="min-h-screen bg-dotted p-4 md:p-8">
      <PageTransition className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(ROUTES.HOME)} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            Docs
          </motion.h1>
          <p className="text-muted-foreground mt-1">Documentation for connecting external providers to our CRM</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:border-muted-foreground/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
              <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                {activeTab === "payments" && (
                  <p>Payments: If not using our built-in solution, follow these docs to connect external payment providers to our CRM.</p>
                )}
                {activeTab === "voip" && (
                  <p>VoIP: For providers other than our built-in VoiceX, use these docs. Includes country map format and required provider details.</p>
                )}
                {activeTab === "email" && (
                  <p>Email: Documentation for connecting email providers (SMTP, transactional APIs) and template configuration.</p>
                )}
                {activeTab === "trader" && (
                  <p>Trader Platform: For external trading platforms, use these docs to integrate your WebTrader or API with our CRM.</p>
                )}
              </div>
            </div>

            {getDocs().map((doc, i) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === doc.title ? null : doc.title)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                >
                  <h3 className="font-semibold text-foreground">{doc.title}</h3>
                  {expandedSection === doc.title ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSection === doc.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t">
                        {doc.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </PageTransition>
    </div>
  );
};

export default Providers;
