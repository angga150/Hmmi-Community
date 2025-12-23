import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        setError(true);
        setMsg(
          err.response ? err.response.data.message : "Error fetching user"
        );
      }
    };

    fetchMe();
  }, []);

  // error
  if (error) {
    return (
      <div className="bg-danger vh-100 vw-100 text-white p-5">
        <h1>Not Authenticated</h1>
        <h1>{msg}</h1>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  }

  // loading
  if (!user) {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  // sukses
  return (
    <div className="bg-success vh-100 vw-100 text-white p-5">
      <h1>Welcome, {user.username}</h1>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
