import { useState } from "react";
import axios from "axios";

function RegisterForm({ onRegister, goLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    try {
      const response = await axios.post("/auth/register", {
        username: username,
        email: email,
        password: password,
      });
      console.log(response);
      setIsLoading(false);
      if (response.data.message == "Register berhasil") {
        setMsg("Registrasi berhasil! Silakan login.");
        onRegister(username);
      } else {
        setMsg("Email sudah terdaftar");
      }
    } catch (error) {
      setIsLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMsg(`Registrasi gagal: ${error.response.data.message}`);
      } else {
        setMsg("Registrasi gagal: Terjadi kesalahan server.");
      }
      console.error("Register error:", error);
    }
  };
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 d-none d-lg-block">
            <div className="text-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                alt="Register Illustration"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="col-lg-5 col-md-8 col-sm-10">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">HMMI Community</h2>
                  <h4 className="fw-normal mb-4">Create your account</h4>
                </div>
                <form onSubmit={register}>
                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="form-label fw-semibold"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {msg && <div className="alert alert-info mt-3">{msg}</div>}
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg rounded-pill"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Register"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-muted">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-decoration-none text-primary fw-semibold"
                  onClick={goLogin}
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
