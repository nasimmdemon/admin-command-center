/**
 * StepShell — consistent header + content wrapper used by every wizard step.
 * Provides: icon badge, title, subtitle, and an optional tag/badge.
 */
import { motion } from "framer-motion";

interface StepShellProps {
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;       // e.g. "text-blue-500"
  iconBg?: string;          // e.g. "bg-blue-50"
  title: string;
  subtitle?: string;
  tag?: string;
  children: React.ReactNode;
}

export const StepShell = ({
  icon: Icon,
  iconColor = "text-[hsl(217,80%,55%)]",
  iconBg = "bg-[hsl(217,91%,96%)]",
  title,
  subtitle,
  tag,
  children,
}: StepShellProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    className="space-y-8"
  >
    {/* Header */}
    <div className="flex items-start gap-4">
      {Icon && (
        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      )}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight">{title}</h2>
          {tag && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-foreground/6 text-muted-foreground border border-border/50">
              {tag}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>

    {/* Content */}
    <div>{children}</div>
  </motion.div>
);

/** A clean section card — white bg, subtle border, generous padding */
export const StepCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-border/50 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </div>
);

/** Section title inside a StepCard */
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{children}</p>
);

/** A single settings row: label + description on left, control on right */
export const SettingsRow = ({
  label,
  description,
  children,
  border = true,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  border?: boolean;
}) => (
  <div
    className={`flex items-center justify-between gap-6 py-4 ${border ? "border-b border-border/40 last:border-0" : ""}`}
  >
    <div className="min-w-0">
      <p className="text-[14px] font-semibold text-foreground">{label}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);
