import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryInput } from "@/components/CountryInput";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isValidISOCountryCode, isValidPhoneCountryCode, isValidPhoneCodeFormat, normalizeCountryInputToISO, getPhoneCodesFromOutboundCountries } from "@/utils/countryCodes";

interface StepTransformVoipProps {
  brandLabel: string;
  voipCoverageMap?: Record<string, string[]>;
  phoneExtensionsAllowed: boolean;
  onPhoneExtensionsAllowedChange: (v: boolean) => void;
  allowedExtensionPhones?: string[];
  newAllowedExtensionPhone?: string;
  onAllowedExtensionPhonesChange?: (v: string[]) => void;
  onNewAllowedExtensionPhoneChange?: (v: string) => void;
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

export const StepTransformVoip = (props: StepTransformVoipProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">VoIP & Phone</h2>
    <p className="text-sm text-muted-foreground">{props.brandLabel}</p>

    <div className="space-y-4 rounded-xl border border-border/50 p-4 bg-card shadow-widget">
      <Label className="text-sm font-medium">Phone extensions allowed</Label>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Allow clients to use phone extensions based on outbound countries.</p>
        <Switch checked={props.phoneExtensionsAllowed} onCheckedChange={props.onPhoneExtensionsAllowedChange} />
      </div>
      {props.phoneExtensionsAllowed && props.allowedExtensionPhones != null && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Allowed extension phones</Label>
            {props.voipCoverageMap && Object.keys(props.voipCoverageMap).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const codes = getPhoneCodesFromOutboundCountries(props.voipCoverageMap!);
                  if (codes.length > 0) {
                    const merged = [...new Set([...props.allowedExtensionPhones!, ...codes])].sort();
                    props.onAllowedExtensionPhonesChange?.(merged);
                  }
                }}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Sync from outbound
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Based on outbound countries from VoIP coverage. Origin countries are also outbound (in-country calls). E.g. brand in Russia calling only Russia → +7.</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {props.allowedExtensionPhones.map((ext) => (
              <motion.span
                key={ext}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
              >
                {ext}
                <button onClick={() => props.onAllowedExtensionPhonesChange?.(props.allowedExtensionPhones!.filter((e) => e !== ext))} className="hover:text-primary/70 ml-1">×</button>
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="+7, +1, +44…"
              value={props.newAllowedExtensionPhone ?? ""}
              onChange={(e) => props.onNewAllowedExtensionPhoneChange?.(e.target.value.trim())}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (props.newAllowedExtensionPhone ?? "").trim() && !(props.allowedExtensionPhones ?? []).includes((props.newAllowedExtensionPhone ?? "").trim())) {
                  props.onAllowedExtensionPhonesChange?.([...(props.allowedExtensionPhones ?? []), (props.newAllowedExtensionPhone ?? "").trim()]);
                  props.onNewAllowedExtensionPhoneChange?.("");
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const v = (props.newAllowedExtensionPhone ?? "").trim();
                if (v && !(props.allowedExtensionPhones ?? []).includes(v)) {
                  props.onAllowedExtensionPhonesChange?.([...(props.allowedExtensionPhones ?? []), v]);
                  props.onNewAllowedExtensionPhoneChange?.("");
                }
              }}
            >
              Add
            </Button>
          </div>
        </motion.div>
      )}
    </div>

    <div className="space-y-2">
      <Label>Reject clients from those countries:</Label>
      {props.blockedCountries.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 p-2 bg-muted/40 rounded-xl">
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
      <Label>Reject clients with these phone country codes:</Label>
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
  </div>
);
