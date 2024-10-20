import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { RegistrationForm } from "./components/auth/RegistrationForm";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            {/* Fügen Sie hier weitere Routen hinzu */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
