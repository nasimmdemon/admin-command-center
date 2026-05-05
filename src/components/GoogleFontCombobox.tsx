/**
 * GoogleFontCombobox
 * An autocomplete input that:
 *  - Filters the Google Fonts list as you type
 *  - Renders each suggestion in its own typeface (loaded on-demand)
 *  - Shows a live preview of the selected font in the input area
 *  - Lets you type any custom value too (not restricted to the list)
 */
import { useEffect, useId, useRef, useState } from "react";
import { GOOGLE_FONTS, injectGoogleFont } from "@/lib/google-fonts-list";
import { Check, ChevronDown, X, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleFontComboboxProps {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const MAX_SUGGESTIONS = 8;

/** Injects a Google Font and renders a small preview thumbnail in the suggestion list */
function FontOption({
  family,
  selected,
  onSelect,
}: {
  family: string;
  selected: boolean;
  onSelect: () => void;
}) {
  useEffect(() => {
    injectGoogleFont(family);
  }, [family]);

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // keep focus on input
        onSelect();
      }}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
        selected
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/60 text-foreground"
      )}
    >
      <div className="flex-1 min-w-0">
        {/* Font name in its own typeface */}
        <p
          className="text-sm font-medium truncate"
          style={{ fontFamily: `"${family}", sans-serif` }}
        >
          {family}
        </p>
        {/* Small ABC preview */}
        <p
          className="text-[11px] text-muted-foreground/70 truncate mt-0.5"
          style={{ fontFamily: `"${family}", sans-serif` }}
        >
          Aa Bb Cc 123
        </p>
      </div>
      {selected && <Check className="w-4 h-4 text-primary shrink-0" />}
    </button>
  );
}

export function GoogleFontCombobox({
  id,
  value,
  onChange,
  placeholder = "e.g. Inter",
  className,
}: GoogleFontComboboxProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep local query in sync if parent value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Inject the currently selected font for the input preview
  useEffect(() => {
    if (value) injectGoogleFont(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // If query doesn't match a Google Font exactly, allow it as a custom value
        if (query !== value) {
          onChange(query);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value, onChange]);

  const filtered = query.trim()
    ? GOOGLE_FONTS.filter((f) =>
        f.toLowerCase().includes(query.toLowerCase())
      ).slice(0, MAX_SUGGESTIONS)
    : GOOGLE_FONTS.slice(0, MAX_SUGGESTIONS);

  const handleSelect = (family: string) => {
    onChange(family);
    setQuery(family);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter") {
      // Select first match on Enter
      if (filtered.length > 0) {
        handleSelect(filtered[0]);
      } else {
        onChange(query);
        setOpen(false);
      }
    }
  };

  const isGoogleFont = GOOGLE_FONTS.includes(value);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div
        className={cn(
          "relative flex items-center rounded-xl border border-border/50 bg-background transition-all duration-200",
          open && "border-primary/50 ring-2 ring-primary/10"
        )}
      >
        {/* Live preview icon — changes to selected font */}
        <div className="pl-3 shrink-0">
          <Type
            className="w-4 h-4 text-muted-foreground"
            style={value ? { fontFamily: `"${value}", sans-serif` } : undefined}
          />
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "flex-1 h-10 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground/50",
            value && isGoogleFont && "font-medium"
          )}
          style={value && isGoogleFont ? { fontFamily: `"${value}", sans-serif` } : undefined}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            // Propagate as-you-type for custom (non-list) values
            if (!GOOGLE_FONTS.includes(e.target.value)) {
              onChange(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center pr-2 gap-0.5 shrink-0">
          {/* Google Fonts badge */}
          {value && isGoogleFont && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md mr-1">
              GF
            </span>
          )}
          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors"
              tabIndex={-1}
              aria-label="Clear font"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Chevron toggle */}
          <button
            type="button"
            onClick={() => {
              setOpen((o) => !o);
              inputRef.current?.focus();
            }}
            className="p-1 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors"
            tabIndex={-1}
            aria-label="Toggle font list"
          >
            <ChevronDown
              className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-border/50 bg-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{ maxHeight: "320px", overflowY: "auto" }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-border/30 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {query.trim() ? `${filtered.length} matching fonts` : "Popular Google Fonts"}
            </p>
            <a
              href="https://fonts.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-primary hover:underline"
              tabIndex={-1}
            >
              Browse all ↗
            </a>
          </div>

          {/* Font list */}
          <div className="p-1.5 space-y-0.5">
            {filtered.length > 0 ? (
              filtered.map((family) => (
                <FontOption
                  key={family}
                  family={family}
                  selected={value === family}
                  onSelect={() => handleSelect(family)}
                />
              ))
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-muted-foreground">No Google Font matches "{query}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  You can still use this as a custom font stack.
                </p>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(query);
                    setOpen(false);
                  }}
                  className="mt-2 text-xs font-semibold text-primary hover:underline"
                >
                  Use "{query}" anyway
                </button>
              </div>
            )}
          </div>

          {/* Footer hint */}
          {filtered.length > 0 && (
            <div className="px-3 py-2 border-t border-border/30 bg-muted/20">
              <p className="text-[10px] text-muted-foreground">
                ↵ select first · Esc close · Type any font name including custom stacks
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
