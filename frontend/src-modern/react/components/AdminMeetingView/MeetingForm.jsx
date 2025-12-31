import React, { useState, useEffect } from "react";
import { FaTimes, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

const MeetingForm = ({ meeting, onSubmit, onClose, isEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meeting_date: "",
    place: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (meeting) {
      // Format date for datetime-local input
      const dateTime = meeting.meeting_date.replace(" ", "T");
      setFormData({
        title: meeting.title,
        description: meeting.description,
        meeting_date: dateTime,
        place: meeting.place,
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
      // Format date for API
      const submitData = {
        ...formData,
        meeting_date: formData.meeting_date.replace("T", " "),
      };

      onSubmit(submitData);
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
              {isEdit ? "Edit Meeting" : "Buat Meeting Baru"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
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
                    <div className="invalid-feedback">{errors.description}</div>
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
              </div>
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
                {isEdit ? "Update Meeting" : "Buat Meeting"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingForm;
