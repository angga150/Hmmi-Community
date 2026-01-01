import React, { useState, useEffect } from "react";
import axios from "axios";
import SessionList from "./SessionList";
import SessionForm from "./SessionForm";
// import SessionDetails from "./SessionDetails";
import MessageModal from "./MessageModal";
import {
  FaCalendarCheck,
  FaPlus,
  FaFilter,
  FaSync,
  FaQrcode,
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
        showMessage("Sukses", response.data.message, "success");
        setShowForm(false);
        fetchSessions();

        // Jika ada QR code data, tampilkan info tambahan
        if (response.data.data.qr_data) {
          console.log("QR Code created:", response.data.data.qr_data);
          // Bisa ditambahkan modal khusus QR code di sini
        }
      }
    } catch (error) {
      console.error("Error creating session:", error);
      showMessage(
        "Error",
        error.response?.data?.message || "Gagal membuat sesi absensi",
        "danger"
      );
    }
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const sessionDetailMsg = (title, message, type = "success") => {
    return (
      <MessageModal
        show={showDetails}
        title={title}
        message={message}
        type={type}
        onClose={() => setShowDetails(false)}
      />
    );
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

  const generateQRCodeUrl = (code) => {
    return `/api/attendance/qrcode/${code}`;
  };

  return (
    <div className="container-fluid p-5 mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">
            <FaCalendarCheck className="me-2" />
            Pengaturan Absensi
          </h1>
          <p className="text-muted">Kelola sesi absensi dan QR code</p>
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
              <h2 className="card-text">{sessions.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body">
              <h5 className="card-title text-success">Sesi Aktif</h5>
              <h2 className="card-text">
                {
                  sessions.filter(
                    (s) =>
                      s.status === "active" &&
                      (!s.expires_at || new Date(s.expires_at) > new Date())
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">Total Peserta</h5>
              <h2 className="card-text">
                {sessions.reduce(
                  (total, session) => total + (session.attendee_count || 0),
                  0
                )}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body">
              <h5 className="card-title text-info">QR Code Aktif</h5>
              <h2 className="card-text">
                <FaQrcode className="me-2" />
                {sessions.filter((s) => s.status === "active").length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Sesi Absensi
          </h5>
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
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.active_only}
                onChange={(e) =>
                  handleFilterChange("active_only", e.target.value)
                }
              >
                <option value="">Semua Status</option>
                <option value="true">Aktif Saja</option>
              </select>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <FaSync className="me-2" />
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session List */}
      <SessionList
        sessions={sessions}
        loading={loading}
        onViewDetails={handleViewDetails}
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
      {showDetails &&
        selectedSession &&
        sessionDetailMsg("Segera hadir", "fitur akan hadir")}

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
