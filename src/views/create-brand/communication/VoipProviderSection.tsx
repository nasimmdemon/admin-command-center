import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Globe, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryInput } from "@/components/CountryInput";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InteractiveWorldMap from "@/components/brand-wizard/InteractiveWorldMap";
import { ProviderOptionCard } from "./ProviderOptionCard";
import { isValidISOCountryCode, normalizeCountryInputToISO } from "@/utils/countryCodes";

interface VoipProviderSectionProps {
  provider: "voicex" | "other" | null;
  onProviderChange: (v: "voicex" | "other" | null) => void;
  phoneNumbers: string;
  onPhoneNumbersChange: (v: string) => void;
  countries: string;
  onCountriesChange: (v: string) => void;
  coverageMap: Record<string, string[]>;
  onCoverageMapChange: (m: Record<string, string[]>) => void;
  originCountryInput: string;
  onOriginCountryInputChange: (v: string) => void;
  addOutboundFrom: string;
  onAddOutboundFromChange: (v: string) => void;
  outboundCountryInput: string;
  onOutboundCountryInputChange: (v: string) => void;
  providersMapData: string;
  onProvidersMapDataChange: (v: string) => void;
}

export const VoipProviderSection = ({
  provider,
  onProviderChange,
  phoneNumbers,
  onPhoneNumbersChange,
  countries,
  onCountriesChange,
  coverageMap,
  onCoverageMapChange,
  originCountryInput,
  onOriginCountryInputChange,
  addOutboundFrom,
  onAddOutboundFromChange,
  outboundCountryInput,
  onOutboundCountryInputChange,
  providersMapData,
  onProvidersMapDataChange,
}: VoipProviderSectionProps) => {
  const originCountries = Object.keys(coverageMap);

  const addOriginCountry = (code: string) => {
    if (!coverageMap[code]) {
      const next = { ...coverageMap, [code]: [code] };
      onCoverageMapChange(next);
      onProvidersMapDataChange(JSON.stringify(next, null, 2));
    }
  };

  const handleCountryToggle = (countryCode: string) => {
    const code = countryCode.toUpperCase().trim();
    if (!isValidISOCountryCode(code)) return;
    if (coverageMap[code]) removeOrigin(code);
    else addOriginCountry(code);
  };

  const addOrigin = () => {
    const code = originCountryInput ? normalizeCountryInputToISO(originCountryInput) : null;
    if (code && !coverageMap[code]) {
      const next = { ...coverageMap, [code]: [code] };
      onCoverageMapChange(next);
      onProvidersMapDataChange(JSON.stringify(next, null, 2));
      onOriginCountryInputChange("");
    }
  };

  const addOutbound = () => {
    const code = outboundCountryInput ? normalizeCountryInputToISO(outboundCountryInput) : null;
    const from = addOutboundFrom;
    if (code && from && coverageMap[from]) {
      const current = coverageMap[from] || [from];
      if (!current.includes(code)) {
        const next = { ...coverageMap, [from]: [...current, code] };
        onCoverageMapChange(next);
        onProvidersMapDataChange(JSON.stringify(next, null, 2));
        onOutboundCountryInputChange("");
      }
    }
  };

  const removeOrigin = (code: string) => {
    const next = { ...coverageMap };
    delete next[code];
    onCoverageMapChange(next);
    onProvidersMapDataChange(JSON.stringify(next, null, 2));
    if (addOutboundFrom === code) onAddOutboundFromChange("");
  };

  const removeOutboundFromOrigin = (fromCode: string, toCode: string) => {
    const next = { ...coverageMap };
    const arr = (next[fromCode] || []).filter((c) => c !== toCode);
    if (arr.length === 0) delete next[fromCode];
    else next[fromCode] = arr;
    onCoverageMapChange(next);
    onProvidersMapDataChange(JSON.stringify(next, null, 2));
  };

  const applyProvidersMap = () => {
    try {
      const parsed = JSON.parse(providersMapData || "{}");
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        const isValid = Object.values(parsed).every(
          (val) => Array.isArray(val) && (val as unknown[]).every((item) => typeof item === "string")
        );
        if (isValid) {
          const normalized: Record<string, string[]> = {};
          for (const [from, toList] of Object.entries(parsed)) {
            const arr = toList as string[];
            const fromISO = normalizeCountryInputToISO(from) || from.toUpperCase().trim();
            const toISO = [...new Set([fromISO, ...arr.map((c) => normalizeCountryInputToISO((c as string).trim()) || (c as string).toUpperCase())])];
            normalized[fromISO] = toISO;
          }
          onCoverageMapChange(normalized);
          onProvidersMapDataChange(JSON.stringify(normalized, null, 2));
          const uniqueCountries = new Set([...Object.keys(normalized), ...Object.values(normalized).flat()]);
          onCountriesChange(uniqueCountries.size.toString());
          onPhoneNumbersChange(Math.max(uniqueCountries.size * 2, 10).toString());
        } else {
          alert("Invalid format: All values must be arrays of country codes (strings)");
        }
      } else {
        alert("Invalid format: Expected an object with country codes as keys");
      }
    } catch (e) {
      alert(`Invalid JSON format: ${e instanceof Error ? e.message : "Please check your input"}`);
    }
  };

  const clearCoverage = () => {
    onCoverageMapChange({});
    onProvidersMapDataChange("");
    onCountriesChange("0");
    onPhoneNumbersChange("0");
  };

  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground text-xs uppercase tracking-wide">VoIP Provider</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ProviderOptionCard
          label="VoiceX"
          sublabel="VoIP communication service"
          selected={provider === "voicex"}
          onClick={() => onProviderChange(provider === "voicex" ? null : "voicex")}
        />
        <ProviderOptionCard
          label="Other (external)"
          sublabel="Connect your own provider"
          selected={provider === "other"}
          onClick={() => onProviderChange(provider === "other" ? null : "other")}
        />
      </div>
      {provider === "other" && (
        <div className="rounded-lg border border-dashed p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground mb-2">VoIP provider is not ours — use our docs to connect external provider.</p>
          <Link to="/providers?tab=voip" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
            <ExternalLink className="w-4 h-4" />
            View provider docs (VoIP)
          </Link>
        </div>
      )}
      {provider === "voicex" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Phone Numbers</p>
              <Input type="number" value={phoneNumbers} onChange={(e) => onPhoneNumbersChange(e.target.value)} className="h-8 text-lg font-semibold" min="0" />
            </div>
            <div className="rounded-lg border p-3 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Countries</p>
              <Input type="number" value={countries} onChange={(e) => onCountriesChange(e.target.value)} className="h-8 text-lg font-semibold" min="0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">VoIP Coverage (select origin countries)</Label>
            <p className="text-xs text-muted-foreground">Click countries on the map to toggle. Selected countries are highlighted.</p>
            <div className="rounded-lg border p-4 bg-secondary/30 min-h-[280px] max-h-[400px] overflow-hidden">
              <InteractiveWorldMap
                variant="select"
                selectedCountries={Object.keys(coverageMap).filter((c) => isValidISOCountryCode(c))}
                onCountryToggle={handleCountryToggle}
                coverageMap={coverageMap}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-4 rounded-lg border p-4 bg-card/50">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-foreground">Origin Countries</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Where calls can originate</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {originCountries.map((country) => (
                  <motion.span
                    key={country}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
                  >
                    {country}
                    <button onClick={() => removeOrigin(country)} className="hover:text-destructive/70 ml-1">×</button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2">
                <CountryInput
                  value={originCountryInput}
                  onChange={onOriginCountryInputChange}
                  placeholder="Search country (US, Bangladesh…)"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addOrigin()}
                  onSelect={(code) => code && addOriginCountry(code)}
                />
                <Button variant="outline" size="sm" onClick={addOrigin}>Add</Button>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t">
              <div>
                <Label className="text-sm font-medium text-foreground">Add outbound to origin</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Select an origin country, then add destination countries it can call to</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={addOutboundFrom || undefined} onValueChange={onAddOutboundFromChange}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {originCountries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CountryInput
                  value={outboundCountryInput}
                  onChange={onOutboundCountryInputChange}
                  placeholder="Add destination (US, CA…)"
                  className="flex-1 min-w-[160px]"
                  onKeyDown={(e) => e.key === "Enter" && addOutbound()}
                  onSelect={(code) => {
                    if (code && addOutboundFrom) {
                      const current = coverageMap[addOutboundFrom] || [addOutboundFrom];
                      if (!current.includes(code)) {
                        const next = { ...coverageMap, [addOutboundFrom]: [...current, code] };
                        onCoverageMapChange(next);
                        onProvidersMapDataChange(JSON.stringify(next, null, 2));
                        onOutboundCountryInputChange("");
                      }
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={addOutbound} disabled={!addOutboundFrom}>Add</Button>
              </div>
              {addOutboundFrom && coverageMap[addOutboundFrom] && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(coverageMap[addOutboundFrom] || []).filter((c) => c !== addOutboundFrom).map((country) => (
                    <motion.span
                      key={country}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                    >
                      {country}
                      <button onClick={() => removeOutboundFromOrigin(addOutboundFrom, country)} className="hover:text-primary/70 ml-0.5">×</button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Calling Coverage Map</Label>
                <p className="text-xs text-muted-foreground">From Country → To Countries (includes same country for quick calls)</p>
              </div>
              <span className="text-xs text-muted-foreground">{Object.keys(coverageMap).length} origin countries</span>
            </div>
            <div className="rounded-lg border p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 min-h-[280px]">
              <div className="relative z-10 space-y-3">
                {Object.entries(coverageMap).length > 0 ? (
                  Object.entries(coverageMap).map(([fromCountry, toCountries], idx) => (
                    <motion.div
                      key={fromCountry}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="rounded-lg border bg-card/80 backdrop-blur-sm p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{fromCountry}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground mb-1.5">
                            Can call to {toCountries.length} {toCountries.length === 1 ? "country" : "countries"}:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {toCountries.map((country) => (
                              <span key={country} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success border border-success/20">
                                {country}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No coverage data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Providers Map</Label>
                <p className="text-xs text-muted-foreground">Input coverage data in JSON format: {"{"}"FROM_COUNTRY_CODE": ["TO_COUNTRY_CODE1", "TO_COUNTRY_CODE2"]{"}"}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onProvidersMapDataChange(JSON.stringify(coverageMap, null, 2))} className="text-xs">Load Current</Button>
            </div>
            <div className="relative">
              <Textarea
                placeholder={`{\n  "US": ["US", "CA", "MX", "GB"],\n  "GB": ["GB", "US", "FR", "DE"]\n}`}
                value={providersMapData || JSON.stringify(coverageMap, null, 2)}
                onChange={(e) => onProvidersMapDataChange(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={applyProvidersMap} className="flex-1">Apply & Update Coverage</Button>
              <Button variant="ghost" size="sm" onClick={clearCoverage}>Clear</Button>
            </div>
            <div className="rounded-lg border p-2 bg-primary/5">
              <p className="text-xs text-muted-foreground">
                <strong>Format:</strong> Country codes (ISO 2-letter) as keys, arrays of destination country codes as values.
                Example: {"{"}"US": ["US", "CA", "MX"]{"}"} = calls from US to US, Canada, Mexico.
              </p>
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-primary/5 flex gap-2 items-start">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Origin countries: where calls originate. Add outbound: select an origin, then add destinations (e.g. US → CA, MX). Type USA or US for United States; UK or GB for United Kingdom.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
