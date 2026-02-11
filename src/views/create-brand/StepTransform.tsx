import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryInput } from "@/components/CountryInput";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isValidISOCountryCode, isValidPhoneCountryCode, isValidPhoneCodeFormat, normalizeCountryInputToISO } from "@/utils/countryCodes";

interface StepTransformProps {
  brandLabel: string;
  emailProvidersAllowed: Record<string, boolean>;
  onEmailProvidersAllowedChange: (v: Record<string, boolean>) => void;
  phoneExtensionsAllowed: boolean;
  onPhoneExtensionsAllowedChange: (v: boolean) => void;
  autoGenPasswordForLeads: boolean;
  onAutoGenPasswordForLeadsChange: (v: boolean) => void;
  autoRejectNoInteractivity: boolean;
  onAutoRejectNoInteractivityChange: (v: boolean) => void;
  blockedCountries: string[];
  onBlockedCountriesChange: (v: string[]) => void;
  newCountryCode: string;
  onNewCountryCodeChange: (v: string) => void;
  countryCodeError: string;
  onCountryCodeErrorChange: (v: string) => void;
  rejectedCodes: string[];
  onRejectedCodesChange: (v: string[]) => void;
  newPhoneCode: string;
  onNewPhoneCodeChange: (v: string) => void;
  phoneCodeError: string;
  onPhoneCodeErrorChange: (v: string) => void;
  blockedEmailProviders: string[];
  onBlockedEmailProvidersChange: (v: string[]) => void;
  newEmailProvider: string;
  onNewEmailProviderChange: (v: string) => void;
  autoGenPassword: boolean;
  onAutoGenPasswordChange: (v: boolean) => void;
  recoverLeads: boolean;
  onRecoverLeadsChange: (v: boolean) => void;
}

const addBlockedCountry = (
  code: string,
  blocked: string[],
  onAdd: (v: string[]) => void,
  onClear: () => void,
  onError: (v: string) => void
) => {
  const normalized = normalizeCountryInputToISO(code);
  if (normalized) {
    if (!blocked.includes(normalized)) onAdd([...blocked, normalized]);
    onClear();
    onError("");
  } else if (code.trim()) {
    onError("Invalid country. Use ISO code (US, GB) or common name (USA, UK)");
  } else onError("");
};

const addRejectedCode = (
  code: string,
  rejected: string[],
  onAdd: (v: string[]) => void,
  onClear: () => void,
  onFormatError: (v: string) => void,
  onExistError: (v: string) => void
) => {
  const c = code.trim();
  if (!c) return;
  if (!isValidPhoneCodeFormat(c)) {
    onFormatError("Invalid format. Use + followed by 1-4 digits (e.g., +1, +44, +880)");
    return;
  }
  if (!isValidPhoneCountryCode(c)) {
    onExistError("Phone country code not recognized. Use a valid dial code (e.g., +1, +44, +880)");
    return;
  }
  if (!rejected.includes(c)) onAdd([...rejected, c]);
  onClear();
  onFormatError("");
  onExistError("");
};

export const StepTransform = (props: StepTransformProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">TRANSFORM</h2>
    <p className="text-sm text-muted-foreground">{props.brandLabel}</p>

    <div className="space-y-4 rounded-lg border p-4 bg-card">
      <Label className="text-sm font-medium">Email providers allowed</Label>
      <div className="flex flex-wrap gap-3">
        {["maileroo", "alexders"].map((provider) => (
          <label key={provider} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={props.emailProvidersAllowed[provider] ?? false}
              onChange={(e) => props.onEmailProvidersAllowedChange({ ...props.emailProvidersAllowed, [provider]: e.target.checked })}
              className="rounded border-primary"
            />
            <span className="text-sm capitalize">{provider}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label>Phone extensions allowed</Label>
        <Switch checked={props.phoneExtensionsAllowed} onCheckedChange={props.onPhoneExtensionsAllowedChange} />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label>Auto gen password for leads with welcome email</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Generate password automatically when converting lead to client</p>
        </div>
        <Switch checked={props.autoGenPasswordForLeads} onCheckedChange={props.onAutoGenPasswordForLeadsChange} />
      </div>
      {props.autoGenPasswordForLeads && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
          <div>
            <Label>Auto reject for no interactivity</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Reject clients who don&apos;t interact after receiving welcome email</p>
          </div>
          <Switch checked={props.autoRejectNoInteractivity} onCheckedChange={props.onAutoRejectNoInteractivityChange} />
        </motion.div>
      )}
    </div>

    <div className="space-y-2">
      <Label>Reject clients from those countries:</Label>
      {props.blockedCountries.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 p-2 bg-secondary/50 rounded-lg">
          {props.blockedCountries.filter((c) => isValidISOCountryCode(c.toUpperCase().trim())).map((country) => {
            const n = country.toUpperCase().trim();
            return (
              <motion.span
                key={n}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
              >
                {n}
                <button onClick={() => props.onBlockedCountriesChange(props.blockedCountries.filter((c) => c.toUpperCase().trim() !== n))} className="hover:text-destructive/70 ml-1">×</button>
              </motion.span>
            );
          })}
        </motion.div>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <CountryInput
            value={props.newCountryCode}
            onChange={(v) => {
              props.onNewCountryCodeChange(v);
              if (v) {
                if (normalizeCountryInputToISO(v)) props.onCountryCodeErrorChange("");
                else props.onCountryCodeErrorChange("Invalid country. Use ISO code (US, GB) or common name (USA, UK, IND)");
              } else props.onCountryCodeErrorChange("");
            }}
            placeholder="Country (US, USA, IND, India, BD…)"
            className={props.countryCodeError ? "border-destructive" : ""}
            onKeyDown={(e) => {
              if (e.key === "Enter" && props.newCountryCode) {
                addBlockedCountry(props.newCountryCode, props.blockedCountries, props.onBlockedCountriesChange, () => props.onNewCountryCodeChange(""), props.onCountryCodeErrorChange);
              }
            }}
            onSelect={(code) => {
              addBlockedCountry(code, props.blockedCountries, props.onBlockedCountriesChange, () => props.onNewCountryCodeChange(""), props.onCountryCodeErrorChange);
            }}
          />
          {props.countryCodeError && <p className="text-xs text-destructive mt-1">{props.countryCodeError}</p>}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlockedCountry(props.newCountryCode, props.blockedCountries, props.onBlockedCountriesChange, () => props.onNewCountryCodeChange(""), props.onCountryCodeErrorChange)}
          disabled={!props.newCountryCode || !!props.countryCodeError || !normalizeCountryInputToISO(props.newCountryCode) || props.blockedCountries.includes(normalizeCountryInputToISO(props.newCountryCode)!)}
        >
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Add valid ISO country codes. Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">country_criteria</code> with <code className="text-xs bg-secondary px-1 py-0.5 rounded">blocked_countries</code>.</p>
    </div>

    <div className="space-y-2">
      <Label>Reject clients with these country codes:</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {props.rejectedCodes.filter((c) => isValidPhoneCodeFormat(c.trim()) && isValidPhoneCountryCode(c.trim())).map((code) => {
          const n = code.trim();
          return (
            <motion.span
              key={n}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
            >
              {n}
              <button onClick={() => props.onRejectedCodesChange(props.rejectedCodes.filter((c) => c.trim() !== n))} className="hover:text-destructive/70 ml-1">×</button>
            </motion.span>
          );
        })}
      </div>
      <div className="space-y-1">
        <div className="flex gap-2">
          <Input
            placeholder="+XX"
            value={props.newPhoneCode}
            onChange={(e) => {
              let v = e.target.value.trim();
              if (v && !v.startsWith("+")) v = /^\d/.test(v) ? "+" + v : v;
              if (v.startsWith("+")) {
                const digitsOnly = v.slice(1).replace(/\D/g, "").slice(0, 4);
                v = "+" + digitsOnly;
              }
              props.onNewPhoneCodeChange(v);
              if (v.length > 1) {
                if (!isValidPhoneCodeFormat(v)) props.onPhoneCodeErrorChange("Invalid format. Use + followed by 1-4 digits (e.g., +1, +44, +880)");
                else if (!isValidPhoneCountryCode(v)) props.onPhoneCodeErrorChange("Phone country code not recognized. Use a valid dial code (e.g., +1, +44, +880)");
                else props.onPhoneCodeErrorChange("");
              } else props.onPhoneCodeErrorChange("");
            }}
            className={`w-24 ${props.phoneCodeError ? "border-destructive" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && props.newPhoneCode && !props.phoneCodeError) {
                addRejectedCode(props.newPhoneCode, props.rejectedCodes, props.onRejectedCodesChange, () => props.onNewPhoneCodeChange(""), props.onPhoneCodeErrorChange, props.onPhoneCodeErrorChange);
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => addRejectedCode(props.newPhoneCode, props.rejectedCodes, props.onRejectedCodesChange, () => props.onNewPhoneCodeChange(""), props.onPhoneCodeErrorChange, props.onPhoneCodeErrorChange)}
            disabled={!props.newPhoneCode || !isValidPhoneCodeFormat(props.newPhoneCode.trim()) || !isValidPhoneCountryCode(props.newPhoneCode.trim()) || !!props.phoneCodeError || props.rejectedCodes.includes(props.newPhoneCode.trim())}
          >
            Add
          </Button>
        </div>
        {props.phoneCodeError && <p className="text-xs text-destructive">{props.phoneCodeError}</p>}
      </div>
      <p className="text-xs text-muted-foreground">Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">phone_country_match_criteria</code> or <code className="text-xs bg-secondary px-1 py-0.5 rounded">phone_format_criteria</code>.</p>
    </div>

    <div className="space-y-2">
      <Label>Reject clients with these email providers:</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {props.blockedEmailProviders.map((provider) => (
          <motion.span
            key={provider}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
          >
            {provider}
            <button onClick={() => props.onBlockedEmailProvidersChange(props.blockedEmailProviders.filter((p) => p !== provider))} className="hover:text-destructive/70 ml-1">×</button>
          </motion.span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="tempmail.com"
          value={props.newEmailProvider}
          onChange={(e) => props.onNewEmailProviderChange(e.target.value.toLowerCase().trim())}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.newEmailProvider && !props.blockedEmailProviders.includes(props.newEmailProvider)) {
              props.onBlockedEmailProvidersChange([...props.blockedEmailProviders, props.newEmailProvider]);
              props.onNewEmailProviderChange("");
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (props.newEmailProvider && !props.blockedEmailProviders.includes(props.newEmailProvider)) {
              props.onBlockedEmailProvidersChange([...props.blockedEmailProviders, props.newEmailProvider]);
              props.onNewEmailProviderChange("");
            }
          }}
        >
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Uses <code className="text-xs bg-secondary px-1 py-0.5 rounded">email_provider_criteria</code> with <code className="text-xs bg-secondary px-1 py-0.5 rounded">blocked_providers</code>.</p>
    </div>

    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Label>Auto gen password for leads</Label>
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-popover border rounded-lg shadow-lg text-xs text-muted-foreground z-50">
            If auto-gen is marked False, then interactivity is False and there is a mark of security concerns. Uses <code className="text-xs">generate_password_if_missing</code>.
          </div>
        </div>
      </div>
      <Switch checked={props.autoGenPassword} onCheckedChange={props.onAutoGenPasswordChange} />
    </div>

    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Label>Recover Leads & Export Reports</Label>
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-popover border rounded-lg shadow-lg text-xs text-muted-foreground z-50">
            Client → Lead if not logged in for 14 days. Uses <code className="text-xs">interactivity_check</code>.
          </div>
        </div>
      </div>
      <Switch checked={props.recoverLeads} onCheckedChange={props.onRecoverLeadsChange} />
    </div>
  </div>
);
