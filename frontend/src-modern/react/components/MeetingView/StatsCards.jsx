import { FaCalendarAlt, FaClock, FaUserFriends, FaVideo } from "react-icons/fa";

function StatsCards({ stats }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3 col-sm-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <FaCalendarAlt className="text-primary fs-4" />
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{stats.upcoming}</h3>
                <p className="text-muted mb-0">Pertemuan Mendatang</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3 col-sm-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <FaClock className="text-success fs-4" />
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{stats.completed}</h3>
                <p className="text-muted mb-0">Selesai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3 col-sm-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <FaUserFriends className="text-warning fs-4" />
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{stats.workshops}</h3>
                <p className="text-muted mb-0">Workshop</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3 col-sm-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                <FaVideo className="text-danger fs-4" />
              </div>
              <div>
                <h3 className="mb-0 fw-bold">{stats.seminars}</h3>
                <p className="text-muted mb-0">Seminar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
