import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserFriends,
  FaHourglassHalf,
  FaPlayCircle,
  FaCheckCircle,
} from "react-icons/fa";

function MeetingsGrid({ meetings, onAttend, onDetails }) {
  const formatDate = (dateString) => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch {
      return dateString;
    }
  };

  const formatTimeOnly = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-5">
        <FaCalendarAlt className="text-muted mb-3" size={48} />
        <h5 className="text-muted">Tidak ada pertemuan</h5>
        <p className="text-muted mb-4">
          Tidak ditemukan pertemuan dengan kriteria yang dipilih
        </p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {meetings.map((meeting) => {
        // Tentukan badge warna berdasarkan status dinamis
        const getStatusBadge = () => {
          const status = meeting.dynamicStatus || meeting.status;

          switch (status) {
            case "running":
              return {
                text: meeting.dynamicStatusText || "Berlangsung",
                class: "bg-warning text-dark",
                icon: <FaPlayCircle className="me-1" />,
              };
            case "completed":
              return {
                text: meeting.dynamicStatusText || "Selesai",
                class: "bg-success text-white",
                icon: <FaCheckCircle className="me-1" />,
              };
            case "upcoming":
            default:
              return {
                text: meeting.dynamicStatusText || "Mendatang",
                class: "bg-primary text-white",
                icon: <FaHourglassHalf className="me-1" />,
              };
          }
        };

        const statusBadge = getStatusBadge();

        return (
          <div key={meeting.id} className="col-xl-4 col-lg-6 col-md-6">
            <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
              <div className="card-header bg-transparent border-0 pb-0 pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-info text-white">
                    {meeting.type || "Meeting"}
                  </span>
                  <span
                    className={`badge ${statusBadge.class} d-flex align-items-center`}
                  >
                    {statusBadge.icon}
                    {statusBadge.text}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <h5 className="card-title fw-bold text-dark mb-2">
                  {meeting.title}
                </h5>
                <p className="card-text text-muted small mb-3">
                  {meeting.description || "Tidak ada deskripsi"}
                </p>

                {/* Countdown Section hanya untuk upcoming */}
                {meeting.dynamicStatus === "upcoming" && meeting.countdown && (
                  <div className="alert alert-primary py-2 px-3 mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <FaHourglassHalf className="me-2" />
                        <small className="fw-bold">Mulai dalam:</small>
                      </div>
                      <small className="fw-bold">{meeting.countdown}</small>
                    </div>

                    {/* Countdown detail jika tersedia */}
                    {meeting.timeRemaining && (
                      <div className="mt-1 text-center small">
                        {meeting.timeRemaining.days > 0 && (
                          <span className="me-2">
                            <strong>{meeting.timeRemaining.days}</strong> hari
                          </span>
                        )}
                        {meeting.timeRemaining.hours > 0 && (
                          <span className="me-2">
                            <strong>{meeting.timeRemaining.hours}</strong> jam
                          </span>
                        )}
                        <span>
                          <strong>{meeting.timeRemaining.minutes}</strong> menit
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Status untuk meeting yang sedang berlangsung */}
                {meeting.dynamicStatus === "running" && (
                  <div className="alert alert-warning py-2 px-3 mb-3">
                    <div className="d-flex align-items-center">
                      <FaPlayCircle className="me-2" />
                      <small className="fw-bold">{meeting.countdown}</small>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaCalendarAlt className="text-primary me-2" size={14} />
                    <small className="text-muted">
                      {formatDate(meeting.meeting_date)}
                    </small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-primary me-2" size={14} />
                    <small className="text-muted">
                      {formatTimeOnly(meeting.meeting_date)}
                    </small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="text-primary me-2" size={14} />
                    <small className="text-muted">
                      {meeting.place || "Tempat belum ditentukan"}
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaUserFriends className="text-primary me-2" size={14} />
                    <small className="text-muted">
                      Dibuat oleh: {meeting.creator_name || "Admin"}
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${meeting.creator_name || "Admin"}&background=4361ee&color=fff`}
                      alt={meeting.creator_name}
                      className="rounded-circle me-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <small className="fw-semibold">
                      {meeting.creator_name || "Admin"}
                    </small>
                  </div>

                  <div>
                    {/* Tombol Hadiri hanya untuk upcoming dan running */}
                    {(meeting.dynamicStatus === "upcoming" ||
                      meeting.dynamicStatus === "running") && (
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => onAttend(meeting.id)}
                      >
                        {meeting.dynamicStatus === "running"
                          ? "Bergabung"
                          : "Hadiri"}
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onDetails(meeting.id)}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MeetingsGrid;
