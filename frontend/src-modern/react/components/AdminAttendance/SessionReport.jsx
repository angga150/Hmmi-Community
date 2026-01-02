import React from "react";
import {
  FaTimes,
  FaChartBar,
  FaUsers,
  FaCalendar,
  FaClock,
  FaDownload,
  FaUserCheck,
  FaUserClock,
  FaExclamationCircle,
} from "react-icons/fa";

const SessionReport = ({ session, reportData, loading, onExport, onClose }) => {
  if (loading) {
    return (
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Mengambil data laporan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const {
    session: sessionData,
    attendance,
    stats,
    role_stats,
    summary,
  } = reportData;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <FaChartBar className="me-2" />
              Laporan Absensi
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Header */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h4>{sessionData.title}</h4>
                <p className="text-muted">
                  Kode: <strong>{sessionData.unique_code}</strong>
                </p>
              </div>
              <div className="col-md-6 text-end">
                <p className="text-muted">
                  Dibuat: {sessionData.created_at_formatted}
                </p>
                <p className="text-muted">
                  Dibuat oleh: {sessionData.creator_name}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card border-primary">
                  <div className="card-body text-center">
                    <FaUsers className="text-primary mb-2" size={24} />
                    <h3>{stats.total_attendees}</h3>
                    <p className="mb-0">Total Peserta</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <FaUserCheck className="text-success mb-2" size={24} />
                    <h3>{stats.attendance_percentage}</h3>
                    <p className="mb-0">Persentase</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-warning">
                  <div className="card-body text-center">
                    <FaClock className="text-warning mb-2" size={24} />
                    <h3 className="small">{stats.first_checkin}</h3>
                    <p className="mb-0">Check-in Pertama</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-info">
                  <div className="card-body text-center">
                    <FaClock className="text-info mb-2" size={24} />
                    <h3 className="small">{stats.last_checkin}</h3>
                    <p className="mb-0">Check-in Terakhir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Statistics */}
            {role_stats && Object.keys(role_stats).length > 0 && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Statistik Berdasarkan Role</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Object.entries(role_stats).map(([role, count]) => (
                          <div key={role} className="col-md-4 mb-2">
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                              <span className="text-capitalize">{role}</span>
                              <span className="badge bg-primary">
                                {count} orang
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance List */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      Daftar Kehadiran ({attendance.length})
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={onExport}
                    >
                      <FaDownload className="me-2" />
                      Export Data
                    </button>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th width="5%">#</th>
                            <th width="25%">Nama</th>
                            <th width="25%">Email</th>
                            <th width="15%">Role</th>
                            <th width="20%">Waktu Check-in</th>
                            <th width="10%">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map((record, index) => (
                            <tr key={record.id}>
                              <td>{index + 1}</td>
                              <td>
                                <div>
                                  <strong>{record.username}</strong>
                                </div>
                              </td>
                              <td>{record.email}</td>
                              <td>
                                <span
                                  className={`badge ${record.role === "admin" ? "bg-danger" : "bg-primary"}`}
                                >
                                  {record.role}
                                </span>
                              </td>
                              <td>
                                <div>
                                  <div>{record.checkin_time_formatted}</div>
                                  <small className="text-muted">
                                    {record.checkin_date_formatted}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-success">
                                  <FaUserCheck className="me-1" />
                                  Hadir
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-info">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0">Ringkasan Laporan</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Judul Sesi:</strong> {summary.session_title}
                        </p>
                        <p>
                          <strong>Kode Unik:</strong> {summary.unique_code}
                        </p>
                        <p>
                          <strong>Status:</strong> {summary.status}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Dibuat oleh:</strong> {summary.created_by}
                        </p>
                        <p>
                          <strong>Laporan dibuat:</strong>{" "}
                          {summary.report_generated_at}
                        </p>
                        <p>
                          <strong>Durasi Check-in:</strong>{" "}
                          {stats.checkin_duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <FaTimes className="me-2" />
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onExport}
            >
              <FaDownload className="me-2" />
              Export Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReport;
