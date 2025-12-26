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
      className={`col-lg-2 col-xl-2 ${collapsed ? "col-1" : "col-md-3"} d-flex flex-column p-0 bg-primary text-white position-fixed vh-100`}
      style={{
        background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)",
        zIndex: 1000,
        width: collapsed ? "70px" : "250px",
        transition: "width 0.3s ease",
      }}
    >
      <div className="d-flex flex-column h-100">
        {/* Sidebar Header */}
        <div className="p-3 border-bottom border-white border-opacity-10">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <FaCalendarAlt
                className={`${collapsed ? "fs-4" : "fs-3"} text-accent`}
              />
              {!collapsed && (
                <span className="ms-2 fw-bold">HMMI Schedule</span>
              )}
            </div>
            <button
              className="btn btn-sm btn-outline-light border-0 p-1"
              onClick={onToggle}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FaChevronRight size={14} />
              ) : (
                <FaChevronLeft size={14} />
              )}
            </button>
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
            {!collapsed && (
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
            )}
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
                <FaCalendarAlt className={collapsed ? "mx-auto" : "me-3"} />
                {!collapsed && <span>Jadwal Pertemuan</span>}
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-light hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaUsers className={collapsed ? "mx-auto" : "me-3"} />
                {!collapsed && <span>Anggota</span>}
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-light hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaChartLine className={collapsed ? "mx-auto" : "me-3"} />
                {!collapsed && <span>Statistik</span>}
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-light hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaFileAlt className={collapsed ? "mx-auto" : "me-3"} />
                {!collapsed && <span>Laporan</span>}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-light hover-bg-opacity-10 rounded py-2"
                href="#"
              >
                <FaCog className={collapsed ? "mx-auto" : "me-3"} />
                {!collapsed && <span>Pengaturan</span>}
              </a>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-white border-opacity-10">
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
            onClick={onLogout}
          >
            <FaSignOutAlt />
            {!collapsed && <span className="ms-2">Keluar</span>}
          </button>
        </div>
      </div>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .text-accent {
          color: #4cc9f0;
        }
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
