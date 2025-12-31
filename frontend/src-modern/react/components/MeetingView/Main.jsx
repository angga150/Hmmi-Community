import { useEffect, useState } from "react";
import axios from "axios";

import StatsCards from "./StatsCards";
import MeetingsGrid from "./MeetingsGrid";
import CalendarSection from "./CalendarSection";

function MeetingView({ user, searchTerm }) {
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [meetingCount, setMeetingCount] = useState({
    all: 0,
    upcoming: 0,
    running: 0,
    completed: 0,
  });

  // Function untuk menentukan status berdasarkan waktu
  const determineMeetingStatus = (meetingDate) => {
    const now = new Date();
    const meetingTime = new Date(meetingDate);
    const diff = meetingTime - now;

    // Jika meeting sudah lewat lebih dari 2 jam, anggap selesai
    const twoHoursAfterMeeting = new Date(
      meetingTime.getTime() + 2 * 60 * 60 * 1000
    );

    if (now > twoHoursAfterMeeting) {
      return {
        status: "completed",
        text: "Selesai",
        countdown: null,
      };
    }

    // Jika meeting sedang berlangsung (dalam rentang waktu meeting)
    if (now >= meetingTime && now <= twoHoursAfterMeeting) {
      const minutesRunning = Math.floor((now - meetingTime) / (1000 * 60));
      let runningText = "Sedang berlangsung";

      if (minutesRunning < 60) {
        runningText = `${minutesRunning} menit berjalan`;
      } else {
        const hours = Math.floor(minutesRunning / 60);
        const minutes = minutesRunning % 60;
        runningText = `${hours} jam ${minutes} menit berjalan`;
      }

      return {
        status: "running",
        text: runningText,
        countdown: runningText,
      };
    }

    // Jika meeting masih akan datang
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let countdownText = "";

      if (days > 0) {
        countdownText = `${days} hari ${hours} jam lagi`;
      } else if (hours > 0) {
        countdownText = `${hours} jam ${minutes} menit lagi`;
      } else if (minutes > 0) {
        countdownText = `${minutes} menit lagi`;
      } else {
        countdownText = "Segera dimulai";
      }

      return {
        status: "upcoming",
        text: "Akan datang",
        countdown: countdownText,
      };
    }

    // Default
    return {
      status: "completed",
      text: "Selesai",
      countdown: null,
    };
  };

  // Function untuk menghitung waktu tersisa (untuk countdown)
  const calculateTimeRemaining = (meetingDate) => {
    const now = new Date();
    const meetingTime = new Date(meetingDate);
    const diff = meetingTime - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      total: diff,
    };
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch semua meeting
        const allRes = await axios.get("/api/meetings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (allRes.data.success) {
          const allMeetings = allRes.data.data;

          // Tambahkan status dinamis berdasarkan waktu
          const enhancedMeetings = allMeetings.map((meeting) => {
            const statusInfo = determineMeetingStatus(meeting.meeting_date);
            const timeRemaining = calculateTimeRemaining(meeting.meeting_date);

            return {
              ...meeting,
              dynamicStatus: statusInfo.status, // Status berdasarkan waktu
              dynamicStatusText: statusInfo.text,
              countdown: statusInfo.countdown,
              timeRemaining: timeRemaining,
              // Prioritaskan status dinamis, fallback ke status dari API
              displayStatus:
                statusInfo.status !== "upcoming"
                  ? statusInfo.status
                  : meeting.status || "upcoming",
            };
          });

          setMeetings(enhancedMeetings);

          // Hitung statistik berdasarkan status dinamis
          const allCount = enhancedMeetings.length;
          const upcomingCount = enhancedMeetings.filter(
            (m) => m.dynamicStatus === "upcoming"
          ).length;
          const runningCount = enhancedMeetings.filter(
            (m) => m.dynamicStatus === "running"
          ).length;
          const completedCount = enhancedMeetings.filter(
            (m) => m.dynamicStatus === "completed"
          ).length;

          setMeetingCount({
            all: allCount,
            upcoming: upcomingCount,
            running: runningCount,
            completed: completedCount,
          });
        } else {
          setError(true);
          setMsg(allRes.data.message || "Data tidak dapat ditemukan");
        }
      } catch (err) {
        setError(true);
        setMsg(
          err.response?.data?.message || "Terjadi kesalahan saat mengambil data"
        );
        console.error("Error fetching meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();

    // Refresh data setiap menit untuk update status dan countdown
    const interval = setInterval(() => {
      setMeetings((prev) => {
        return prev.map((meeting) => {
          const statusInfo = determineMeetingStatus(meeting.meeting_date);
          const timeRemaining = calculateTimeRemaining(meeting.meeting_date);

          return {
            ...meeting,
            dynamicStatus: statusInfo.status,
            dynamicStatusText: statusInfo.text,
            countdown: statusInfo.countdown,
            timeRemaining: timeRemaining,
            displayStatus:
              statusInfo.status !== "upcoming"
                ? statusInfo.status
                : meeting.status || "upcoming",
          };
        });
      });
    }, 60000); // Update setiap menit

    return () => clearInterval(interval);
  }, []);

  // Filter meetings berdasarkan tab aktif
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "upcoming" && meeting.dynamicStatus === "upcoming") ||
      (activeTab === "running" && meeting.dynamicStatus === "running") ||
      (activeTab === "completed" && meeting.dynamicStatus === "completed");

    const matchesSearch =
      searchTerm === "" ||
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Render loading, error, atau konten utama
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{msg}</p>
      </div>
    );
  }

  return (
    <div className="p-4 p-md-5">
      {/* Welcome Message */}
      <div className="mt-4">
        <h1 className="h2 fw-bold text-dark mb-2">
          Selamat Datang, {user?.username || user?.name || "User"}
        </h1>
        <p className="text-muted mb-3">
          UKM Pemrograman HMMI Community - {user?.email || ""}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards meetingCount={meetingCount} />

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
                Semua ({meetingCount.all})
              </button>
              <button
                className={`nav-link ${activeTab === "upcoming" ? "active" : ""} me-2`}
                onClick={() => setActiveTab("upcoming")}
              >
                Mendatang ({meetingCount.upcoming})
              </button>
              <button
                className={`nav-link ${activeTab === "running" ? "active" : ""} me-2`}
                onClick={() => setActiveTab("running")}
              >
                Berlangsung ({meetingCount.running})
              </button>
              <button
                className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                Selesai ({meetingCount.completed})
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
