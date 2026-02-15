import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { searchCountrySuggestions } from "@/utils/countryCodes";
import { cn } from "@/lib/utils";

interface CountryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** When provided, called on suggestion select - use to add immediately and clear */
  onSelect?: (isoCode: string) => void;
  /** Max suggestions to show */
  maxSuggestions?: number;
}

export const CountryInput = ({
  value,
  onChange,
  placeholder = "Country (US, USA, IND, India…)",
  className,
  onKeyDown,
  onSelect,
  maxSuggestions = 8,
}: CountryInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = value.trim() ? searchCountrySuggestions(value, maxSuggestions) : [];

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && value.trim().length >= 1);
    setHighlightIndex(-1);
  }, [value, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (alpha2: string) => {
    if (onSelect) {
      onSelect(alpha2);
      onChange("");
    } else {
      onChange(alpha2);
    }
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      onKeyDown?.(e);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex].alpha2);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    } else {
      onKeyDown?.(e);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 50))}
        onFocus={() => value.trim() && suggestions.length > 0 && setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(className)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.alpha2}
              type="button"
              role="option"
              aria-selected={i === highlightIndex}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                i === highlightIndex && "bg-accent text-accent-foreground"
              )}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => handleSelect(s.alpha2)}
            >
              <span className="font-mono text-xs text-muted-foreground w-8">{s.alpha2}</span>
              <span className="font-mono text-xs text-muted-foreground w-10">{s.alpha3}</span>
              <span className="flex-1 truncate">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
