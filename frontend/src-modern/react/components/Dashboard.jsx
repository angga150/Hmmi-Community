import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MeetingView from "./MeetingView/Main";

function Dashboard({ sidebarActive, setSidebarActive, onLogout }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992); // Breakpoint LG di Bootstrap
    };

    checkMobile();

    // Tambah event listener untuk resize
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Reset sidebar state saat berpindah dari mobile ke desktop
  useEffect(() => {
    if (!isMobile && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isMobile, sidebarCollapsed]);

  // Toggle sidebar dengan pengecekan device
  const handleToggleSidebar = () => {
    if (isMobile) {
      // Di mobile, toggle biasa
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // Di desktop, gunakan collapsed state
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/auth/me", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setError(true);
          setMsg(res.data.message || "Not authenticated");
        }
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
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="text-muted">Memuat dashboard...</h3>
        </div>
      </div>
    );
  }

  // error (fallback)
  if (error) {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card border-0 shadow-sm" style={{ maxWidth: "500px" }}>
          <div className="card-body p-4 text-center">
            <div className="mb-4">
              <i className="bi bi-shield-exclamation text-danger fs-1"></i>
            </div>
            <h1 className="h4 fw-bold text-danger mb-3">Not Authenticated</h1>
            <p className="text-muted mb-4">{msg}</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.removeItem("token");
                onLogout();
                navigate("/login");
              }}
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <div className="row g-0">
        {/* Sidebar */}
        <Sidebar
          user={user}
          sidebarActive={sidebarActive}
          setSidebarActive={setSidebarActive}
          collapsed={isMobile ? sidebarCollapsed : sidebarCollapsed}
          onToggle={handleToggleSidebar}
          onLogout={() => {
            localStorage.removeItem("token");
            onLogout();
            navigate("/login");
          }}
        />

        {/* Main Content */}
        <div
          className={`${sidebarCollapsed && !isMobile ? "col-lg-11 col-xl-11" : "col-lg-10 col-xl-10"} offset-lg-2 offset-xl-1`}
          style={{
            marginLeft: isMobile ? "0px" : sidebarCollapsed ? "0px" : "250px",
            transition: "margin-left 0.3s ease",
          }}
        >
          {/* Navbar */}
          <Navbar
            collapsed={isMobile ? sidebarCollapsed : sidebarCollapsed}
            onToggle={handleToggleSidebar}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddMeeting={() => {
              // Function untuk tambah meeting
              console.log("Add meeting clicked");
            }}
          />
          {/* Meeting View */}
          {sidebarActive === "meetings" && (
            <MeetingView user={user} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
