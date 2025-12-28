import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Dashboard/Sidebar";
import Navbar from "./Dashboard/Navbar";
import StatsCards from "./Dashboard/StatsCards";
import MeetingsGrid from "./Dashboard/MeetingsGrid";
import CalendarSection from "./Dashboard/CalendarSection";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterType, setFilterType] = useState("all");

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

  // Data meetings dummy
  const [meetings] = useState([
    {
      id: 1,
      title: "Workshop HTML & CSS Dasar",
      description: "Pembelajaran dasar HTML dan CSS untuk pemula",
      date: "2024-03-25",
      time: "13:00 - 15:00",
      location: "Lab Komputer A",
      type: "workshop",
      instructor: "Budi Santoso",
      participants: 25,
      status: "upcoming",
    },
    {
      id: 2,
      title: "JavaScript Modern ES6+",
      description: "Mempelajari fitur-fitur terbaru JavaScript ES6",
      date: "2024-03-20",
      time: "09:00 - 12:00",
      location: "Lab Komputer B",
      type: "workshop",
      instructor: "Siti Aminah",
      participants: 18,
      status: "completed",
    },
    {
      id: 3,
      title: "React.js Fundamentals",
      description: "Pengenalan React.js dan konsep dasar",
      date: "2024-03-28",
      time: "14:00 - 17:00",
      location: "Online (Zoom)",
      type: "seminar",
      instructor: "Andi Wijaya",
      participants: 30,
      status: "upcoming",
    },
    {
      id: 4,
      title: "Database Design dengan MySQL",
      description: "Perancangan database dan implementasi MySQL",
      date: "2024-03-18",
      time: "10:00 - 12:00",
      location: "Lab Komputer C",
      type: "workshop",
      instructor: "Dewi Lestari",
      participants: 22,
      status: "completed",
    },
  ]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/auth/me", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setUser(res.data.data.username);
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

  // Filter meetings
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesStatus = activeTab === "all" || meeting.status === activeTab;
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || meeting.type === filterType;

    return matchesStatus && matchesSearch && matchesType;
  });

  // Hitung statistik
  const stats = {
    total: meetings.length,
    upcoming: meetings.filter((m) => m.status === "upcoming").length,
    completed: meetings.filter((m) => m.status === "completed").length,
    workshops: meetings.filter((m) => m.type === "workshop").length,
    seminars: meetings.filter((m) => m.type === "seminar").length,
  };

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <div className="row g-0">
        {/* Sidebar */}
        <Sidebar
          user={user}
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

          <div className="p-5 p-md-5">
            {/* Welcome Message */}
            <div className="mt-5">
              <h1 className="h2 fw-bold text-dark mb-2">
                Selamat Datang, {user?.username || user?.name}
              </h1>
              <p className="text-muted mb-3">
                UKM Pemrograman HMMI Community - {user?.email}
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Main Content Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                  {/* Tabs */}
                  <div className="nav nav-pills mb-3 mb-md-0">
                    <button
                      className={`nav-link ${activeTab === "all" ? "active" : ""} me-2`}
                      onClick={() => setActiveTab("all")}
                    >
                      Semua ({stats.total})
                    </button>
                    <button
                      className={`nav-link ${activeTab === "upcoming" ? "active" : ""} me-2`}
                      onClick={() => setActiveTab("upcoming")}
                    >
                      Mendatang ({stats.upcoming})
                    </button>
                    <button
                      className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
                      onClick={() => setActiveTab("completed")}
                    >
                      Selesai ({stats.completed})
                    </button>
                  </div>

                  {/* Filter */}
                  <div className="d-flex align-items-center">
                    <div className="input-group" style={{ width: "200px" }}>
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-funnel"></i>
                      </span>
                      <select
                        className="form-select border-start-0"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="all">Semua Tipe</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Meetings Grid */}
                <MeetingsGrid
                  meetings={filteredMeetings}
                  onAttend={(id) => console.log("Attend meeting:", id)}
                  onDetails={(id) => console.log("Show details:", id)}
                />
              </div>
            </div>

            {/* Calendar Section */}
            <CalendarSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
