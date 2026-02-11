import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { INDEX_NAVIGATION_OPTIONS } from "@/models/navigation-options";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dotted flex items-center justify-center p-4">
      <PageTransition className="w-full max-w-3xl">
        <div className="bg-card rounded-2xl shadow-lg border p-8 md:p-12">
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
            >
              Admin Of Admins
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-muted-foreground mt-2"
            >
              Select an action to get started
            </motion.p>
          </div>

          <StaggerContainer className="grid gap-4 md:gap-6">
            {INDEX_NAVIGATION_OPTIONS.map((opt) => (
              <StaggerItem key={opt.route}>
                <motion.button
                  whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(opt.route)}
                  className={`w-full text-left rounded-xl border bg-gradient-to-r ${opt.gradient} p-6 flex items-center gap-5 group cursor-pointer`}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-card border flex items-center justify-center shadow-sm relative">
                    <opt.icon className="w-6 h-6 text-foreground" />
                    <opt.secondaryIcon className="w-3.5 h-3.5 text-muted-foreground absolute -bottom-1 -right-1 bg-card rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg">{opt.title}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{opt.description}</p>
                  </div>
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
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
