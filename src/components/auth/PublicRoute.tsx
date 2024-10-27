// components/auth/PublicRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PublicRoute = () => {
  const location = useLocation();
  const auth = useAuth();

  // Während der Authentifizierungsstatus geladen wird, zeigen wir nichts an
  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Wenn der Benutzer eingeloggt ist, leiten wir zur vorherigen Seite oder zum Dashboard weiter
  if (auth.isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  // Ansonsten zeigen wir die öffentliche Route an
  return <Outlet />;
};

export default PublicRoute;
