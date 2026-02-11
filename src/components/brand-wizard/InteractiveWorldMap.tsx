import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion } from "framer-motion";

// Using a reliable TopoJSON source for world countries
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveWorldMapProps {
  selectedCountries: string[]; // Array of ISO country codes (e.g., ["US", "CA", "GB"])
  onCountryToggle: (countryCode: string) => void;
  className?: string;
  /** "reject" = red (Transform), "select" = primary (VoIP) */
  variant?: "reject" | "select";
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

const InteractiveWorldMap = ({ selectedCountries, onCountryToggle, className = "", variant = "reject" }: InteractiveWorldMapProps) => {
  const getCountryCode = (geo: any): string | null => {
    if (!geo || !geo.properties) return null;
    
    const props = geo.properties;
    
    // Try ISO_A2 first (most reliable) - check multiple possible property names
    // The world-atlas TopoJSON uses ISO_A2 or ISO_A2_EH
    const iso2 = props.ISO_A2 || props.ISO_A2_EH || props.ISO2 || props.iso_a2 || props.ISO || props.iso;
    if (iso2 && typeof iso2 === 'string' && iso2.length === 2) {
      return iso2.toUpperCase().trim();
    }
    
    // Try country name mapping as fallback
    const countryName = props.NAME || props.NAME_LONG || props.NAME_EN || props.name || props.NAME_SORT || props.NAME_ALT;
    if (countryName && typeof countryName === 'string' && countryNameToCode[countryName]) {
      return countryNameToCode[countryName];
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
  const fillSelected = isReject ? "#ef4444" : "hsl(var(--primary))";
  const strokeSelected = isReject ? "#dc2626" : "hsl(var(--primary))";
  const fillHover = isReject ? "#dc2626" : "hsl(var(--primary) / 0.8)";
  const strokeHover = isReject ? "#b91c1c" : "hsl(var(--primary))";
  const fillPressed = isReject ? "#b91c1c" : "hsl(var(--primary) / 0.9)";

  return (
    <div className={`w-full ${className}`}>
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20],
        }}
        className="w-full h-full"
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = isCountrySelected(geo);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? fillSelected : "#e5e7eb",
                        stroke: isSelected ? strokeSelected : "#9ca3af",
                        strokeWidth: isSelected ? 1.5 : 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: isSelected ? fillHover : "#d1d5db",
                        stroke: isSelected ? strokeHover : "#6b7280",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      },
                      pressed: {
                        fill: isSelected ? fillPressed : "#9ca3af",
                        stroke: isSelected ? strokeSelected : "#991b1b",
                        strokeWidth: 2,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default InteractiveWorldMap;
export { codeToCountryName };
