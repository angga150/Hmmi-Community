import { useEffect, useState } from "react";
import axios from "axios";

function TestApi() {
  /* =======================
     STATE
  ======================= */
  const [mode, setMode] = useState("GET"); // DEFAULT POST
  const [getRes, setGetRes] = useState(null);
  const [postRes, setPostRes] = useState(null);
  const [putRes, setPutRes] = useState(null);
  const [deleteRes, setDeleteRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meetingId, setMeetingId] = useState(""); // Untuk PUT dan DELETE
  const [selectedMeeting, setSelectedMeeting] = useState(null); // Untuk preview data meeting

  /* =======================
     CONFIG
  ======================= */
  const BASE_URL = "/api/attendance/sessions";

  const HEADERS = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
  // Sample POST data
  const POST_BODY = {};
  // Sample PUT data
  const PUT_BODY = {
    status: "completed",
  };

  /* =======================
     REQUEST HANDLERS
  ======================= */
  const runGet = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL, { headers: HEADERS });
      setGetRes(res.data);
      // Set first meeting as selected for PUT/DELETE demo
      if (res.data.data && res.data.data.length > 0) {
        setSelectedMeeting(res.data.data[0]);
        setMeetingId(res.data.data[0].id.toString());
      }
    } catch (err) {
      setGetRes(err.response ? err.response.data : { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const runPost = async () => {
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL, POST_BODY, {
        headers: HEADERS,
      });
      setPostRes(res.data);
    } catch (err) {
      setPostRes(err.response ? err.response.data : { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const runPut = async () => {
    if (!meetingId) {
      setPutRes({ error: "Please enter a meeting ID" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/${meetingId}`, PUT_BODY, {
        headers: HEADERS,
      });
      setPutRes(res.data);
    } catch (err) {
      setPutRes(err.response ? err.response.data : { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const runDelete = async () => {
    if (!meetingId) {
      setDeleteRes({ error: "Please enter a meeting ID" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/${meetingId}`, {
        headers: HEADERS,
      });
      setDeleteRes(res.data);
    } catch (err) {
      setDeleteRes(err.response ? err.response.data : { error: err.message });
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
     UTILITY FUNCTIONS
  ======================= */
  const getMeetingsList = () => {
    if (!getRes || !getRes.data) return null;

    return (
      <div className="mt-3">
        <h6>Available Meetings (Select for PUT/DELETE):</h6>
        <div className="list-group">
          {getRes.data.map((meeting) => (
            <button
              key={meeting.id}
              type="button"
              className={`list-group-item list-group-item-action ${
                selectedMeeting?.id === meeting.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedMeeting(meeting);
                setMeetingId(meeting.id.toString());
              }}
            >
              <div>
                <strong>ID: {meeting.id}</strong> - {meeting.title}
                <br />
                <small
                  className={
                    selectedMeeting?.id === meeting.id
                      ? "text-light"
                      : "text-muted"
                  }
                >
                  Status: {meeting.status} | Date:{" "}
                  {meeting.meeting_date_formatted}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="vh-100 vw-100 bg-light p-4">
      <div className="container">
        <h3 className="text-center mb-4">
          API Request Debugger - Meetings CRUD
        </h3>

        {/* ================= BUTTONS ================= */}
        <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
          <button
            className={`btn ${
              mode === "POST" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => {
              setMode("POST");
              if (!postRes) runPost();
            }}
          >
            POST (Create)
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
            GET (Read)
          </button>

          <button
            className={`btn ${
              mode === "PUT" ? "btn-warning" : "btn-outline-warning"
            }`}
            onClick={() => {
              setMode("PUT");
            }}
          >
            PUT (Update)
          </button>

          <button
            className={`btn ${
              mode === "DELETE" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => {
              setMode("DELETE");
            }}
          >
            DELETE
          </button>
        </div>

        {/* ================= ID INPUT FOR PUT/DELETE ================= */}
        {(mode === "PUT" || mode === "DELETE") && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Meeting Selection</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="meetingId" className="form-label">
                    Meeting ID
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="meetingId"
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      placeholder="Enter meeting ID"
                    />
                    {mode === "PUT" ? (
                      <button
                        className="btn btn-warning"
                        onClick={runPut}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Meeting"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger"
                        onClick={runDelete}
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete Meeting"}
                      </button>
                    )}
                  </div>
                  <div className="form-text">
                    Enter meeting ID manually or select from list below
                  </div>
                </div>
                <div className="col-md-6">
                  {selectedMeeting && (
                    <div className="alert alert-info">
                      <strong>Selected Meeting:</strong>
                      <div className="mt-2">
                        <strong>ID:</strong> {selectedMeeting.id}
                        <br />
                        <strong>Title:</strong> {selectedMeeting.title}
                        <br />
                        <strong>Status:</strong> {selectedMeeting.status}
                        <br />
                        <strong>Place:</strong> {selectedMeeting.place}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Show meetings list if GET data is available */}
              {getRes &&
                getRes.data &&
                getRes.data.length > 0 &&
                getMeetingsList()}
              {!getRes && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={runGet}
                >
                  Load Meetings List
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= POST ================= */}
        {mode === "POST" && (
          <div>
            <h4 className="text-success">POST Request - Create Meeting</h4>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Target URL</h6>
                <pre className="bg-white p-2 rounded">{BASE_URL}</pre>
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-success mt-4"
                  onClick={runPost}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Execute POST"}
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Request Headers</h6>
                <pre className="bg-white p-3 rounded">
                  {JSON.stringify(HEADERS, null, 2)}
                </pre>
              </div>
              <div className="col-md-6">
                <h6>Request Body</h6>
                <pre className="bg-white p-3 rounded">
                  {JSON.stringify(POST_BODY, null, 2)}
                </pre>
              </div>
            </div>

            <h6>Response POST</h6>
            <pre
              className="bg-white p-3 rounded shadow-sm"
              style={{ minHeight: "200px" }}
            >
              {loading ? "Loading..." : JSON.stringify(postRes, null, 2)}
            </pre>
          </div>
        )}

        {/* ================= GET ================= */}
        {mode === "GET" && (
          <div>
            <h4 className="text-primary">GET Request - Read All Meetings</h4>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Target URL</h6>
                <pre className="bg-white p-2 rounded">{BASE_URL}</pre>
              </div>
              <div className="col-md-6">
                <div className="btn-group mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={runGet}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Execute GET"}
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      const withFilter = `${BASE_URL}?status=upcoming`;
                      setGetRes((prev) => ({
                        ...prev,
                        filtered_url: withFilter,
                      }));
                      alert(
                        `Filter URL: ${withFilter}\n\nAvailable filters:\n?status=upcoming\n?date=2025-01-15\n?upcoming=true`
                      );
                    }}
                  >
                    Show Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Request Headers</h6>
                <pre className="bg-white p-3 rounded">
                  {JSON.stringify(HEADERS, null, 2)}
                </pre>
              </div>
              <div className="col-md-6">
                <h6>Filter Examples</h6>
                <div className="bg-white p-3 rounded">
                  <code className="d-block mb-2">
                    {BASE_URL}?status=upcoming
                  </code>
                  <code className="d-block mb-2">
                    {BASE_URL}?date=2025-01-15
                  </code>
                  <code className="d-block">{BASE_URL}?upcoming=true</code>
                </div>
              </div>
            </div>

            <h6>Response GET</h6>
            <pre
              className="bg-white p-3 rounded shadow-sm"
              style={{ minHeight: "300px" }}
            >
              {loading ? "Loading..." : JSON.stringify(getRes, null, 2)}
            </pre>
          </div>
        )}

        {/* ================= PUT ================= */}
        {mode === "PUT" && (
          <div>
            <h4 className="text-warning">PUT Request - Update Meeting</h4>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Target URL</h6>
                <pre className="bg-white p-2 rounded">{`${BASE_URL}/{id}`}</pre>
                <div className="mt-2">
                  <strong>Current URL:</strong>
                  <code className="ms-2">
                    {meetingId ? `${BASE_URL}/${meetingId}` : "Enter ID above"}
                  </code>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Request Headers</h6>
                <pre className="bg-white p-3 rounded">
                  {JSON.stringify(HEADERS, null, 2)}
                </pre>
              </div>
              <div className="col-md-6">
                <h6>Request Body</h6>
                <pre className="bg-white p-3 rounded">
                  {JSON.stringify(PUT_BODY, null, 2)}
                </pre>
                <div className="form-text">
                  This will update the meeting status to "completed"
                </div>
              </div>
            </div>

            <h6>Response PUT</h6>
            <pre
              className="bg-white p-3 rounded shadow-sm"
              style={{ minHeight: "200px" }}
            >
              {loading ? "Loading..." : JSON.stringify(putRes, null, 2)}
            </pre>
          </div>
        )}

        {/* ================= DELETE ================= */}
        {mode === "DELETE" && (
          <div>
            <h4 className="text-danger">DELETE Request - Delete Meeting</h4>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Target URL</h6>
                <pre className="bg-white p-2 rounded">{`${BASE_URL}/{id}`}</pre>
                <div className="mt-2">
                  <strong>Current URL:</strong>
                  <code className="ms-2">
                    {meetingId ? `${BASE_URL}/${meetingId}` : "Enter ID above"}
                  </code>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Request Headers</h6>
                <pre className="bg-white p-3 rounded">
                  {JSON.stringify(HEADERS, null, 2)}
                </pre>
              </div>
              <div className="col-md-6">
                <h6>Request Body</h6>
                <pre className="bg-white p-3 rounded text-muted">
                  (DELETE request tidak memiliki body)
                </pre>
                <div className="alert alert-warning">
                  <strong>Warning:</strong> This action cannot be undone!
                </div>
              </div>
            </div>

            <h6>Response DELETE</h6>
            <pre
              className="bg-white p-3 rounded shadow-sm"
              style={{ minHeight: "200px" }}
            >
              {loading ? "Loading..." : JSON.stringify(deleteRes, null, 2)}
            </pre>
          </div>
        )}

        {/* ================= SUMMARY ================= */}
        <div className="mt-4 pt-4 border-top">
          <h5>API Endpoints Summary</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
                <th>Auth Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="badge bg-success">POST</span>
                </td>
                <td>
                  <code>/api/meetings</code>
                </td>
                <td>Create new meeting</td>
                <td className="text-success">✓ Admin Only</td>
              </tr>
              <tr>
                <td>
                  <span className="badge bg-primary">GET</span>
                </td>
                <td>
                  <code>/api/meetings</code>
                </td>
                <td>Get all meetings (with filters)</td>
                <td className="text-secondary">✓ Any Auth</td>
              </tr>
              <tr>
                <td>
                  <span className="badge bg-warning">PUT</span>
                </td>
                <td>
                  <code>/api/meetings/{"{id}"}</code>
                </td>
                <td>Update meeting status</td>
                <td className="text-success">✓ Admin Only</td>
              </tr>
              <tr>
                <td>
                  <span className="badge bg-danger">DELETE</span>
                </td>
                <td>
                  <code>/api/meetings/{"{id}"}</code>
                </td>
                <td>Delete meeting</td>
                <td className="text-success">✓ Admin Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TestApi;
