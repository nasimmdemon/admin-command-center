import { useState, useCallback } from "react";
import * as clientsService from "@/api/services/clients.service";
import * as brandsService from "@/api/services/brands.service";
import * as depositsService from "@/api/services/deposits.service";
import * as adminStatsService from "@/api/services/admin-stats.service";
import { getAdminApiBaseUrl } from "@/api/contract/env";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultState = {
  loading: boolean;
  ok: boolean | null;
  status: number | null;
  data: unknown;
};

const INITIAL: ResultState = { loading: false, ok: null, status: null, data: null };

// ─── Small UI atoms ──────────────────────────────────────────────────────────

function StatusBadge({ ok, status }: { ok: boolean | null; status: number | null }) {
  if (ok === null) return null;
  const color = ok ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                   : "bg-red-500/20 text-red-300 border border-red-500/40";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-semibold ${color}`}>
      {ok ? "✓" : "✗"} {status}
    </span>
  );
}

function ResultPanel({ result }: { result: ResultState }) {
  if (result.loading) {
    return (
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
        <span className="animate-spin text-base">⟳</span> Calling backend…
      </div>
    );
  }
  if (result.ok === null) return null;
  return (
    <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 p-3">
      <div className="mb-2 flex items-center gap-2">
        <StatusBadge ok={result.ok} status={result.status} />
      </div>
      <pre className="max-h-56 overflow-auto text-xs text-slate-300 whitespace-pre-wrap break-all">
        {JSON.stringify(result.data, null, 2)}
      </pre>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-lg font-semibold tracking-tight text-white flex items-center gap-2">
      {children}
    </h2>
  );
}

function TestBtn({
  label,
  method,
  onClick,
  disabled,
}: {
  label: string;
  method: "GET" | "POST";
  onClick: () => void;
  disabled?: boolean;
}) {
  const methodColor = method === "GET"
    ? "bg-sky-600 hover:bg-sky-500"
    : "bg-violet-600 hover:bg-violet-500";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-40 ${methodColor}`}
    >
      <span className="rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">
        {method}
      </span>
      {label}
    </button>
  );
}

function LabeledInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-400">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 w-full"
      />
    </div>
  );
}

function Card({ children, title, accent }: { children: React.ReactNode; title: string; accent: string }) {
  return (
    <div className={`rounded-xl border ${accent} bg-slate-800/50 backdrop-blur-sm p-5 flex flex-col gap-4`}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

// ─── Endpoint row ─────────────────────────────────────────────────────────────

function EndpointRow({
  label,
  method,
  path,
  children,
  result,
}: {
  label: string;
  method: "GET" | "POST";
  path: string;
  children: React.ReactNode;
  result: ResultState;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white text-sm">{label}</p>
          <p className="mt-0.5 font-mono text-xs text-slate-400">{method} {path}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
      <ResultPanel result={result} />
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useResult() {
  const [result, setResult] = useState<ResultState>(INITIAL);

  const run = useCallback(async (fn: () => Promise<{ ok: boolean; status: number; data: unknown }>) => {
    setResult({ loading: true, ok: null, status: null, data: null });
    try {
      const r = await fn();
      setResult({ loading: false, ok: r.ok, status: r.status, data: r.data });
    } catch (e) {
      setResult({ loading: false, ok: false, status: 0, data: String(e) });
    }
  }, []);

  return { result, run };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiTest() {
  const baseUrl = getAdminApiBaseUrl();

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useResult();

  // ── Clients ────────────────────────────────────────────────────────────────
  const clientCreate = useResult();
  const [clientName, setClientName] = useState("Test Client");
  const [clientCode, setClientCode] = useState("TC001");

  const clientList = useResult();

  const clientGet = useResult();
  const [clientGetId, setClientGetId] = useState("");

  const clientUpdate = useResult();
  const [clientUpdateId, setClientUpdateId] = useState("");
  const [clientUpdateName, setClientUpdateName] = useState("Renamed Client");

  // ── Brands ─────────────────────────────────────────────────────────────────
  const brandCreate = useResult();
  const [brandClientId, setBrandClientId] = useState("");
  const [brandName, setBrandName] = useState("Test Brand");
  const [brandDomain, setBrandDomain] = useState("testbrand.com");

  const brandList = useResult();
  const [brandListClientId, setBrandListClientId] = useState("");

  const brandGet = useResult();
  const [brandGetId, setBrandGetId] = useState("");

  const brandUpdate = useResult();
  const [brandUpdateId, setBrandUpdateId] = useState("");
  const [brandUpdateName, setBrandUpdateName] = useState("Renamed Brand");

  // ── Deposits ───────────────────────────────────────────────────────────────
  const depositCreate = useResult();
  const [depositClientId, setDepositClientId] = useState("");
  const [depositAmount, setDepositAmount] = useState("100");
  const [depositCurrency, setDepositCurrency] = useState("USD");

  const depositList = useResult();
  const [depositListClientId, setDepositListClientId] = useState("");

  const depositGet = useResult();
  const [depositGetId, setDepositGetId] = useState("");

  const depositUpdate = useResult();
  const [depositUpdateId, setDepositUpdateId] = useState("");
  const [depositUpdateAmount, setDepositUpdateAmount] = useState("999");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            🔌 API Test Panel
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Interactive endpoint tester for the admin backend.{" "}
            <span className="font-mono text-slate-300">{baseUrl}</span>
          </p>
          <div className="mt-3 flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-sky-500 inline-block" />
              GET
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-violet-500 inline-block" />
              POST
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">

          {/* ── STATS ──────────────────────────────────────────────────────── */}
          <Card title="📊 Stats" accent="border-slate-600">
            <EndpointRow
              label="Fetch summary KPIs"
              method="GET"
              path="/admin/stats/summary"
              result={stats.result}
            >
              <TestBtn
                id="btn-stats-summary"
                label="Get Summary"
                method="GET"
                disabled={stats.result.loading}
                onClick={() => stats.run(() => adminStatsService.fetchAdminStatsSummary())}
              />
            </EndpointRow>
          </Card>

          {/* ── CLIENTS ────────────────────────────────────────────────────── */}
          <Card title="👤 Clients" accent="border-sky-800/50">
            {/* Create */}
            <EndpointRow label="Create client" method="POST" path="/admin/clients/create" result={clientCreate.result}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LabeledInput id="client-name" label="name *" value={clientName} onChange={setClientName} placeholder="Acme Corp" />
                <LabeledInput id="client-code" label="client_code" value={clientCode} onChange={setClientCode} placeholder="ACME01" />
              </div>
              <TestBtn id="btn-client-create" label="Create" method="POST" disabled={clientCreate.result.loading || !clientName.trim()}
                onClick={() => clientCreate.run(() => clientsService.createClient({ name: clientName.trim(), client_code: clientCode.trim() || undefined }))} />
            </EndpointRow>

            {/* List */}
            <EndpointRow label="List all clients" method="GET" path="/admin/clients/list" result={clientList.result}>
              <TestBtn id="btn-client-list" label="List Clients" method="GET" disabled={clientList.result.loading}
                onClick={() => clientList.run(() => clientsService.listClients())} />
            </EndpointRow>

            {/* Get by ID */}
            <EndpointRow label="Get client by ID" method="GET" path="/admin/clients/get/{id}" result={clientGet.result}>
              <LabeledInput id="client-get-id" label="document_id *" value={clientGetId} onChange={setClientGetId} placeholder="6623abc..." />
              <TestBtn id="btn-client-get" label="Get Client" method="GET" disabled={clientGet.result.loading || !clientGetId.trim()}
                onClick={() => clientGet.run(() => clientsService.getClient(clientGetId.trim()))} />
            </EndpointRow>

            {/* Update */}
            <EndpointRow label="Update client" method="POST" path="/admin/clients/update" result={clientUpdate.result}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LabeledInput id="client-update-id" label="document_id *" value={clientUpdateId} onChange={setClientUpdateId} placeholder="6623abc..." />
                <LabeledInput id="client-update-name" label="name" value={clientUpdateName} onChange={setClientUpdateName} placeholder="New Name" />
              </div>
              <TestBtn id="btn-client-update" label="Update" method="POST" disabled={clientUpdate.result.loading || !clientUpdateId.trim()}
                onClick={() => clientUpdate.run(() => clientsService.updateClient(clientUpdateId.trim(), { name: clientUpdateName.trim() || undefined }))} />
            </EndpointRow>
          </Card>

          {/* ── BRANDS ─────────────────────────────────────────────────────── */}
          <Card title="🏷️ Brands" accent="border-violet-800/50">
            {/* Create */}
            <EndpointRow label="Create brand" method="POST" path="/admin/brands/create" result={brandCreate.result}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LabeledInput id="brand-client-id" label="client_id *" value={brandClientId} onChange={setBrandClientId} placeholder="6623abc..." />
                <LabeledInput id="brand-name" label="name *" value={brandName} onChange={setBrandName} placeholder="My Brand" />
                <LabeledInput id="brand-domain" label="domain" value={brandDomain} onChange={setBrandDomain} placeholder="mybrand.com" />
              </div>
              <TestBtn id="btn-brand-create" label="Create" method="POST" disabled={brandCreate.result.loading || !brandClientId.trim() || !brandName.trim()}
                onClick={() => brandCreate.run(() => brandsService.createBrand({ client_id: brandClientId.trim(), name: brandName.trim(), domain: brandDomain.trim() || undefined }))} />
            </EndpointRow>

            {/* List */}
            <EndpointRow label="List brands" method="GET" path="/admin/brands/list" result={brandList.result}>
              <LabeledInput id="brand-list-client-id" label="client_id (filter, optional)" value={brandListClientId} onChange={setBrandListClientId} placeholder="Leave empty to list all" />
              <TestBtn id="btn-brand-list" label="List Brands" method="GET" disabled={brandList.result.loading}
                onClick={() => brandList.run(() => brandsService.listBrands(brandListClientId.trim() || undefined))} />
            </EndpointRow>

            {/* Get */}
            <EndpointRow label="Get brand by ID" method="GET" path="/admin/brands/get/{id}" result={brandGet.result}>
              <LabeledInput id="brand-get-id" label="document_id *" value={brandGetId} onChange={setBrandGetId} placeholder="6623abc..." />
              <TestBtn id="btn-brand-get" label="Get Brand" method="GET" disabled={brandGet.result.loading || !brandGetId.trim()}
                onClick={() => brandGet.run(() => brandsService.getBrand(brandGetId.trim()))} />
            </EndpointRow>

            {/* Update */}
            <EndpointRow label="Update brand" method="POST" path="/admin/brands/update" result={brandUpdate.result}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LabeledInput id="brand-update-id" label="document_id *" value={brandUpdateId} onChange={setBrandUpdateId} placeholder="6623abc..." />
                <LabeledInput id="brand-update-name" label="name" value={brandUpdateName} onChange={setBrandUpdateName} placeholder="New Brand Name" />
              </div>
              <TestBtn id="btn-brand-update" label="Update" method="POST" disabled={brandUpdate.result.loading || !brandUpdateId.trim()}
                onClick={() => brandUpdate.run(() => brandsService.updateBrand(brandUpdateId.trim(), { name: brandUpdateName.trim() || undefined }))} />
            </EndpointRow>
          </Card>

          {/* ── DEPOSITS ───────────────────────────────────────────────────── */}
          <Card title="💰 Deposits" accent="border-emerald-800/50">
            {/* Create */}
            <EndpointRow label="Create deposit" method="POST" path="/admin/deposits/create" result={depositCreate.result}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LabeledInput id="deposit-client-id" label="client_id *" value={depositClientId} onChange={setDepositClientId} placeholder="6623abc..." />
                <LabeledInput id="deposit-amount" label="amount" value={depositAmount} onChange={setDepositAmount} placeholder="100" />
                <LabeledInput id="deposit-currency" label="currency" value={depositCurrency} onChange={setDepositCurrency} placeholder="USD" />
              </div>
              <TestBtn id="btn-deposit-create" label="Create" method="POST" disabled={depositCreate.result.loading || !depositClientId.trim()}
                onClick={() => depositCreate.run(() => depositsService.createDeposit({ client_id: depositClientId.trim(), amount: Number(depositAmount) || undefined, currency: depositCurrency.trim() || undefined }))} />
            </EndpointRow>

            {/* List */}
            <EndpointRow label="List deposits" method="GET" path="/admin/deposits/list" result={depositList.result}>
              <LabeledInput id="deposit-list-client-id" label="client_id (filter, optional)" value={depositListClientId} onChange={setDepositListClientId} placeholder="Leave empty to list all" />
              <TestBtn id="btn-deposit-list" label="List Deposits" method="GET" disabled={depositList.result.loading}
                onClick={() => depositList.run(() => depositsService.listDeposits(depositListClientId.trim() || undefined))} />
            </EndpointRow>

            {/* Get */}
            <EndpointRow label="Get deposit by ID" method="GET" path="/admin/deposits/get/{id}" result={depositGet.result}>
              <LabeledInput id="deposit-get-id" label="document_id *" value={depositGetId} onChange={setDepositGetId} placeholder="6623abc..." />
              <TestBtn id="btn-deposit-get" label="Get Deposit" method="GET" disabled={depositGet.result.loading || !depositGetId.trim()}
                onClick={() => depositGet.run(() => depositsService.getDeposit(depositGetId.trim()))} />
            </EndpointRow>

            {/* Update */}
            <EndpointRow label="Update deposit" method="POST" path="/admin/deposits/update" result={depositUpdate.result}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LabeledInput id="deposit-update-id" label="document_id *" value={depositUpdateId} onChange={setDepositUpdateId} placeholder="6623abc..." />
                <LabeledInput id="deposit-update-amount" label="amount" value={depositUpdateAmount} onChange={setDepositUpdateAmount} placeholder="999" />
              </div>
              <TestBtn id="btn-deposit-update" label="Update" method="POST" disabled={depositUpdate.result.loading || !depositUpdateId.trim()}
                onClick={() => depositUpdate.run(() => depositsService.updateDeposit(depositUpdateId.trim(), { amount: Number(depositUpdateAmount) || undefined }))} />
            </EndpointRow>
          </Card>

        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          All requests go to <span className="font-mono text-slate-500">{baseUrl}</span> — configure via <span className="font-mono">VITE_ADMIN_API_BASE_URL</span> in .env.local
        </p>
      </div>
    </div>
  );
}
