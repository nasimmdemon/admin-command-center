import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, Info, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryInput } from "@/components/CountryInput";
import { Label } from "@/components/ui/label";
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

  const clearCoverage = () => {
    onCoverageMapChange({});
    onProvidersMapDataChange("");
    onCountriesChange("0");
    onPhoneNumbersChange("0");
    onAddOutboundFromChange("");
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
          <Link to="/providers?tab=voip" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
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
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">VoIP Coverage Map</Label>
            </div>
            <p className="text-xs text-muted-foreground">Click countries on the map to add/remove origins. Red = from, blue = to. Lines show connections.</p>
            <div className="rounded-lg border p-4 bg-secondary/30 min-h-[320px] max-h-[420px] overflow-hidden flex items-center justify-center">
              <div className="w-full h-full min-h-[280px] flex items-center justify-center">
              <InteractiveWorldMap
                variant="select"
                selectedCountries={Object.keys(coverageMap).filter((c) => isValidISOCountryCode(c))}
                onCountryToggle={handleCountryToggle}
                coverageMap={coverageMap}
                className="w-full h-full"
              />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 bg-card/50 space-y-3">
              <div>
                <Label className="text-sm font-medium text-foreground">From (origin)</Label>
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
                  placeholder="Search country…"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addOrigin()}
                  onSelect={(code) => code && addOriginCountry(code)}
                />
                <Button variant="outline" size="sm" onClick={addOrigin}>Add</Button>
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-card/50 space-y-3">
              <div>
                <Label className="text-sm font-medium text-foreground">To (destination)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Countries each origin can call to</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={addOutboundFrom || undefined} onValueChange={onAddOutboundFromChange}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {originCountries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-xs">→</span>
                <CountryInput
                  value={outboundCountryInput}
                  onChange={onOutboundCountryInputChange}
                  placeholder="Add destination…"
                  className="flex-1 min-w-[120px]"
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
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(coverageMap[addOutboundFrom] || []).map((country) => (
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
          <div className="flex items-center justify-between rounded-lg border p-3 bg-primary/5">
            <div className="flex gap-2 items-start">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Use the map to select origins. Then pick an origin and add destinations. Red = from, blue = to.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearCoverage} className="text-destructive hover:text-destructive">Clear all</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
