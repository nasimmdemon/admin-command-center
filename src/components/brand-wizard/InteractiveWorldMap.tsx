import { useRef, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, useMapContext } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { isValidISOCountryCode, COUNTRY_INPUT_ALIASES } from "@/utils/countryCodes";

// Using a reliable TopoJSON source for world countries
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveWorldMapProps {
  selectedCountries: string[]; // Array of ISO country codes (e.g., ["US", "CA", "GB"])
  onCountryToggle: (countryCode: string) => void;
  className?: string;
  /** "reject" = red (Transform), "select" = primary (VoIP) */
  variant?: "reject" | "select";
  /** VoIP coverage: origin -> [destinations]. When set with variant="select", shows blue origins, red destinations */
  coverageMap?: Record<string, string[]>;
  /** Multiple layers (brand, desk, worker) with distinct colors. When set, overrides coverageMap. */
  coverageLayers?: Array<{
    coverageMap: Record<string, string[]>;
    source: "brand" | "desk" | "worker";
    originColor: string;
    destColor: string;
  }>;
}

// Map of country names to ISO codes (common countries)
const countryNameToCode: Record<string, string> = {
  "United States": "US",
  "Canada": "CA",
  "United Kingdom": "GB",
  "Australia": "AU",
  "Germany": "DE",
  "France": "FR",
  "Italy": "IT",
  "Spain": "ES",
  "Netherlands": "NL",
  "Belgium": "BE",
  "Switzerland": "CH",
  "Austria": "AT",
  "Sweden": "SE",
  "Norway": "NO",
  "Denmark": "DK",
  "Finland": "FI",
  "Poland": "PL",
  "Czech Republic": "CZ",
  "Hungary": "HU",
  "Romania": "RO",
  "Greece": "GR",
  "Portugal": "PT",
  "Ireland": "IE",
  "Luxembourg": "LU",
  "Japan": "JP",
  "China": "CN",
  "India": "IN",
  "Brazil": "BR",
  "Mexico": "MX",
  "Argentina": "AR",
  "South Africa": "ZA",
  "Russia": "RU",
  "South Korea": "KR",
  "Singapore": "SG",
  "New Zealand": "NZ",
  "Israel": "IL",
  "Turkey": "TR",
  "Saudi Arabia": "SA",
  "United Arab Emirates": "AE",
  "Egypt": "EG",
  "Nigeria": "NG",
  "Kenya": "KE",
  "Thailand": "TH",
  "Vietnam": "VN",
  "Indonesia": "ID",
  "Malaysia": "MY",
  "Philippines": "PH",
};

// Reverse lookup: ISO code to country name
const codeToCountryName: Record<string, string> = Object.fromEntries(
  Object.entries(countryNameToCode).map(([name, code]) => [code, name])
);

/** Straight lines on the 2D map (front of map) instead of geodesic arcs */
const StraightConnectionLines = ({
  connections,
  stroke,
  strokeWidth,
  filterId,
  className,
}: {
  connections: { from: [number, number]; to: [number, number] }[];
  stroke: string;
  strokeWidth: number;
  filterId: string;
  className: string;
}) => {
  const { projection } = useMapContext();
  return (
    <g style={{ filter: `url(#${filterId})` }}>
      {connections.map((conn, i) => {
        const fromXY = projection(conn.from);
        const toXY = projection(conn.to);
        if (!fromXY || !toXY) return null;
        return (
          <line
            key={i}
            x1={fromXY[0]}
            y1={fromXY[1]}
            x2={toXY[0]}
            y2={toXY[1]}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill="none"
            className={className}
          />
        );
      })}
    </g>
  );
};

/** Wraps ZoomableGroup with translateExtent to keep map visible (can't hide completely) */
const ConstrainedZoomableGroup = ({ children }: { children: React.ReactNode }) => {
  const { width, height } = useMapContext();
  // Restrict panning so map stays visible - viewport bounded to central region
  const margin = 0.25;
  const translateExtent: [[number, number], [number, number]] = [
    [width * -margin, height * -margin],
    [width * (1 + margin), height * (1 + margin)],
  ];
  return (
    <ZoomableGroup
      center={[0, 0]}
      zoom={1}
      translateExtent={translateExtent}
      minZoom={0.5}
      maxZoom={6}
    >
      {children}
    </ZoomableGroup>
  );
};

/** Default: blue = origins, red = destinations */
const DEFAULT_ORIGIN_COLOR = "#3b82f6";
const DEFAULT_DEST_COLOR = "#ef4444";

const InteractiveWorldMap = ({ selectedCountries, onCountryToggle, className = "", variant = "reject", coverageMap, coverageLayers }: InteractiveWorldMapProps) => {
  const getCountryCode = (geo: any): string | null => {
    if (!geo || !geo.properties) return null;

    const props = geo.properties;

    // Try ISO_A2 first (most reliable)
    const iso2 = props.ISO_A2 || props.ISO_A2_EH || props.ISO2 || props.iso_a2 || props.ISO || props.iso;
    if (iso2 && typeof iso2 === "string" && iso2.length === 2 && iso2 !== "-1" && iso2 !== "N/A") {
      return iso2.toUpperCase().trim();
    }

    // World-atlas uses properties.name - look up in aliases (includes world-atlas name variants)
    const countryName = props.NAME || props.NAME_LONG || props.NAME_EN || props.name || props.NAME_SORT || props.NAME_ALT;
    if (countryName && typeof countryName === "string") {
      const alias = COUNTRY_INPUT_ALIASES[countryName.toUpperCase().trim()];
      if (alias) return alias;
      if (countryNameToCode[countryName]) return countryNameToCode[countryName];
    }

    return null;
  };

  const handleCountryClick = (geo: any) => {
    const countryCode = getCountryCode(geo);
    if (countryCode) {
      onCountryToggle(countryCode);
    }
  };

  const isCountrySelected = (geo: any) => {
    const countryCode = getCountryCode(geo);
    if (!countryCode) return false;
    
    // Normalize both the code from geo and selected countries for comparison
    const normalizedCode = countryCode.toUpperCase().trim();
    const isSelected = selectedCountries.some(selected => {
      const normalizedSelected = selected.toUpperCase().trim();
      return normalizedSelected === normalizedCode;
    });
    
    return isSelected;
  };

  const isReject = variant === "reject";
  const hasLayers = coverageLayers && coverageLayers.some((l) => Object.keys(l.coverageMap).length > 0);
  const useSingleCoverage = coverageMap && variant === "select" && Object.keys(coverageMap).length > 0 && !hasLayers;
  const useCoverageViz = (useSingleCoverage || hasLayers) && variant === "select";
  const fillSelected = isReject ? "#ef4444" : "hsl(var(--primary))";
  const strokeSelected = isReject ? "#dc2626" : "hsl(var(--primary))";
  const fillHover = isReject ? "#dc2626" : "hsl(var(--primary) / 0.8)";
  const strokeHover = isReject ? "#b91c1c" : "hsl(var(--primary))";
  const fillPressed = isReject ? "#b91c1c" : "hsl(var(--primary) / 0.9)";

  const getFillForCountry = (code: string | null): string => {
    if (!code || !useCoverageViz) return "#e5e7eb";
    const upper = code.toUpperCase();
    if (hasLayers && coverageLayers) {
      for (const layer of coverageLayers) {
        const origins = Object.keys(layer.coverageMap).filter((c) => isValidISOCountryCode(c));
        const dests = new Set<string>();
        origins.forEach((o) => (layer.coverageMap[o] || []).forEach((d) => dests.add(d)));
        if (origins.some((o) => o.toUpperCase() === upper)) return layer.originColor;
        if ([...dests].some((d) => d.toUpperCase() === upper)) return layer.destColor;
      }
      return "#e5e7eb";
    }
    if (coverageMap) {
      const origins = Object.keys(coverageMap).filter((c) => isValidISOCountryCode(c));
      const dests = new Set<string>();
      origins.forEach((o) => (coverageMap[o] || []).forEach((d) => dests.add(d)));
      if (origins.some((o) => o.toUpperCase() === upper)) return DEFAULT_ORIGIN_COLOR;
      if ([...dests].some((d) => d.toUpperCase() === upper)) return DEFAULT_DEST_COLOR;
    }
    return "#e5e7eb";
  };

  const getStrokeForCountry = (code: string | null): string => {
    if (!code) return "#9ca3af";
    if (!useCoverageViz) return "#9ca3af";
    const fill = getFillForCountry(code);
    if (fill === "#e5e7eb") return "#9ca3af";
    return fill;
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <style>{`
        @keyframes voip-glow-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes voip-glow-breathe {
          0%, 100% { opacity: 0.85; stroke-opacity: 0.9; }
          50% { opacity: 1; stroke-opacity: 1; }
        }
        .voip-connection-line { animation: voip-glow-breathe 1.8s ease-in-out infinite; }
        .voip-connection-dot { animation: voip-glow-pulse 1.5s ease-in-out infinite; }
      `}</style>
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 0],
        }}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", minHeight: "280px" }}
      >
        <defs>
          <filter id="voip-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
            <feFlood floodColor="#a855f7" floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ConstrainedZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              const centroidMap: Record<string, [number, number]> = {};
              geographies.forEach((geo) => {
                const code = getCountryCode(geo);
                if (code) {
                  try {
                    const c = geoCentroid(geo as GeoJSON.Feature);
                    centroidMap[code.toUpperCase()] = c;
                  } catch {
                    /* ignore */
                  }
                }
              });

              const connections: { from: [number, number]; to: [number, number] }[] = [];
              const dotCoords = new Set<string>();
              if (useCoverageViz) {
                const iter = hasLayers && coverageLayers
                  ? coverageLayers.flatMap((l) => Object.keys(l.coverageMap).map((orig) => ({ orig, dests: l.coverageMap[orig] || [] })))
                  : coverageMap ? Object.entries(coverageMap).map(([orig, dests]) => ({ orig, dests })) : [];
                for (const { orig, dests } of iter) {
                  const fromKey = orig.toUpperCase();
                  for (const dest of dests) {
                    const toKey = dest.toUpperCase();
                    if (centroidMap[fromKey] && centroidMap[toKey] && fromKey !== toKey) {
                      connections.push({ from: centroidMap[fromKey], to: centroidMap[toKey] });
                      dotCoords.add(`${centroidMap[fromKey][0]},${centroidMap[fromKey][1]}`);
                      dotCoords.add(`${centroidMap[toKey][0]},${centroidMap[toKey][1]}`);
                    }
                  }
                }
              }

              return (
                <>
                  {geographies.map((geo) => {
                    const code = getCountryCode(geo);
                    const isSelected = isCountrySelected(geo);
                    const fill = useCoverageViz ? getFillForCountry(code) : isSelected ? fillSelected : "#e5e7eb";
                    const stroke = useCoverageViz ? getStrokeForCountry(code) : isSelected ? strokeSelected : "#9ca3af";
                    const strokeW = isSelected || (useCoverageViz && (fill !== "#e5e7eb")) ? 1.5 : 0.5;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleCountryClick(geo)}
                        style={{
                          default: {
                            fill,
                            stroke,
                            strokeWidth: strokeW,
                            outline: "none",
                            cursor: "pointer",
                          },
                          hover: {
                            fill: fill === "#e5e7eb" ? "#d1d5db" : fill,
                            stroke: stroke === "#9ca3af" ? "#6b7280" : stroke,
                            strokeWidth: 1.5,
                            outline: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          },
                          pressed: {
                            fill: fill === "#e5e7eb" ? "#9ca3af" : fill,
                            stroke,
                            strokeWidth: 2,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })}
                  <StraightConnectionLines
                    connections={connections}
                    stroke="#a855f7"
                    strokeWidth={1}
                    filterId="voip-line-glow"
                    className="voip-connection-line"
                  />
                  {[...dotCoords].map((key, i) => {
                    const [lng, lat] = key.split(",").map(Number);
                    return (
                      <Marker key={`dot-${i}`} coordinates={[lng, lat]}>
                        <circle
                          r={2.5}
                          fill="#a855f7"
                          className="voip-connection-dot"
                          style={{ filter: "url(#voip-line-glow)" }}
                        />
                      </Marker>
                    );
                  })}
                </>
              );
            }}
          </Geographies>
        </ConstrainedZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default InteractiveWorldMap;
export { codeToCountryName };
