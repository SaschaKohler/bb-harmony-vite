import { lazy, ComponentType } from "react";
import {
  Home,
  Compass,
  Users,
  FileText,
  User,
  LogIn,
  Settings,
} from "lucide-react";

// Lazy loaded components
const Dashboard = lazy(() => import("@/pages/dashboard"));
const BachblutenRad = lazy(() => import("@/pages/BachbluetenRad"));
const ClientListPage = lazy(() => import("@/pages/clients"));
const FlowerSelectionListPage = lazy(() => import("@/pages/flower-selections"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const UnifiedAuthPage = lazy(() => import("@/components/auth/UnifiedAuthPage"));
const AdminPage = lazy(() => import("@/pages/admin"));

interface RouteConfig {
  groupLabel: string;
  path: string;
  element: ComponentType;
  name: string;
  icon?: ComponentType;
  children?: RouteConfig[];
}

interface RoutesConfig {
  public: RouteConfig[];
  protected: RouteConfig[];
}

export const routes: RoutesConfig = {
  public: [
    {
      groupLabel: "auth",
      path: "/auth",
      element: UnifiedAuthPage,
      name: "Authentication",
      icon: LogIn,
    },
  ],
  protected: [
    {
      groupLabel: "auth",
      path: "/",
      element: Dashboard,
      name: "Dashboard",
      icon: Home,
    },
    {
      groupLabel: "auth",
      path: "/bachbluten-rad",
      element: BachblutenRad,
      name: "Bachblüten Rad",
      icon: Compass,
    },
    {
      groupLabel: "auth",
      path: "/clients",
      element: ClientListPage,
      name: "Klienten",
      icon: Users,
    },
    {
      groupLabel: "auth",
      path: "/flower-selections",
      element: FlowerSelectionListPage,
      name: "Blüten-Mischungen",
      icon: FileText,
    },
    {
      groupLabel: "auth",
      path: "/profile",
      element: ProfilePage,
      name: "Profil",
      icon: User,
    },
    {
      groupLabel: "auth",
      path: "/admin",
      element: AdminPage,
      name: "Admin",
      icon: Settings,
    },
  ],
} as const;

// Helper functions für die Navigation
export const getRoute = (path: string): RouteConfig | undefined => {
  const allRoutes = [...routes.public, ...routes.protected];
  return allRoutes.find((route) => route.path === path);
};

export const isProtectedRoute = (path: string): boolean => {
  return routes.protected.some((route) => route.path === path);
};

// Typen für die Navigation
export type RoutePath =
  | (typeof routes.protected)[number]["path"]
  | (typeof routes.public)[number]["path"];

// Navigation Guard
export const guardRoute = (path: string): boolean => {
  const route = getRoute(path);
  return !!route;
};

// Sidebar Navigation Items
export const getSidebarNavItems = () =>
  routes.protected.map(({ path, name, icon: Icon }) => ({
    path,
    name,
    icon: Icon ? <Icon className="h-4 w-4" /> : null,
  }));
