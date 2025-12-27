import {
  FaCalendarAlt,
  FaUsers,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar({ user, collapsed, onToggle, onLogout }) {
  return (
    <div
      className={`col-lg-2 col-xl-2 col-md-3 d-flex flex-column p-0 text-white position-fixed vh-100`}
      style={{
        background: "#101727",
        zIndex: 1000,
        width: "250px",
        marginLeft: collapsed ? "-100%" : "0",
        transition: "all 0.3s ease",
      }}
    >
      <div className="d-flex flex-column h-100">
        {/* Sidebar Header */}
        <div className="p-3 border-bottom border-white border-opacity-10">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <FaCalendarAlt className="fs-3 text-accent" />
              <span className="ms-2 fw-bold">HMMI Community</span>
            </div>
            {/* <button
              className="btn btn-sm btn-outline-primary border-0 p-1 d-none d-lg-block"
              onClick={onToggle}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FaChevronRight size={14} />
              ) : (
                <FaChevronLeft size={14} />
              )}
            </button> */}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3 border-bottom border-white border-opacity-10">
          <div className="d-flex align-items-center">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.username || user?.name}&background=fff&color=4361ee`
              }
              alt={user?.name}
              className="rounded-circle border border-2 border-white border-opacity-25"
              style={{ width: "45px", height: "45px", objectFit: "cover" }}
            />

            <div className="ms-3">
              <h6 className="mb-0 fw-semibold">
                {user?.username || user?.name}
              </h6>
              <small
                className="text-white text-opacity-75 d-block"
                style={{ fontSize: "0.75rem" }}
              >
                {user?.email}
              </small>
              <div className="mt-1">
                <span
                  className="badge bg-white bg-opacity-10 text-white fw-normal"
                  style={{ fontSize: "0.7rem" }}
                >
                  Anggota Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow-1 p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 active bg-white bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaCalendarAlt className="me-3" />
                <span>Jadwal Pertemuan</span>
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-primary hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaUsers className="me-3" />
                <span>Anggota</span>
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-primary hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaChartLine className="me-3" />
                <span>Statistik</span>
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-primary hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaFileAlt className="me-3" />
                <span>Laporan</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-primary hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaCog className="me-3" />
                <span>Pengaturan</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-white border-opacity-10">
          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
            onClick={onLogout}
          >
            <FaSignOutAlt />
            <span className="ms-2">Keluar</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .hover-bg-primary:hover {
          background-color: rgba(69, 72, 245, 1) !important;
        }
        .text-accent {
          color: #4cc9f0;
        }
        .nav-link.active {
          background-color: rgba(77, 47, 248, 1) !important;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
