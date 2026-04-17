import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Demo from "@/pages/Demo";
import CreateBrand from "@/pages/CreateBrand";
import Monitor from "@/pages/Monitor";
import Providers from "@/pages/Providers";
import StandaloneWidgets from "@/pages/StandaloneWidgets";
import NotFound from "@/pages/NotFound";
import ApiTest from "@/pages/ApiTest";
import { ROUTES } from "@/models/routes";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<Index />} />
    <Route path={ROUTES.DEMO} element={<Demo />} />
    <Route path={ROUTES.CREATE_BRAND} element={<CreateBrand />} />
    <Route path={ROUTES.MONITOR} element={<Monitor />} />
    <Route path={ROUTES.PROVIDERS} element={<Providers />} />
    <Route path="/standalone" element={<StandaloneWidgets />} />
    <Route path={ROUTES.API_TEST} element={<ApiTest />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
