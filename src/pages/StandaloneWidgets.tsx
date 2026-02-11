import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, LayoutDashboard, Component, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_WIDGETS, WIDGETS_BY_CATEGORY, CATEGORY_INFO, type WidgetCategory } from "@/standalone/widget-registry";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const StandaloneWidgets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const widgetId = searchParams.get("widget") || "";
  const [activeCategory, setActiveCategory] = useState<WidgetCategory | "all">("all");

  const selectedWidget = widgetId ? ALL_WIDGETS.find((w) => w.id === widgetId) : null;

  const filteredWidgets =
    activeCategory === "all"
      ? ALL_WIDGETS
      : WIDGETS_BY_CATEGORY[activeCategory];

  const openWidget = (id: string) => setSearchParams({ widget: id });
  const closeWidget = () => setSearchParams({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Widget Playground
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Click any widget to run it in isolation. Perfect for testing and development.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {(["all", "create-brand", "monitor", "shared"] as const).map((cat) => {
            const info = cat === "all" ? { label: "All", icon: Sparkles } : CATEGORY_INFO[cat];
            const Icon = info.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-white/80 dark:bg-slate-800/80 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {info.label}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredWidgets.map((widget) => (
            <motion.div
              key={widget.id}
              variants={cardVariants}
              onClick={() => openWidget(widget.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {widget.category}
                </span>
                <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">
                  {widget.name}
                </h3>
                {widget.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {widget.description}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to preview →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedWidget && (
            <motion.div
              key={selectedWidget.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeWidget}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-4 mx-auto flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:inset-8 sm:mx-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{selectedWidget.name}</h2>
                    {selectedWidget.description && (
                      <p className="text-sm text-muted-foreground">{selectedWidget.description}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeWidget} className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="min-h-[200px]"
                  >
                    {selectedWidget.component}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StandaloneWidgets;
