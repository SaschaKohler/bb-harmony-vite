import { lazy, ComponentType } from "react";
import {
  Home,
  Compass,
  Users,
  FileText,
  User,
  LogIn,
  Settings,
  MessageCircle,
} from "lucide-react";

// Lazy loaded components
const Dashboard = lazy(() => import("@/pages/dashboard"));
const BachblutenRad = lazy(() => import("@/pages/bachbluetenrad"));
const ClientListPage = lazy(() => import("@/pages/clients"));
const FlowerSelectionListPage = lazy(() => import("@/pages/flower-selections"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const UnifiedAuthPage = lazy(() => import("@/components/auth/UnifiedAuthPage"));
const AdminPage = lazy(() => import("@/pages/admin"));
const TherapyConsultation = lazy(() => import("@/pages/therapy-consultation"));

interface RouteConfig {
  path: string;
  element: ComponentType;
  name: string;
  icon?: ComponentType;
  children?: RouteConfig[];
}

interface RouteGroup {
  label: string;
  routes: RouteConfig[];
}

interface RoutesConfig {
  public: RouteGroup[];
  protected: RouteGroup[];
}

export const routes: RoutesConfig = {
  public: [
    {
      label: "Auth",
      routes: [
        {
          path: "/auth",
          element: UnifiedAuthPage,
          name: "Authentication",
          icon: LogIn,
        },
      ],
    },
  ],
  protected: [
    {
      label: "Dashboard",
      routes: [
        {
          path: "/",
          element: Dashboard,
          name: "Dashboard",
          icon: Home,
        },
      ],
    },
    {
      label: "Bachblüten",
      routes: [
        {
          path: "/bachbluten-rad",
          element: BachblutenRad,
          name: "Bachblüten Rad",
          icon: Compass,
        },
        {
          path: "/flower-selections",
          element: FlowerSelectionListPage,
          name: "Blüten-Mischungen",
          icon: FileText,
        },
        {
          path: "/beratung",
          element: TherapyConsultation,
          name: "Beratung",
          icon: MessageCircle,
        },
      ],
    },
    {
      label: "Verwaltung",
      routes: [
        {
          path: "/clients",
          element: ClientListPage,
          name: "Klienten",
          icon: Users,
        },
      ],
    },
    {
      label: "Einstellungen",
      routes: [
        {
          path: "/profile",
          element: ProfilePage,
          name: "Profil",
          icon: User,
        },
        {
          path: "/admin",
          element: AdminPage,
          name: "Admin",
          icon: Settings,
        },
      ],
    },
  ],
} as const;

// Angepasste Helper-Funktionen
export const getRoute = (path: string): RouteConfig | undefined => {
  const allRoutes = [
    ...routes.public.flatMap((g) => g.routes),
    ...routes.protected.flatMap((g) => g.routes),
  ];
  return allRoutes.find((route) => route.path === path);
};

export const isProtectedRoute = (path: string): boolean => {
  return routes.protected.some((group) =>
    group.routes.some((route) => route.path === path),
  );
};

// Angepasste Typen
export type RoutePath =
  | ReturnType<(typeof routes.protected)[number]["routes"][number]["path"]>
  | ReturnType<(typeof routes.public)[number]["routes"][number]["path"]>;

// Angepasste Navigation Guard
export const guardRoute = (path: string): boolean => {
  const route = getRoute(path);
  return !!route;
};

// Angepasste Sidebar Navigation Items
export const getSidebarNavItems = () =>
  routes.protected.map((group) => ({
    label: group.label,
    items: group.routes.map(({ path, name, icon: Icon }) => ({
      path,
      name,
      icon: Icon ? <Icon className="h-4 w-4" /> : null,
    })),
  }));
