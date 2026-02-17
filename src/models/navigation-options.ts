import { Monitor, Plus, BarChart3, MousePointer2, FolderPlus, Search, Plug, FileText, Sparkles } from "lucide-react";
import { ROUTES } from "./routes";

export interface NavigationOption {
  title: string;
  description: string;
  icon: typeof Monitor;
  secondaryIcon: typeof Plus;
  route: string;
  gradient: string;
  tint: string;
}

export const INDEX_NAVIGATION_OPTIONS: NavigationOption[] = [
  {
    title: "Showcase Demo For Client",
    description: "Start a live demo session with your client via video call",
    icon: MousePointer2,
    secondaryIcon: Monitor,
    route: ROUTES.DEMO,
    gradient: "from-primary/8 to-primary/12",
    tint: "bg-tint-blue",
  },
  {
    title: "Create New",
    description: "Set up a new brand with full configuration wizard",
    icon: FolderPlus,
    secondaryIcon: Plus,
    route: ROUTES.CREATE_BRAND,
    gradient: "from-success/8 to-success/12",
    tint: "bg-tint-mint",
  },
  {
    title: "Monitor & Shut Down",
    description: "View real-time metrics, manage brands and services",
    icon: BarChart3,
    secondaryIcon: Search,
    route: ROUTES.MONITOR,
    gradient: "from-warning/8 to-warning/12",
    tint: "bg-tint-amber",
  },
  {
    title: "Docs",
    description: "Docs for Payments, VoIP, and Email provider integrations",
    icon: Plug,
    secondaryIcon: FileText,
    route: ROUTES.PROVIDERS,
    gradient: "from-primary/8 to-primary/12",
    tint: "bg-tint-lavender",
  },
  {
    title: "Widget Playground",
    description: "Test all widgets in isolation Standalone Mode",
    icon: Sparkles,
    secondaryIcon: Monitor,
    route: ROUTES.STANDALONE,
    gradient: "from-primary/8 to-primary/12",
    tint: "bg-tint-blue",
  },
];
