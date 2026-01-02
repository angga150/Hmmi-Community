import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FaTimes,
  FaCalendar,
  FaClock,
  FaUsers,
  FaCopy,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const SessionDetails = ({ session, onClose }) => {
  const getStatusColor = (session) => {
    const now = new Date();
    const expiresAt = session.expires_at ? new Date(session.expires_at) : null;

    if (session.status === "inactive") return "text-secondary";
    if (expiresAt && expiresAt < now) return "text-warning";
    return "text-success";
  };

  const getStatusText = (session) => {
    const now = new Date();
    const expiresAt = session.expires_at ? new Date(session.expires_at) : null;

    if (session.status === "inactive") return "Nonaktif";
    if (expiresAt && expiresAt < now) return "Kadaluarsa";
    return "Aktif";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detail Sesi Absensi</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Left Column - QR Code */}
              <div className="col-md-5">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <QRCodeSVG
                      value={`${window.location.origin}/attendance?code=${session.unique_code}`}
                      size={200}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"H"}
                      includeMargin={true}
                      className="mb-3"
                    />

                    <div className="mb-4">
                      <h5 className="fw-bold">{session.unique_code}</h5>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => copyToClipboard(session.unique_code)}
                      >
                        <FaCopy className="me-2" />
                        Salin Kode
                      </button>
                    </div>

                    <div className="text-start">
                      <h6>Info QR Code:</h6>
                      <p className="small text-muted">
                        Scan QR code ini untuk absensi. QR code akan berlaku
                        sampai:
                      </p>
                      <p className="small">
                        <FaClock className="me-2" />
                        {session.expires_at_formatted ||
                          "Tidak ada batas waktu"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="col-md-7">
                <div className="mb-4">
                  <h4 className="fw-bold">{session.title}</h4>
                  <div className={`badge ${getStatusColor(session)} bg-light`}>
                    {getStatusText(session)}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold">Informasi Sesi</label>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <FaCalendar className="me-2 text-primary" />
                            <strong>Tanggal Event:</strong>
                            <div>{session.event_date}</div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <FaUsers className="me-2 text-success" />
                            <strong>Kapasitas:</strong>
                            <div>
                              {session.attendee_count || 0}
                              {session.max_attendees
                                ? ` / ${session.max_attendees}`
                                : ""}{" "}
                              peserta
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <FaClock className="me-2 text-warning" />
                            <strong>Dibuat:</strong>
                            <div>{session.created_at_formatted}</div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <FaClock className="me-2 text-info" />
                            <strong>Berakhir:</strong>
                            <div>
                              {session.expires_at_formatted || "Tidak ada"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">Terkait Dengan</label>
                    <div className="card bg-light">
                      <div className="card-body">
                        {session.event_title ? (
                          <div>
                            <strong className="text-primary">Event:</strong>
                            <div>{session.event_title}</div>
                          </div>
                        ) : session.meeting_title ? (
                          <div>
                            <strong className="text-success">Meeting:</strong>
                            <div>{session.meeting_title}</div>
                          </div>
                        ) : (
                          <div className="text-muted">Sesi Standalone</div>
                        )}
                        {session.creator_name && (
                          <div className="mt-2">
                            <strong>Dibuat oleh:</strong>
                            <div>{session.creator_name}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.max_attendees && session.attendee_count > 0 && (
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        Statistik Kehadiran
                      </label>
                      <div className="card bg-light">
                        <div className="card-body">
                          <div
                            className="progress mb-2"
                            style={{ height: "20px" }}
                          >
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${Math.min(100, ((session.attendee_count || 0) / session.max_attendees) * 100)}%`,
                              }}
                            >
                              {Math.round(
                                ((session.attendee_count || 0) /
                                  session.max_attendees) *
                                  100
                              )}
                              %
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Terisi: {session.attendee_count || 0}</span>
                            <span>
                              Sisa:{" "}
                              {Math.max(
                                0,
                                session.max_attendees -
                                  (session.attendee_count || 0)
                              )}
                            </span>
                          </div>
                          {session.attendee_count >= session.max_attendees && (
                            <div className="alert alert-warning mt-2 py-1 px-2 mb-0">
                              <FaExclamationTriangle className="me-2" />
                              Kapasitas sudah penuh!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
              onClick={() => {
                copyToClipboard(
                  `${window.location.origin}/attendance?code=${session.unique_code}`
                );
              }}
            >
              <FaCopy className="me-2" />
              Salin Link Absensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
