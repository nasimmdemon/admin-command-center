import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { INDEX_NAVIGATION_OPTIONS } from "@/models/navigation-options";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dotted flex items-center justify-center p-6 md:p-10">
      <PageTransition className="w-full max-w-5xl">
        <div className="text-center mb-10 md:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-[2.5rem] font-bold text-foreground tracking-tight"
          >
            Admin Of Admins
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="text-muted-foreground mt-3 text-base"
          >
            Select an action to get started
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 h-px w-16 bg-primary/40 rounded-full origin-center"
          />
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {INDEX_NAVIGATION_OPTIONS.map((opt) => (
            <StaggerItem key={opt.route}>
              <motion.button
                whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.12 } }}
                onClick={() => navigate(opt.route)}
                className={`w-full text-left rounded-2xl border ${opt.tint} p-6 flex flex-col gap-4 group cursor-pointer
                  border-border/40 shadow-widget hover:shadow-card hover:border-primary/25
                  transition-all duration-300 ease-smooth`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                    ${opt.tint} border border-border/40 shadow-soft`}
                  >
                    <opt.icon className="w-6 h-6 text-foreground/90" strokeWidth={1.75} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-base leading-tight">{opt.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{opt.description}</p>
                </div>
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageTransition>
    </div>
  );
};

export default Index;
