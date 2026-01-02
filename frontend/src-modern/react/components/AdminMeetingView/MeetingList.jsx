import React from "react";
import { FaEdit, FaTrash, FaCheck, FaBan, FaClock } from "react-icons/fa";

const MeetingList = ({
  meetings,
  loading,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { class: "bg-warning text-dark", label: "Upcoming" },
      completed: { class: "bg-success", label: "Completed" },
      cancelled: { class: "bg-danger", label: "Cancelled" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      label: "Unknown",
    };

    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Memuat data meeting...</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <FaClock size={48} className="text-muted mb-3" />
          <h5 className="text-muted">Tidak ada meeting ditemukan</h5>
          <p className="text-muted">Coba ubah filter atau buat meeting baru</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Daftar Meeting ({meetings.length})</h5>
        <small className="text-muted">Klik edit untuk mengubah status</small>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th width="5%">ID</th>
                <th width="20%">Judul</th>
                <th width="15%">Tanggal & Waktu</th>
                <th width="15%">Tempat</th>
                <th width="15%">Status</th>
                <th width="15%">Dibuat Oleh</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="fw-semibold">#{meeting.id}</td>
                  <td>
                    <div>
                      <strong className="d-block">{meeting.title}</strong>
                      <small className="text-muted">
                        {meeting.description && meeting.description.length > 80
                          ? `${meeting.description.substring(0, 80)}...`
                          : meeting.description}
                      </small>
                    </div>
                  </td>
                  <td>
                    {meeting.meeting_date_formatted ||
                      formatDateTime(meeting.meeting_date)}
                  </td>
                  <td>{meeting.place || "-"}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {getStatusBadge(meeting.status)}

                      {/* Quick Actions untuk status upcoming */}
                      {meeting.status === "upcoming" && (
                        <div className="btn-group btn-group-sm ms-2">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() =>
                              onUpdateStatus(meeting.id, {
                                status: "completed",
                              })
                            }
                            title="Tandai sebagai selesai"
                          >
                            <FaCheck size={12} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              onUpdateStatus(meeting.id, {
                                status: "cancelled",
                              })
                            }
                            title="Batalkan meeting"
                          >
                            <FaBan size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-medium">{meeting.creator_name}</span>
                      {meeting.created_at && (
                        <small className="text-muted">
                          {new Date(meeting.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(meeting)}
                        title="Edit Status"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(meeting.id)}
                        title="Hapus"
                      >
                        <FaTrash />
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

export default MeetingList;
