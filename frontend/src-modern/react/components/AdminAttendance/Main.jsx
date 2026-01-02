import React, { useState, useEffect } from "react";
import axios from "axios";
import SessionList from "./SessionList";
import SessionForm from "./SessionForm";
import SessionDetails from "./SessionDetails";
import SessionReport from "./SessionReport";
import MessageModal from "./MessageModal";
import {
  FaCalendarCheck,
  FaPlus,
  FaFilter,
  FaSync,
  FaQrcode,
  FaChartBar,
  FaFileExport,
} from "react-icons/fa";

const AdminAttendance = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    event_id: "",
    meeting_id: "",
    active_only: "",
  });
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [messageModal, setMessageModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.date) queryParams.append("date", filters.date);
      if (filters.event_id) queryParams.append("event_id", filters.event_id);
      if (filters.meeting_id)
        queryParams.append("meeting_id", filters.meeting_id);
      if (filters.active_only)
        queryParams.append("active_only", filters.active_only);

      const queryString = queryParams.toString();
      const url = `/api/attendance/sessions${queryString ? `?${queryString}` : ""}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setSessions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      showMessage("Error", "Gagal mengambil data sesi absensi", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/meetings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMeetings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const fetchReport = async (sessionId) => {
    try {
      setLoadingReport(true);
      const response = await axios.get(
        `/api/attendance/reports/session?session_id=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setReportData(response.data.data);
        setShowReport(true);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      showMessage("Error", "Gagal mengambil laporan", "danger");
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchEvents();
    fetchMeetings();
  }, [filters]);

  const handleCreateSession = async (sessionData) => {
    try {
      const response = await axios.post(
        "/api/attendance/sessions",
        sessionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showMessage("Sukses", "Sesi absensi berhasil dibuat", "success");
        setShowForm(false);
        fetchSessions();

        // Tampilkan QR code jika ada
        if (response.data.data.qr_data) {
          setSelectedSession({
            ...response.data.data.session,
            qr_data: response.data.data.qr_data,
          });
          setShowDetails(true);
        }
      }
    } catch (error) {
      console.error("Error creating session:", error);
      const errorMsg =
        error.response?.data?.message || "Gagal membuat sesi absensi";
      showMessage("Error", errorMsg, "danger");
    }
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const handleViewReport = (session) => {
    setSelectedSession(session);
    fetchReport(session.id);
  };

  const handleExportReport = () => {
    if (!reportData) return;

    const data = {
      session: reportData.session,
      summary: reportData.summary,
      stats: reportData.stats,
      attendance: reportData.attendance,
      role_stats: reportData.role_stats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${reportData.session.unique_code}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage("Sukses", "Laporan berhasil diunduh", "success");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      event_id: "",
      meeting_id: "",
      active_only: "",
    });
  };

  const showMessage = (title, message, type = "success") => {
    setMessageModal({
      show: true,
      title,
      message,
      type,
    });
  };

  // Hitung statistik
  const stats = {
    total: sessions.length,
    active: sessions.filter(
      (s) =>
        s.status === "active" &&
        (!s.expires_at || new Date(s.expires_at) > new Date())
    ).length,
    expired: sessions.filter(
      (s) =>
        s.status === "active" &&
        s.expires_at &&
        new Date(s.expires_at) <= new Date()
    ).length,
    totalAttendees: sessions.reduce(
      (sum, s) => sum + (s.attendee_count || 0),
      0
    ),
  };

  return (
    <div className="container-fluid p-4 pt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-3 mt-2">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">
            <FaCalendarCheck className="me-2" />
            Manajemen Absensi
          </h1>
          <p className="text-muted">
            Kelola sesi absensi, QR code, dan laporan
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedSession(null);
            setShowForm(true);
          }}
        >
          <FaPlus className="me-2" />
          Buat Sesi Absensi
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Sesi</h5>
              <h2 className="card-text">{stats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body">
              <h5 className="card-title text-success">Sesi Aktif</h5>
              <h2 className="card-text">{stats.active}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">Total Peserta</h5>
              <h2 className="card-text">{stats.totalAttendees}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body">
              <h5 className="card-title text-info">Sesi Kadaluarsa</h5>
              <h2 className="card-text">{stats.expired}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Pencarian
          </h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchSessions}
            disabled={loading}
          >
            <FaSync className={loading ? "fa-spin" : ""} />
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Tanggal Event</label>
              <input
                type="date"
                className="form-control"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Event</label>
              <select
                className="form-select"
                value={filters.event_id}
                onChange={(e) => handleFilterChange("event_id", e.target.value)}
              >
                <option value="">Semua Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Meeting</label>
              <select
                className="form-select"
                value={filters.meeting_id}
                onChange={(e) =>
                  handleFilterChange("meeting_id", e.target.value)
                }
              >
                <option value="">Semua Meeting</option>
                {meetings.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                disabled={loading}
              >
                <FaSync className="me-2" />
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Session List */}
      <SessionList
        sessions={sessions}
        loading={loading}
        onViewDetails={handleViewDetails}
        onViewReport={handleViewReport}
        onRefresh={fetchSessions}
      />

      {/* Session Form Modal */}
      {showForm && (
        <SessionForm
          events={events}
          meetings={meetings}
          onSubmit={handleCreateSession}
          onClose={() => {
            setShowForm(false);
            setSelectedSession(null);
          }}
        />
      )}

      {/* Session Details Modal */}
      {showDetails && selectedSession && (
        <SessionDetails
          session={selectedSession}
          onClose={() => {
            setShowDetails(false);
            setSelectedSession(null);
          }}
        />
      )}

      {/* Report Modal */}
      {showReport && (
        <SessionReport
          session={selectedSession}
          reportData={reportData}
          loading={loadingReport}
          onExport={handleExportReport}
          onClose={() => {
            setShowReport(false);
            setReportData(null);
            setSelectedSession(null);
          }}
        />
      )}

      {/* Message Modal */}
      <MessageModal
        show={messageModal.show}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        onClose={() => setMessageModal({ ...messageModal, show: false })}
      />
    </div>
  );
};

export default AdminAttendance;
