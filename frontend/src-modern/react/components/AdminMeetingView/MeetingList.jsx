import React from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaClock } from "react-icons/fa";

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
      <div className="card-header bg-light">
        <h5 className="mb-0">Daftar Meeting ({meetings.length})</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th width="5%">ID</th>
                <th width="25%">Judul</th>
                <th width="15%">Tanggal & Waktu</th>
                <th width="15%">Tempat</th>
                <th width="10%">Status</th>
                <th width="15%">Dibuat Oleh</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td>{meeting.id}</td>
                  <td>
                    <div>
                      <strong>{meeting.title}</strong>
                      <p className="text-muted mb-0 small">
                        {meeting.description}
                      </p>
                    </div>
                  </td>
                  <td>{meeting.meeting_date_formatted}</td>
                  <td>{meeting.place}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {getStatusBadge(meeting.status)}
                      {meeting.status === "upcoming" && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            onUpdateStatus(meeting.id, { status: "completed" })
                          }
                          title="Tandai sebagai selesai"
                        >
                          <FaCheck size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{meeting.creator_name}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(meeting)}
                        title="Edit"
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
