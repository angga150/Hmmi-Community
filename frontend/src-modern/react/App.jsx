import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && (
        <LoginForm
          onLogin={(getEmail) => {
            setEmail(getEmail);
            setPage("dashboard");
          }}
          goRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <RegisterForm
          onRegister={(username, email) => {
            setUser(username);
            setEmail(email);
            setPage("login");
          }}
          goLogin={() => setPage("login")}
        />
      )}

      {page === "dashboard" && email && (
        <Dashboard
          email={email}
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
