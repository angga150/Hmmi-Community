import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TestApi({ onLogout }) {
  const navigate = useNavigate();
  const [body, setBody] = useState("");

  useEffect(() => {
    const fetchLogout = async () => {
      try {
        const res = await axios.post(
          "/auth/me",
          {}, // body kosong
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(res.data);
        setBody(JSON.stringify(res.data, null, 2));
      } catch (err) {
        console.error(err);
        setBody(
          err.response
            ? JSON.stringify(err.response.data, null, 2)
            : err.message
        );
      }
    };

    fetchLogout();
  }, []);

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <h5 className="text-muted">Response API:</h5>
        <pre className="text-start bg-white p-3 rounded shadow-sm">{body}</pre>
      </div>
    </div>
  );
}

export default TestApi;
