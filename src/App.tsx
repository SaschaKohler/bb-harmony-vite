import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UnifiedAuthPage } from "./components/auth/UnifiedAuthPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BachblutenRad from "./pages/BachbluetenRad";
import PublicRoute from "./components/auth/PublicRoute";
import ProfilePage from "./pages/ProfilePage";
import ClientListPage from "./pages/ClientListPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<UnifiedAuthPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/bachbluten-rad" element={<BachblutenRad />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/clients" element={<ClientListPage />} />{" "}
              {/* Neue Route für die Kundenliste */}
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
          {/* Catch-all route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
