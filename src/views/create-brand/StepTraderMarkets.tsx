import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Minus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MARKET_SYMBOLS_MAP,
  MARKET_CATEGORY_LABELS,
} from "@shared_repo/SymbolEnums/market_symbols_map";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StepTraderMarketsProps {
  markets: Record<string, boolean>;
  onChange: (markets: Record<string, boolean>) => void;
}

const Checkbox = ({
  checked,
  indeterminate,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
}) => {
  const showCheck = checked;
  const showMinus = indeterminate && !checked;
  const isActive = showCheck || showMinus;
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors hover:border-muted-foreground/50 ${className} ${
        isActive ? "border-primary bg-primary/10" : "border-border bg-card"
      }`}
    >
      <div
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
          isActive ? "border-primary bg-primary" : "border-muted-foreground/30"
        }`}
      >
        {showCheck && <Check className="h-3 w-3 text-primary-foreground" />}
        {showMinus && <Minus className="h-3 w-3 text-primary-foreground" />}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
};

export const StepTraderMarkets = ({ markets, onChange }: StepTraderMarketsProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string, select: boolean) => {
    const symbols = MARKET_SYMBOLS_MAP[category];
    if (!symbols) return;
    const next = { ...markets };
    for (const s of symbols) next[s] = select;
    onChange(next);
  };

  const toggleSymbol = (symbol: string, checked: boolean) => {
    onChange({ ...markets, [symbol]: checked });
  };

  const isCategoryFullySelected = (category: string) => {
    const symbols = MARKET_SYMBOLS_MAP[category];
    if (!symbols?.length) return false;
    return symbols.every((s) => markets[s]);
  };

  const isCategoryPartiallySelected = (category: string) => {
    const symbols = MARKET_SYMBOLS_MAP[category];
    if (!symbols?.length) return false;
    const count = symbols.filter((s) => markets[s]).length;
    return count > 0 && count < symbols.length;
  };

  const toggleExpand = (category: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">TRADER MARKETS</h2>
      <p className="text-sm text-muted-foreground">
        Select a category to enable all symbols, then expand to deselect individual symbols.
      </p>
      <div className="space-y-2">
        {MARKET_CATEGORY_LABELS.map((category) => {
          const symbols = MARKET_SYMBOLS_MAP[category];
          if (!symbols?.length) return null;
          const isOpen = expanded.has(category);
          const allSelected = isCategoryFullySelected(category);
          const someSelected = isCategoryPartiallySelected(category);

          return (
            <Collapsible
              key={category}
              open={isOpen}
              onOpenChange={() => toggleExpand(category)}
            >
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 bg-muted/30 p-2">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded hover:bg-muted"
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <div className="flex-1 min-w-0">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(v) => toggleCategory(category, v)}
                      label={`${category} (${symbols.length} symbols)`}
                      className="border-0 bg-transparent p-0 hover:bg-transparent"
                    />
                  </div>
                  {someSelected && !allSelected && (
                    <span className="text-xs text-muted-foreground">
                      {symbols.filter((s) => markets[s]).length}/{symbols.length} selected
                    </span>
                  )}
                </div>
                <CollapsibleContent>
                  <ScrollArea className="h-[200px] border-t">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3">
                      {symbols.map((symbol) => (
                        <Checkbox
                          key={symbol}
                          checked={!!markets[symbol]}
                          onChange={(v) => toggleSymbol(symbol, v)}
                          label={symbol}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};
