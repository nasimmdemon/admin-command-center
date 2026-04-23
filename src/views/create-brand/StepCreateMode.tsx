import { motion } from "framer-motion";
import { FileJson, Copy, Sparkles, Database } from "lucide-react";

export type CreateMode = "simple" | "same_db" | "same_config" | "from_scratch";

interface StepCreateModeProps {
  value: CreateMode | null;
  onChange: (v: CreateMode) => void;
}

const OPTIONS: {
  id: CreateMode;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  iconBg: string;
  iconColor: string;
  borderSelected: string;
  shadowSelected: string;
  tag: string;
}[] = [
  {
    id: "simple",
    label: "Simple",
    desc: "Start from scratch with the full step-by-step wizard.",
    icon: Sparkles,
    bg: "bg-[hsl(217,91%,97%)]",
    iconBg: "bg-[hsl(217,91%,92%)]",
    iconColor: "text-[hsl(217,80%,55%)]",
    borderSelected: "border-[hsl(217,80%,65%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(217,91%,90%)]",
    tag: "Recommended",
  },
  {
    id: "same_db",
    label: "Same DB (2 + 1)",
    desc: "Clone an existing brand — same database, same config.",
    icon: Database,
    bg: "bg-[hsl(160,60%,96%)]",
    iconBg: "bg-[hsl(160,60%,90%)]",
    iconColor: "text-[hsl(160,65%,38%)]",
    borderSelected: "border-[hsl(160,65%,50%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(160,60%,90%)]",
    tag: "Clone",
  },
  {
    id: "same_config",
    label: "Same Config",
    desc: "Copy config only — new users and domains (up to 2).",
    icon: Copy,
    bg: "bg-[hsl(38,92%,96%)]",
    iconBg: "bg-[hsl(38,92%,90%)]",
    iconColor: "text-[hsl(38,80%,45%)]",
    borderSelected: "border-[hsl(38,80%,55%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(38,92%,90%)]",
    tag: "Partial copy",
  },
  {
    id: "from_scratch",
    label: "From Scratch",
    desc: "Completely new setup — not 2, not 1.",
    icon: FileJson,
    bg: "bg-[hsl(250,80%,97%)]",
    iconBg: "bg-[hsl(250,80%,92%)]",
    iconColor: "text-[hsl(250,65%,58%)]",
    borderSelected: "border-[hsl(250,65%,65%)]",
    shadowSelected: "shadow-[0_0_0_3px_hsl(250,80%,92%)]",
    tag: "Advanced",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

export const StepCreateMode = ({ value, onChange }: StepCreateModeProps) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="space-y-1.5">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">Create Brand</h2>
      <p className="text-[15px] text-muted-foreground leading-relaxed">
        Choose how you'd like to set up your new brand.
      </p>
    </div>

    {/* 2×2 Grid */}
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const selected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            variants={cardVariants}
            whileHover={{ scale: 1.025, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onChange(opt.id as import("@/controllers/useCreateBrand").CreateMode)}
            className={[
              "relative group rounded-2xl border-2 p-5 text-left transition-all duration-300 cursor-pointer w-full",
              opt.bg,
              selected
                ? `${opt.borderSelected} ${opt.shadowSelected}`
                : "border-transparent hover:border-border/60",
            ].join(" ")}
            style={{
              boxShadow: selected
                ? undefined
                : "0 2px 12px -4px rgba(0,0,0,0.06), 0 6px 20px -6px rgba(0,0,0,0.07)",
            }}
          >
            {/* Selected ring glow overlay */}
            {selected && (
              <motion.div
                layoutId="selected-glow"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "rgba(255,255,255,0.35)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            {/* Tag badge */}
            <span
              className={[
                "absolute top-3.5 right-3.5 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full",
                opt.iconBg,
                opt.iconColor,
              ].join(" ")}
            >
              {opt.tag}
            </span>

            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${opt.iconBg}`}>
              <Icon className={`w-5 h-5 ${opt.iconColor}`} />
            </div>

            {/* Text */}
            <p className="text-[15px] font-bold text-foreground mb-1 leading-snug">{opt.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed pr-6">{opt.desc}</p>

            {/* Selected indicator dot */}
            <div
              className={[
                "absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                selected ? opt.borderSelected.replace("border-", "border-") : "border-muted-foreground/25",
              ].join(" ")}
            >
              {selected && (
                <motion.div
                  layoutId="selected-dot"
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "currentColor" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  </div>
);
