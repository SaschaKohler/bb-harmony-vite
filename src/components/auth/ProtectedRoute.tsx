import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to the /auth page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
