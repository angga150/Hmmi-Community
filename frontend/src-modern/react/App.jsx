import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setMsg(data.success ? "Login berhasil" : "Login gagal");
  };

  return (
    <form onSubmit={login} className="card p-3">
      <h5>Login</h5>
      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary">Login</button>
      {msg && <div className="mt-2">{msg}</div>}
    </form>
  );
}

export default App;
