import { Link } from "react-router-dom";
import { FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import SidebarDashboard from "./SidebarDashboard"; // Import komponen
import AdminMenu from "./SidebarAdmin"; // Import komponen
import ToolsMenu from "./SidebarTools"; // Import komponen

function Sidebar({
  user,
  sidebarActive,
  setSidebarActive,
  collapsed,
  onToggle,
  onLogout,
}) {
  return (
    <>
      {/* Overlay untuk mobile */}
      {!collapsed && (
        <div
          className="d-lg-none position-fixed vh-100 vw-100 bg-dark bg-opacity-50"
          style={{ zIndex: 999 }}
          onClick={onToggle}
        />
      )}

      <div
        className="d-flex flex-column p-0 text-white position-fixed vh-100"
        style={{
          background: "#101727",
          zIndex: 1000,
          width: "250px",
          transform: collapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Scrollable container */}
        <div className="d-flex flex-column h-100 overflow-hidden">
          {/* Fixed header section */}
          <div style={{ flexShrink: 0 }}>
            {/* Sidebar Header */}
            <div className="p-3 border-bottom border-white border-opacity-10">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FaCalendarAlt className="fs-3 text-accent" />
                  <span className="ms-2 fw-bold">HMMI Community</span>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-3 border-bottom border-white border-opacity-10">
              <div className="d-flex align-items-center">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.username}&background=fff&color=4361ee`
                  }
                  alt={user?.username}
                  className="rounded-circle border border-2 border-white border-opacity-25"
                  style={{ width: "45px", height: "45px", objectFit: "cover" }}
                />

                <div className="ms-3">
                  <h6 className="mb-0 fw-semibold">{user?.username}</h6>
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
                      {user.role == "admin" ? "Administrator" : "Anggota Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable navigation area */}
          <div
            className="flex-grow-1 overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Custom scrollbar styling */}
            <style jsx global>{`
              .overflow-y-auto::-webkit-scrollbar {
                width: 4px;
              }
              .overflow-y-auto::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 2px;
              }
              .overflow-y-auto::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
              }
              .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
            `}</style>

            <nav className="p-3">
              <ul className="nav flex-column">
                {/* Main Navigation */}
                {/* Dashboard Menu Component */}
                <li className="nav-item mb-2">
                  <SidebarDashboard
                    sidebarActive={sidebarActive}
                    setSidebarActive={setSidebarActive}
                  />
                </li>

                {/* Separator */}

                {user.role === "admin" ? (
                  <>
                    <div className="my-2 border-top border-white border-opacity-10"></div>
                    <li className="nav-item mb-2">
                      <AdminMenu
                        sidebarActive={sidebarActive}
                        setSidebarActive={setSidebarActive}
                      />
                    </li>
                  </>
                ) : (
                  <></>
                )}
                {/* Separator */}
                <div className="my-2 border-top border-white border-opacity-10"></div>
                {/* Tools Menu Component */}
                <li className="nav-item mb-2">
                  <ToolsMenu
                    sidebarActive={sidebarActive}
                    setSidebarActive={setSidebarActive}
                  />
                </li>

                <div className="my-2 border-top border-white border-opacity-10"></div>
                <li className="nav-item mb-2">
                  <Link
                    className={`nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-primary ${sidebarActive == "settings" ? "active" : ""} rounded py-2`}
                    onClick={() => setSidebarActive("settings")}
                  >
                    <FaCog className="me-3" />
                    <span>Pengaturan</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Fixed footer section */}
          <div style={{ flexShrink: 0 }}>
            {/* Logout Button */}
            <div className="p-3 border-top border-white border-opacity-10">
              <Link
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                to="/logout"
              >
                <FaSignOutAlt />
                <span className="ms-2">Keluar</span>
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .hover-bg-primary:hover {
            background-color: rgba(255, 255, 255, 0.07) !important;
          }
          .text-accent {
            color: #4cc9f0;
          }
          .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2) !important;
          }
        `}</style>
      </div>
    </>
  );
}

export default Sidebar;
