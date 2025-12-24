import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
// Ini Komponen Icon dari react-icons
// https://react-icons.github.io/react-icons/icons/fa/
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function LoginForm({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      setIsLoading(false);
      setMsg("Login berhasil!");

      // simpan token
      localStorage.setItem("token", response.data.token);

      onLogin(response.data.token);

      // pindah ke dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message) {
        setMsg(`Login gagal: ${error.response.data.message}`);
      } else {
        setMsg("Login gagal: Terjadi kesalahan server.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-10 col-xl-12 col-lg-12">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="row g-0">
                {/* Left Panel */}
                <div className="col-lg-6 d-none d-lg-block position-relative bg-primary">
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)",
                      zIndex: 1,
                    }}
                  >
                    {/* Decorative circles */}
                    <div
                      className="position-absolute"
                      style={{
                        top: "-25%",
                        right: "-10%",
                        width: "300px",
                        height: "300px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <div
                      className="position-absolute"
                      style={{
                        bottom: "-15%",
                        left: "-5%",
                        width: "200px",
                        height: "200px",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </div>

                  <div className="position-relative z-2 h-100 p-5 d-flex flex-column justify-content-center text-white">
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-4">
                        <FaGraduationCap className="fs-1 text-accent me-3" />
                        <h1 className="h2 fw-bold mb-0">HMMI Community</h1>
                      </div>

                      <h2 className="h1 fw-bold mb-3">UKM Pemrograman</h2>
                      <p className="lead opacity-90 mb-4">
                        Silahkan login untuk melakukan kegiatan UKM anda
                      </p>
                    </div>

                    <div className="mt-3">
                      <h4 className="h5 mb-3 opacity-90">
                        Yang akan dipelajari:
                      </h4>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <FaCheckCircle className="text-accent me-2" />
                          Belajar HTML
                        </li>
                        <li className="mb-2">
                          <FaCheckCircle className="text-accent me-2" />
                          Belajar CSS
                        </li>
                        <li className="mb-2">
                          <FaCheckCircle className="text-accent me-2" />
                          Belajar JavaScript
                        </li>
                        <li className="mb-2">
                          <FaCheckCircle className="text-accent me-2" />
                          Belajar PHP
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="col-lg-6">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
                    <div className="text-center mb-4">
                      <h2 className="h3 fw-bold text-dark mb-2">
                        Masuk dengan akun kamu
                      </h2>
                      <p className="text-muted mb-0">
                        Masukkan akun yang sudah terdaftar untuk masuk
                      </p>
                    </div>

                    <form onSubmit={login}>
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark mb-2">
                          Email Address
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaEnvelope className="text-muted" />
                          </span>
                          <input
                            type="email"
                            className="form-control border-start-0 ps-2"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                              borderColor: "#e9ecef",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </div>
                        <div className="form-text">
                          Masukkan email yang terdaftar
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark mb-2">
                          Password
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaLock className="text-muted" />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control border-start-0 border-end-0 ps-2"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                              borderColor: "#e9ecef",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                          <button
                            type="button"
                            className="input-group-text bg-light border-start-0"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              cursor: "pointer",
                              borderColor: "#e9ecef",
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      {msg && (
                        <div
                          className={`alert ${
                            msg.includes("berhasil")
                              ? "alert-success"
                              : "alert-danger"
                          } mb-4 d-flex align-items-center`}
                          // style={{
                          //   borderLeft: `4px solid ${msg.includes("berhasil") ? "#28a745" : "#dc3545"}`,
                          //   backgroundColor: msg.includes("berhasil")
                          //     ? "rgba(40, 167, 69, 0.1)"
                          //     : "rgba(220, 53, 69, 0.1)",
                          // }}
                          // udah aku buat custom CSS di bawah biar gak ribet
                        >
                          {/* Ini Icon */}
                          {msg.includes("berhasil") ? (
                            <FaCheckCircle className="me-2 text-success" />
                          ) : (
                            <FaExclamationCircle className="me-2 text-danger" />
                          )}
                          {msg}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 py-3 fw-bold mb-3"
                        disabled={isLoading}
                        // style={{
                        //   background: "#4361ee",
                        //   border: "none",
                        //   transition: "all 0.3s ease",
                        // }}
                        // onMouseOver={(e) => {
                        //   e.target.style.background = "#3a0ca3";
                        //   e.target.style.transform = "translateY(-2px)";
                        //   e.target.style.boxShadow =
                        //     "0 5px 15px rgba(67, 97, 238, 0.3)";
                        // }}
                        // onMouseOut={(e) => {
                        //   e.target.style.background = "#4361ee";
                        //   e.target.style.transform = "translateY(0)";
                        //   e.target.style.boxShadow = "none";
                        // }}
                        // Udah aku buat custom CSS di bawah biar gak ribet
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <FaSignInAlt className="me-2" />
                            Sign In
                          </>
                        )}
                      </button>

                      <div className="text-center mt-4">
                        <p className="text-muted mb-0">
                          Tidak punya akun?{" "}
                          <Link
                            to="/register"
                            className="text-decoration-none fw-semibold text-primary"
                          >
                            Daftar di sini
                          </Link>
                        </p>
                        <p className="text-muted mt-2">
                          Lupa password?{" "}
                          <Link
                            to="/forgot-password"
                            className="text-decoration-none fw-semibold text-primary"
                          >
                            Reset password
                          </Link>
                        </p>
                      </div>
                    </form>

                    <div className="mt-3 text-center">
                      <p className="text-muted small">
                        Tidak punya akun?{" "}
                        <a
                          href="mailto:admin@hmmi-community.ac.id"
                          className="text-decoration-none"
                        >
                          Kontak Administrator
                        </a>
                        <br />© {new Date().getFullYear()} HMMI Community - UKM
                        Pemrograman.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS untuk custom styling */}
      <style jsx>{`
        :root {
          --primary: #4361ee;
          --secondary: #3a0ca3;
          --accent: #4cc9f0;
        }

        .alert-success {
          border-left: 4px solid #28a745 !important;
          background-color: rgba(40, 167, 69, 0.1) !important;
        }
        .alert-danger {
          border-left: 4px solid #dc3545 !important;
          background-color: rgba(220, 53, 69, 0.1) !important;
        }

        .bg-primary {
          background-color: var(--primary) !important;
        }

        .text-accent {
          color: var(--accent) !important;
        }

        .card {
          border-radius: 12px !important;
        }

        .form-control:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1) !important;
          background-color: white !important;
        }

        .input-group-text {
          background-color: #f8f9fa !important;
          border-color: #e9ecef !important;
        }

        .list-unstyled li {
          padding: 5px 0;
          font-size: 1rem;
        }

        .btn-primary {
          background: var(--primary) !important;
          border: none !important;
          transition: all 0.3s ease !important;
        }
        .btn-primary:hover {
          background: var(--secondary) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(58, 12, 163, 0.3) !important;
        }

        @media (max-width: 991.98px) {
          .card {
            border-radius: 8px !important;
          }

          .p-md-5 {
            padding: 2rem !important;
          }
        }

        @media (max-width: 575.98px) {
          .p-md-5 {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginForm;
