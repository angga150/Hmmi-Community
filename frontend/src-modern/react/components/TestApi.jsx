import { useEffect, useState } from "react";
import axios from "axios";

function TestApi() {
  /* =======================
     STATE
  ======================= */
  const [mode, setMode] = useState("POST"); // DEFAULT POST
  const [getRes, setGetRes] = useState(null);
  const [postRes, setPostRes] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =======================
     CONFIG
  ======================= */
  const GET_URL = "/auth/me";
  const POST_URL = GET_URL;

  const HEADERS = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const POST_BODY = {};

  /* =======================
     REQUEST HANDLER
  ======================= */
  const runGet = async () => {
    setLoading(true);
    try {
      const res = await axios.get(GET_URL, { headers: HEADERS });
      setGetRes(res.data);
    } catch (err) {
      setGetRes(err.response ? err.response.data : { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const runPost = async () => {
    setLoading(true);
    try {
      const res = await axios.post(POST_URL, POST_BODY, {
        headers: HEADERS,
      });
      setPostRes(res.data);
    } catch (err) {
      setPostRes(err.response ? err.response.data : { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     DEFAULT AUTO RUN (POST)
  ======================= */
  useEffect(() => {
    runPost();
  }, []);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="vh-100 vw-100 bg-light p-4">
      <div className="container">
        <h3 className="text-center mb-4">API Request Debugger</h3>

        {/* ================= BUTTONS ================= */}
        <div className="d-flex justify-content-center gap-2 mb-4">
          <button
            className={`btn ${
              mode === "POST" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => {
              setMode("POST");
              if (!postRes) runPost();
            }}
          >
            POST
          </button>

          <button
            className={`btn ${
              mode === "GET" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              setMode("GET");
              if (!getRes) runGet();
            }}
          >
            GET
          </button>
        </div>

        {/* ================= POST ================= */}
        {mode === "POST" && (
          <div>
            <h4 className="text-success">POST Request</h4>

            <h6>Target URL</h6>
            <pre className="bg-white p-2 rounded">{POST_URL}</pre>

            <h6>Request Headers</h6>
            <pre className="bg-white p-3 rounded">
              {JSON.stringify(HEADERS, null, 2)}
            </pre>

            <h6>Request Body</h6>
            <pre className="bg-white p-3 rounded">
              {JSON.stringify(POST_BODY, null, 2)}
            </pre>

            <h6>Response POST</h6>
            <pre className="bg-white p-3 rounded shadow-sm">
              {loading ? "Loading..." : JSON.stringify(postRes, null, 2)}
            </pre>
          </div>
        )}

        {/* ================= GET ================= */}
        {mode === "GET" && (
          <div>
            <h4 className="text-primary">GET Request</h4>

            <h6>Target URL</h6>
            <pre className="bg-white p-2 rounded">{GET_URL}</pre>

            <h6>Request Headers</h6>
            <pre className="bg-white p-3 rounded">
              {JSON.stringify(HEADERS, null, 2)}
            </pre>

            <h6>Request Body</h6>
            <pre className="bg-white p-3 rounded text-muted">
              (GET request tidak memiliki body)
            </pre>

            <h6>Response GET</h6>
            <pre className="bg-white p-3 rounded shadow-sm">
              {loading ? "Loading..." : JSON.stringify(getRes, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestApi;
