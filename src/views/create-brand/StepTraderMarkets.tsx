import { CheckCard } from "../shared/CheckCard";

interface StepTraderMarketsProps {
  markets: Record<string, boolean>;
  onChange: (markets: Record<string, boolean>) => void;
}

export const StepTraderMarkets = ({ markets, onChange }: StepTraderMarketsProps) => (
  <div className="space-y-5">
    <h2 className="text-lg font-semibold text-foreground">TRADER MARKETS</h2>
    <div className="grid gap-3">
      {Object.entries(markets).map(([key, val]) => (
        <CheckCard key={key} label={key} checked={val} onChange={(v) => onChange({ ...markets, [key]: v })} />
      ))}
    </div>
  </div>
);
