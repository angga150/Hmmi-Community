import { useEffect, useState } from "react";

import StatsCards from "./StatsCards";
import MeetingsGrid from "./MeetingsGrid";
import CalendarSection from "./CalendarSection";

function MeetingView({ user, searchTerm }) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterType, setFilterType] = useState("all");

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
  );
}
export default MeetingView;
