import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import Layout from "@/components/layout/Layout";
import { routes } from "@/routes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              <LoadingSpinner className="h-8 w-8" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              {routes.public.map(({ path, element: Element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Element />
                    </Suspense>
                  }
                />
              ))}
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {routes.protected.map(({ path, element: Element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Element />
                      </Suspense>
                    }
                  />
                ))}
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" closeButton richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;
