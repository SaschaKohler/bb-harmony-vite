import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Stellen Sie sicher, dass dieser Pfad korrekt ist

const PublicRoute: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    // Benutzer ist bereits authentifiziert, Umleitung zur Hauptseite
    return <Navigate to="/" replace />;
  }

  // Benutzer ist nicht authentifiziert, Render der öffentlichen Route
  return <Outlet />;
};

export default PublicRoute;
