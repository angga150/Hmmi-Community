import { FaBars, FaPlus } from "react-icons/fa";

function Navbar({
  collapsed,
  onToggle,
  searchTerm,
  onSearchChange,
  onAddMeeting,
}) {
  return (
    <nav
      className="navbar navbar-light bg-white shadow-sm fixed-top"
      style={{
        marginLeft: collapsed ? "70px" : "250px",
        transition: "margin-left 0.3s ease",
        zIndex: 999,
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center w-100">
          {/* Sidebar Toggle for Mobile */}
          <button className="btn d-lg-none me-2" onClick={onToggle}>
            <FaBars />
          </button>

          {/* Page Title */}
          <div className="d-none d-lg-block">
            <h1 className="h4 fw-bold mb-0">Dashboard</h1>
          </div>

          <div className="ms-auto d-flex align-items-center gap-2">
            {/* Add Meeting Button */}
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={onAddMeeting}
            >
              <FaPlus className="me-1" />
              <span className="d-none d-md-inline">Tambah Pertemuan</span>
            </button>

            {/* User Profile (Small) */}
            <div className="dropdown">
              <button
                className="btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src="https://ui-avatars.com/api/?name=User&background=4361ee&color=fff"
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "32px", height: "32px" }}
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    Profil
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Pengaturan
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item text-danger" href="#">
                    Keluar
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
