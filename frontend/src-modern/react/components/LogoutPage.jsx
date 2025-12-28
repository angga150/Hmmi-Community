import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout();

    navigate("/login", { replace: true });
  }, [onLogout, navigate]);

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="text-muted">Sedang logout...</h3>
      </div>
    </div>
  );
}

export default LogoutPage;
