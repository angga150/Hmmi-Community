import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleMessageModal from "./SimpleMessageModal"; // Import modal
import {
  FaCalendarCheck,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaCalendar,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const UserAttendance = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedCode = localStorage.getItem("attendance_code");
    if (savedCode) {
      handleCheckCode(savedCode);
      localStorage.removeItem("attendance_code");
    }

    fetchActiveSessions();
  }, []);

  // Fetch active sessions for user
  const fetchActiveSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await axios.get(
        "/api/attendance/sessions?active_only=true",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setActiveSessions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fungsi untuk menampilkan modal
  const showMessageModal = (success, title, message) => {
    setModalSuccess(success);
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleCheckCode = async (inputCode = null) => {
    const checkCode = inputCode || code;

    if (!checkCode.trim()) {
      showMessageModal(false, "Gagal", "Kode absensi harus diisi");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "/api/attendance/checkin/manual",
        { code: checkCode.toUpperCase() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Tampilkan modal sukses
        showMessageModal(true, "Check-in Berhasil!", response.data.message);

        // Simpan data untuk ditampilkan di halaman juga
        setResult({
          success: true,
          message: response.data.message,
          data: response.data.data,
        });

        setCode("");
        // Refresh active sessions after successful check-in
        fetchActiveSessions();
      } else {
        // Tampilkan modal gagal
        showMessageModal(false, "Check-in Gagal", response.data.message);

        setResult({
          success: false,
          message: response.data.message,
          already_checked_in: response.data.already_checked_in,
          checkin_time: response.data.checkin_time,
        });
      }
    } catch (err) {
      console.error("Check-in error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Terjadi kesalahan saat melakukan check-in";

      // Tampilkan modal error
      showMessageModal(false, "Error", errorMessage);

      setResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("attendance_code")) {
    handleCheckCode(localStorage.getItem("attendance_code"));
    localStorage.removeItem("attendance_code");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckCode();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const time = new Date(timeString);
    return time.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const expiresAt = session.expires_at ? new Date(session.expires_at) : null;

    if (session.status === "inactive") return "nonaktif";
    if (expiresAt && expiresAt < now) return "kadaluarsa";
    return "aktif";
  };

  const getSessionStatusColor = (session) => {
    const status = getSessionStatus(session);
    if (status === "aktif") return "success";
    if (status === "kadaluarsa") return "warning";
    return "secondary";
  };

  return (
    <div className="container py-5">
      {/* SimpleMessageModal */}
      <SimpleMessageModal
        show={showModal}
        success={modalSuccess}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      {/* Header */}
      <div className="text-center pt-5 my-5">
        <h1 className="display-6 fw-bold text-primary mb-3">
          <FaCalendarCheck className="me-2" />
          Sistem Absensi
        </h1>
        <p className="lead text-muted">
          Masukkan kode absensi yang diberikan oleh panitia
        </p>
      </div>

      <div className="row justify-content-center">
        {/* Main Check-in Card */}
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0">
                <FaKey className="me-2" />
                Check-in Manual
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold fs-5">
                    <FaCalendarCheck className="me-2" />
                    Kode Absensi
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0">
                      <FaKey className="text-primary" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 text-left fw-bold lead"
                      placeholder="Masukkan 8 karakter kode"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={8}
                      disabled={loading}
                      style={{
                        letterSpacing: "1px",
                        fontSize: "1rem",
                        height: "60px",
                      }}
                    />
                  </div>
                  <div className="form-text text-muted text-center mt-2">
                    Contoh: ABC12345 atau XYZ67890
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    disabled={loading || !code.trim()}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="me-2" />
                        Check-in Sekarang
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Result Message (Tetap tampil di halaman setelah modal ditutup) */}
              {result && (
                <div
                  className={`alert alert-${result.success ? "success" : "danger"} mt-4`}
                >
                  <div className="d-flex align-items-start">
                    {result.success ? (
                      <FaCheckCircle className="me-3 mt-1" size={24} />
                    ) : (
                      <FaTimesCircle className="me-3 mt-1" size={24} />
                    )}
                    <div className="flex-grow-1">
                      <h5 className="alert-heading mb-2">
                        {result.success
                          ? "✅ Check-in Berhasil!"
                          : "❌ Check-in Gagal"}
                      </h5>
                      <p className="mb-0">{result.message}</p>

                      {result.success && result.data && (
                        <div className="mt-3">
                          <div className="card border-success bg-light">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <div className="d-flex align-items-center">
                                    <FaCalendar className="me-2 text-primary" />
                                    <div>
                                      <small className="text-muted">Sesi</small>
                                      <div className="fw-bold">
                                        {result.data.session.title}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <div className="d-flex align-items-center">
                                    <FaClock className="me-2 text-success" />
                                    <div>
                                      <small className="text-muted">
                                        Waktu
                                      </small>
                                      <div className="fw-bold">
                                        {result.data.summary.your_checkin_time}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <div className="d-flex align-items-center">
                                    <FaUsers className="me-2 text-info" />
                                    <div>
                                      <small className="text-muted">
                                        Total Peserta
                                      </small>
                                      <div className="fw-bold">
                                        {result.data.summary.total_attendees}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <div className="d-flex align-items-center">
                                    <FaUsers className="me-2 text-warning" />
                                    <div>
                                      <small className="text-muted">
                                        Kapasitas
                                      </small>
                                      <div className="fw-bold">
                                        {result.data.summary.max_attendees}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {(result.data.session.event_title ||
                                result.data.session.meeting_title) && (
                                <div className="mt-2 pt-2 border-top">
                                  <small className="text-muted">Terkait:</small>
                                  {result.data.session.event_title && (
                                    <div className="fw-bold text-primary">
                                      {result.data.session.event_title}
                                    </div>
                                  )}
                                  {result.data.session.meeting_title && (
                                    <div className="fw-bold text-success">
                                      {result.data.session.meeting_title}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {result.already_checked_in && (
                        <div className="alert alert-warning mt-3">
                          <FaExclamationTriangle className="me-2" />
                          Anda sudah check-in pada pukul{" "}
                          <strong>{formatTime(result.checkin_time)}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="card shadow border-0">
            <div className="card-header bg-info text-white py-3">
              <h4 className="mb-0">
                <FaCalendar className="me-2" />
                Sesi Absensi Aktif
              </h4>
            </div>
            <div className="card-body p-4">
              {loadingSessions ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Memuat sesi aktif...</p>
                </div>
              ) : activeSessions.length === 0 ? (
                <div className="text-center py-4">
                  <FaTimesCircle className="text-muted mb-3" size={48} />
                  <p className="text-muted">
                    Tidak ada sesi absensi aktif saat ini
                  </p>
                  <p className="text-muted small">
                    Silakan hubungi administrator untuk informasi lebih lanjut
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th width="30%">Judul Sesi</th>
                        <th width="20%">Kode</th>
                        <th width="25%">Tanggal</th>
                        <th width="25%">Status & Peserta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSessions.map((session) => (
                        <tr key={session.id}>
                          <td>
                            <div>
                              <strong>{session.title}</strong>
                              {(session.event_title ||
                                session.meeting_title) && (
                                <div className="small text-muted">
                                  {session.event_title || session.meeting_title}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              <code className="bg-light p-2 rounded d-inline-block">
                                {session.unique_code}
                              </code>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{formatDate(session.event_date)}</div>
                              {session.expires_at_formatted && (
                                <small className="text-muted">
                                  Berakhir: {session.expires_at_formatted}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <span
                                className={`badge bg-${getSessionStatusColor(session)} mb-2`}
                              >
                                {getSessionStatus(session)}
                              </span>
                              <div>
                                <FaUsers className="me-1" size={14} />
                                <span className="fw-bold">
                                  {session.attendee_count || 0}
                                </span>
                                {session.max_attendees && (
                                  <span className="text-muted">
                                    {" "}
                                    / {session.max_attendees}
                                  </span>
                                )}
                                <span className="text-muted"> peserta</span>
                              </div>
                              {session.max_attendees &&
                                session.attendee_count >=
                                  session.max_attendees && (
                                  <small className="text-danger">
                                    <FaExclamationTriangle className="me-1" />
                                    Penuh
                                  </small>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="card shadow border-0 mt-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">📋 Petunjuk Penggunaan:</h5>
              <ol className="list-group list-group-numbered border-0">
                <li className="list-group-item border-0 px-0 py-1">
                  Dapatkan kode absensi dari panitia/administrator
                </li>
                <li className="list-group-item border-0 px-0 py-1">
                  Masukkan kode pada kolom di atas (8 karakter)
                </li>
                <li className="list-group-item border-0 px-0 py-1">
                  Klik tombol "Check-in Sekarang"
                </li>
                <li className="list-group-item border-0 px-0 py-1">
                  Tunggu hingga muncul konfirmasi berhasil/gagal
                </li>
                <li className="list-group-item border-0 px-0 py-1">
                  Simpan bukti check-in jika diperlukan
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Status */}
        <div className="card shadow border-0 mt-4">
          <div className="card-body text-center">
            <h6 className="fw-bold mb-3">Status Sistem</h6>
            <div className="d-flex justify-content-around">
              <div className="text-center">
                <div className="fs-4 fw-bold text-primary">
                  {activeSessions.length}
                </div>
                <div className="small text-muted">Sesi Aktif</div>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold text-success">
                  {activeSessions.reduce(
                    (sum, s) => sum + (s.attendee_count || 0),
                    0
                  )}
                </div>
                <div className="small text-muted">Total Peserta</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 text-center">
        <div className="alert alert-light border">
          <p className="mb-0 small text-muted">
            <strong>Sistem Absensi © {new Date().getFullYear()}</strong> | Untuk
            pertanyaan atau bantuan teknis, hubungi administrator sistem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAttendance;
