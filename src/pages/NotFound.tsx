import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ROUTES } from "@/models/routes";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-dotted p-4">
      <div className="text-center bg-card rounded-2xl border border-border/60 shadow-card p-12 max-w-md">
        <h1 className="mb-3 text-5xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found</p>
        <Link to={ROUTES.HOME} className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-all duration-300 shadow-soft">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
