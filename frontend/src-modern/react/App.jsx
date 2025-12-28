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

function App() {
  const [token, setToken] = useState(null);

  // ambil token saat app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginForm
                onLogin={(tokenFromLogin) => {
                  setToken(tokenFromLogin);
                }}
              />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" /> : <RegisterForm />}
        />

        {/* Logout */}
        <Route
          path="/logout"
          element={<LogoutPage onLogout={handleLogout} />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard
                onLogout={() => {
                  localStorage.removeItem("token");
                  setToken(null);
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
