import React from "react";
import {
  FaEye,
  FaQrcode,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const SessionList = ({ sessions, loading, onViewDetails, onRefresh }) => {
  const getStatusBadge = (session) => {
    const now = new Date();
    const expiresAt = session.expires_at ? new Date(session.expires_at) : null;

    if (session.status === "inactive") {
      return <span className="badge bg-secondary">Nonaktif</span>;
    }

    if (expiresAt && expiresAt < now) {
      return <span className="badge bg-warning text-dark">Kadaluarsa</span>;
    }

    return <span className="badge bg-success">Aktif</span>;
  };

  const getCapacityPercentage = (session) => {
    if (!session.max_attendees || session.max_attendees === 0) return 0;
    return Math.min(
      100,
      Math.round((session.attendee_count / session.max_attendees) * 100)
    );
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return "bg-danger";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <FaCalendarAlt size={48} className="text-muted mb-3" />
          <h5 className="text-muted">Tidak ada sesi absensi ditemukan</h5>
          <p className="text-muted">Coba ubah filter atau buat sesi baru</p>
          <button className="btn btn-outline-primary mt-3" onClick={onRefresh}>
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Daftar Sesi Absensi ({sessions.length})</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th width="5%">ID</th>
                <th width="20%">Judul</th>
                <th width="15%">Kode & Status</th>
                <th width="15%">Tanggal & Waktu</th>
                <th width="15%">Kapasitas</th>
                <th width="15%">Event/Meeting</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.id}</td>
                  <td>
                    <div>
                      <strong>{session.title}</strong>
                      <p className="text-muted mb-0 small">
                        <FaClock className="me-1" size={12} />
                        Dibuat: {session.created_at_formatted}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-2">
                      <code className="bg-light p-2 rounded text-center">
                        {session.unique_code}
                      </code>
                      {getStatusBadge(session)}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>
                        <FaCalendarAlt className="me-2" size={14} />
                        {session.event_date}
                      </div>
                      {session.expires_at_formatted && (
                        <small className="text-muted">
                          Berakhir: {session.expires_at_formatted}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="d-flex justify-content-between">
                        <span>
                          <FaUsers className="me-1" />
                          {session.attendee_count || 0}
                          {session.max_attendees
                            ? `/${session.max_attendees}`
                            : ""}
                        </span>
                        {session.max_attendees && (
                          <span className="text-muted">
                            {getCapacityPercentage(session)}%
                          </span>
                        )}
                      </div>
                      {session.max_attendees && (
                        <div
                          className="progress mt-1"
                          style={{ height: "5px" }}
                        >
                          <div
                            className={`progress-bar ${getCapacityColor(getCapacityPercentage(session))}`}
                            role="progressbar"
                            style={{
                              width: `${getCapacityPercentage(session)}%`,
                            }}
                          ></div>
                        </div>
                      )}
                      {getCapacityPercentage(session) >= 90 && (
                        <small className="text-danger">
                          <FaExclamationTriangle className="me-1" />
                          Hampir penuh!
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="small">
                      {session.event_title ? (
                        <div className="text-primary">
                          Event: {session.event_title}
                        </div>
                      ) : session.meeting_title ? (
                        <div className="text-success">
                          Meeting: {session.meeting_title}
                        </div>
                      ) : (
                        <div className="text-muted">Standalone Session</div>
                      )}
                      {session.creator_name && (
                        <div className="text-muted">
                          Oleh: {session.creator_name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-info"
                        onClick={() => onViewDetails(session)}
                        title="Lihat Detail"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          // Bisa diisi dengan aksi QR code
                          onViewDetails(session);
                        }}
                        title="Lihat QR Code"
                      >
                        <FaQrcode />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionList;
