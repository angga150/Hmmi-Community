import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/auth/me", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        setError(true);
        setMsg(err.response?.data?.message || "Not authenticated");

        // auto logout jika token invalid
        // localStorage.removeItem("token");
        // onLogout();
        // navigate("/login");
      }
    };

    fetchMe();
  }, [navigate, onLogout]);

  // loading
  if (!user && !error) {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  // error (fallback)
  if (error) {
    return (
      <div className="bg-danger vh-100 vw-100 text-white p-5">
        <h1>Not Authenticated</h1>
        <p>{msg}</p>
        <button
          className="btn btn-light"
          onClick={() => {
            localStorage.removeItem("token");
            onLogout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  // sukses
  return (
    <div className="bg-success vh-100 vw-100 text-white p-5">
      <h1>Welcome, {user.username}</h1>

      <button
        className="btn btn-light mt-3"
        onClick={() => {
          localStorage.removeItem("token");
          onLogout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
