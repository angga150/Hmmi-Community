import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import LogoutPage from "./components/LogoutPage";
// Test ApiKey
import TestApi from "./components/TestApi";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarActive, setSidebarActive] = useState("meetings");

  // ambil token saat app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (loading) {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="text-muted">Memuat aplikasi...</h3>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm
                onLogin={(tokenFromLogin) => {
                  setToken(tokenFromLogin);
                  localStorage.setItem("token", tokenFromLogin);
                }}
              />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            token ? <Navigate to="/dashboard" replace /> : <RegisterForm />
          }
        />

        {/* Logout */}
        <Route
          path="/logout"
          element={<LogoutPage onLogout={handleLogout} />}
        />

        {/* Test API */}
        <Route path="/test" element={<TestApi />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard
                sidebarActive={sidebarActive}
                setSidebarActive={setSidebarActive}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* TOOLS - AI Blackbox */}
        <Route
          path="/tools/ai-blackbox"
          element={
            token ? (
              <Dashboard
                sidebarActive={"ai-blackbox"}
                setSidebarActive={setSidebarActive}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect root ke dashboard jika sudah login */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
              <div className="text-center">
                <h1 className="text-muted">404 - Halaman Tidak Ditemukan</h1>
                <p className="mb-4">Halaman yang Anda cari tidak ada.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.history.back()}
                >
                  Kembali
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
