import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Attendance({ token, setAttendanceCode, setSidebarActive }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      // simpan ke state atau localStorage
      setAttendanceCode(code);
      localStorage.setItem("attendance_code", code);
    }

    // redirect sesuai login
    if (token) {
      setSidebarActive("attendance-user");
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return null; // tidak render apa-apa
}

export default Attendance;
