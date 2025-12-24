import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// Komponen Icon dari react-icons
// https://react-icons.github.io/react-icons/icons/fa/
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaGraduationCap,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function RegisterForm({}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [badRequest, setBadRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    setPasswordStrength(calculatePasswordStrength(pass));
  };

  const getStrengthColor = (strength) => {
    if (strength >= 75) return "success";
    if (strength >= 50) return "warning";
    if (strength >= 25) return "info";
    return "danger";
  };

  const getStrengthLabel = (strength) => {
    if (strength >= 75) return "Kuat";
    if (strength >= 50) return "Cukup";
    if (strength >= 25) return "Lemah";
    return "Sangat Lemah";
  };

  const register = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("Password tidak cocok!");
      setBadRequest(true);
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
      });

      setIsLoading(false);

      if (response.data.message === "Register berhasil") {
        setMsg("🎉 Registrasi berhasil!");

        setBadRequest(false);

        // redirect ke login
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setBadRequest(true);
        setMsg("Email sudah terdaftar");
      }
    } catch (error) {
      setIsLoading(false);
      setBadRequest(true);
      if (error.response?.data?.message) {
        setMsg(`Registrasi gagal: ${error.response.data.message}`);
      } else {
        setMsg("Registrasi gagal: Terjadi kesalahan server.");
      }
      console.error("Register error:", error);
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
                <div className="col-lg-6 d-none d-lg-block position-relative bg-secondary">
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(135deg, #3a0ca3 0%, #7209b7 100%)",
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
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <FaGraduationCap className="fs-1 text-accent me-3" />
                        <h1 className="h2 fw-bold mb-0">HMMI Community</h1>
                      </div>

                      <h2 className="h1 fw-bold mb-3">Bergabung dengan UKM</h2>
                      <p className="lead opacity-90 mb-4">
                        Daftarkan diri Anda untuk bergabung dengan UKM
                        Pemrograman dan akses semua fasilitas
                      </p>
                    </div>

                    <div className="mt-3">
                      <h4 className="h5 mb-4 opacity-90">
                        Keuntungan bergabung:
                      </h4>
                      <div className="row g-3">
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-white bg-opacity-10 p-2 me-3">
                              <FaCheckCircle className="text-accent" />
                            </div>
                            <span>Mentor berpengalaman</span>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-white bg-opacity-10 p-2 me-3">
                              <FaCheckCircle className="text-accent" />
                            </div>
                            <span>Materi lengkap</span>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-white bg-opacity-10 p-2 me-3">
                              <FaCheckCircle className="text-accent" />
                            </div>
                            <span>Proyek nyata</span>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-white bg-opacity-10 p-2 me-3">
                              <FaCheckCircle className="text-accent" />
                            </div>
                            <span>Sertifikat</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4">
                      <div className="progress mb-2" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-accent"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <p className="small mb-0 opacity-90">
                        Proses pendaftaran hanya membutuhkan 2 menit
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="col-lg-6">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
                    <div className="text-center mb-4">
                      <h2 className="h3 fw-bold text-dark mb-2">
                        Buat Akun Baru
                      </h2>
                      <p className="text-muted mb-0">
                        Isi data diri Anda untuk mendaftar
                      </p>
                    </div>

                    <form onSubmit={register}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-2">
                          Username
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaUser className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 ps-2"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                              borderColor: "#e9ecef",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
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
                            placeholder="Enter your email"
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
                          Email akan digunakan untuk login
                        </div>
                      </div>

                      <div className="mb-3">
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
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
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

                        <div className="mt-2">
                          <div className="d-flex justify-content-between mb-1">
                            <small>Kekuatan password:</small>
                            <small
                              className={`text-${getStrengthColor(passwordStrength)} fw-bold`}
                            >
                              {getStrengthLabel(passwordStrength)}
                            </small>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div
                              className={`progress-bar bg-${getStrengthColor(passwordStrength)}`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark mb-2">
                          Confirm Password
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaLock className="text-muted" />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control border-start-0 border-end-0 ps-2"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={{
                              cursor: "pointer",
                              borderColor: "#e9ecef",
                            }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      {msg && (
                        <div
                          className={`alert ${
                            badRequest ? "alert-danger" : "alert-success"
                          } mb-4 d-flex align-items-center`}
                          // style={{
                          //   borderLeft: `4px solid ${badRequest ? "#dc3545" : "#28a745"}`,
                          //   backgroundColor: badRequest
                          //     ? "rgba(220, 53, 69, 0.1)"
                          //     : "rgba(40, 167, 69, 0.1)",
                          // }}
                          // udah aku buat custom CSS di bawah biar gak ribet
                        >
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
                        //   background:
                        //     "linear-gradient(to right, #3a0ca3, #7209b7)",
                        //   border: "none",
                        //   transition: "all 0.3s ease",
                        // }}
                        // onMouseOver={(e) => {
                        //   e.target.style.transform = "translateY(-2px)";
                        //   e.target.style.boxShadow =
                        //     "0 5px 15px rgba(58, 12, 163, 0.3)";
                        // }}
                        // onMouseOut={(e) => {
                        //   e.target.style.transform = "translateY(0)";
                        //   e.target.style.boxShadow = "none";
                        // }}
                        // udah aku buat custom CSS di bawah biar gak ribet pakai javascript
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <FaUserPlus className="me-2" />
                            Daftar Sekarang
                          </>
                        )}
                      </button>

                      <div className="text-center mt-4">
                        <p className="text-muted mb-0">
                          Sudah punya akun?{" "}
                          <Link
                            to="/login"
                            className="text-decoration-none fw-semibold text-primary"
                          >
                            Masuk di sini
                          </Link>
                        </p>
                      </div>
                    </form>

                    <div className="mt-4 pt-3 text-center">
                      <p className="text-muted small">
                        Butuh bantuan?{" "}
                        <a
                          href="mailto:admin@hmmi-community.ac.id"
                          className="text-decoration-none"
                        >
                          Hubungi Admin
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
          --secondary: #7209b7;
          --accent: #4cc9f0;
        }

        .bg-secondary {
          background-color: var(--secondary) !important;
        }

        .bg-accent {
          background-color: var(--accent) !important;
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

        .rounded-circle.bg-primary {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-success {
          border-left: 4px solid #28a745 !important;
          background-color: rgba(40, 167, 69, 0.1) !important;
        }
        .alert-danger {
          border-left: 4px solid #dc3545 !important;
          background-color: rgba(220, 53, 69, 0.1) !important;
        }

        .btn-primary {
          background: linear-gradient(
            to right,
            var(--secondary),
            var(--primary)
          ) !important;
          border: none !important;
          transition: all 0.3s ease !important;
        }
        .btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3) !important;
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

export default RegisterForm;
