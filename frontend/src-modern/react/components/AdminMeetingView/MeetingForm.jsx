import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendar,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";

const MeetingForm = ({ meeting, onSubmit, onClose, isEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meeting_date: "",
    place: "",
    status: "upcoming",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (meeting) {
      // Format date for datetime-local input
      const date = new Date(meeting.meeting_date);
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - timezoneOffset);
      const dateTime = localDate.toISOString().slice(0, 16);

      setFormData({
        title: meeting.title || "",
        description: meeting.description || "",
        meeting_date: dateTime,
        place: meeting.place || "",
        status: meeting.status || "upcoming",
      });
    }
  }, [meeting]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Judul harus diisi";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi harus diisi";
    if (!formData.meeting_date)
      newErrors.meeting_date = "Tanggal meeting harus diisi";
    if (!formData.place.trim()) newErrors.place = "Tempat harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Sesuai backend, saat edit hanya bisa update status
      if (isEdit) {
        const submitData = { status: formData.status };
        onSubmit(submitData);
      } else {
        // Format date for API (YYYY-MM-DD HH:MM:SS)
        const date = new Date(formData.meeting_date);
        const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

        const submitData = {
          title: formData.title,
          description: formData.description,
          meeting_date: formattedDate,
          place: formData.place,
          status: formData.status,
        };

        onSubmit(submitData);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEdit ? "Edit Status Meeting" : "Buat Meeting Baru"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {isEdit ? (
                // Edit Mode: Hanya tampilkan status
                <div className="row g-3">
                  <div className="col-12">
                    <h6>Informasi Meeting</h6>
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <p>
                          <strong>Judul:</strong> {formData.title}
                        </p>
                        <p>
                          <strong>Deskripsi:</strong> {formData.description}
                        </p>
                        <p>
                          <strong>Tanggal:</strong>{" "}
                          {new Date(formData.meeting_date).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                        <p>
                          <strong>Tempat:</strong> {formData.place}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Status Meeting *</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <small className="text-muted">
                      <FaInfoCircle className="me-1" />
                      Hanya status yang bisa diubah sesuai dengan backend
                    </small>
                  </div>
                </div>
              ) : (
                // Create Mode: Tampilkan semua field
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Judul Meeting *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Masukkan judul meeting"
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Deskripsi *</label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Masukkan deskripsi meeting"
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      <FaCalendar className="me-2" />
                      Tanggal & Waktu *
                    </label>
                    <input
                      type="datetime-local"
                      className={`form-control ${errors.meeting_date ? "is-invalid" : ""}`}
                      name="meeting_date"
                      value={formData.meeting_date}
                      onChange={handleChange}
                    />
                    {errors.meeting_date && (
                      <div className="invalid-feedback">
                        {errors.meeting_date}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-2" />
                      Tempat *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.place ? "is-invalid" : ""}`}
                      name="place"
                      value={formData.place}
                      onChange={handleChange}
                      placeholder="Contoh: Lab Komputer 1"
                    />
                    {errors.place && (
                      <div className="invalid-feedback">{errors.place}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <input type="hidden" name="status" value="upcoming" />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <FaTimes className="me-2" />
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Update Status" : "Buat Meeting"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingForm;
