import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserFriends,
} from "react-icons/fa";

function MeetingsGrid({ meetings, onAttend, onDetails }) {
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
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
      {meetings.map((meeting) => (
        <div key={meeting.id} className="col-xl-4 col-lg-6 col-md-6">
          <div className="card border-0 shadow-sm h-100 hover-shadow">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <span
                  className={`badge ${meeting.type === "workshop" ? "bg-warning" : "bg-danger"} text-white`}
                >
                  {meeting.type === "workshop" ? "Workshop" : "Seminar"}
                </span>
                <span
                  className={`badge ${meeting.status === "upcoming" ? "bg-primary" : "bg-success"}`}
                >
                  {meeting.status === "upcoming" ? "Mendatang" : "Selesai"}
                </span>
              </div>
            </div>

            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-2">
                {meeting.title}
              </h5>
              <p className="card-text text-muted small mb-3">
                {meeting.description}
              </p>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaCalendarAlt className="text-primary me-2" size={14} />
                  <small className="text-muted">
                    {formatDate(meeting.date)}
                  </small>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaClock className="text-primary me-2" size={14} />
                  <small className="text-muted">{meeting.time}</small>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaMapMarkerAlt className="text-primary me-2" size={14} />
                  <small className="text-muted">{meeting.location}</small>
                </div>
                <div className="d-flex align-items-center">
                  <FaUserFriends className="text-primary me-2" size={14} />
                  <small className="text-muted">
                    {meeting.participants} peserta
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${meeting.instructor}&background=4361ee&color=fff`}
                    alt={meeting.instructor}
                    className="rounded-circle me-2"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <small className="fw-semibold">{meeting.instructor}</small>
                </div>

                <div>
                  {meeting.status === "upcoming" && (
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => onAttend(meeting.id)}
                    >
                      Hadiri
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
      ))}
    </div>
  );
}

export default MeetingsGrid;
