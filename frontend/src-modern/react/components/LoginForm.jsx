import { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin, goRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    // Bentar dulu, aku masih bingung
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email: "test@mail.com",
          password: "123456",
        }
      );

      console.log(response);
      setIsLoading(false);
      setMsg("Login berhasil!");
      onLogin(username);
      // simpan token
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      setIsLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMsg(`Login gagal: ${error.response.data.message}`);
      } else {
        setMsg("Login gagal: Terjadi kesalahan server.");
      }
      console.error("Login error:", error);
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
                alt="Login Illustration"
                className="img-fluid"
              />
            </div>
          </div>

          <div className="col-lg-5 col-md-8 col-sm-10">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">HMMI Community</h2>
                  <p className="text-muted">Please login to your account</p>
                </div>

                <form onSubmit={login}>
                  <div className="mb-4">
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

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 py-3 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                  {msg && (
                    <div
                      className={`mt-3 alert ${msg.includes("berhasil") ? "alert-success" : "alert-danger"} text-center`}
                    >
                      {msg}
                    </div>
                  )}

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Don't have an account?{" "}
                      <a
                        href="/register"
                        className="text-decoration-none fw-semibold"
                      >
                        Sign up
                      </a>
                    </p>
                    <a href="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
