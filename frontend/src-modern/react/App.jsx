import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
// import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  if (user && page !== "dashboard") {
    setPage("dashboard");
  }

  return (
    <>
      {page === "login" && (
        <LoginForm
          onLogin={(username) => {
            setUser(username);
            setPage("dashboard");
          }}
          goRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <RegisterForm
          onRegister={(username) => {
            setUser(username);
            setPage("dashboard");
          }}
          goLogin={() => setPage("login")}
        />
      )}

      {page === "dashboard" && user && (
        <Dashboard
          user={user}
          onLogout={() => {
            setUser(null);
            setPage("login");
          }}
        />
      )}
    </>
  );
}

export default App;
