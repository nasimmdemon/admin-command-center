import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { INDEX_NAVIGATION_OPTIONS } from "@/models/navigation-options";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dotted flex items-center justify-center p-4 md:p-8">
      <PageTransition className="w-full max-w-4xl">
        <div className="bg-card rounded-[1.5rem] shadow-card border border-border/40 p-8 md:p-12">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            >
              Admin Of Admins
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-muted-foreground mt-2 text-[15px]"
            >
              Select an action to get started
            </motion.p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDEX_NAVIGATION_OPTIONS.map((opt) => (
              <StaggerItem key={opt.route}>
                <motion.button
                  whileHover={{ y: -3, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                  whileTap={{ scale: 0.99, transition: { duration: 0.15 } }}
                  onClick={() => navigate(opt.route)}
                  className={`w-full text-left rounded-[1.25rem] border border-border/40 ${opt.tint} p-6 flex items-center gap-5 group cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 ease-smooth`}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-card/90 border border-border/30 flex items-center justify-center shadow-widget relative backdrop-blur-sm">
                    <opt.icon className="w-6 h-6 text-foreground" />
                    <opt.secondaryIcon className="w-3.5 h-3.5 text-muted-foreground absolute -bottom-1 -right-1 bg-card rounded-full shadow-soft" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg">{opt.title}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">{opt.description}</p>
                  </div>
                  <div className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-300">
                    →
                  </div>
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </PageTransition>
    </div>
  );
};

export default Index;
