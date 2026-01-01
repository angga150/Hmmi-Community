import React, { useState } from "react";
import { FaTimes, FaCalendar, FaUsers, FaClock, FaTag } from "react-icons/fa";

const SessionForm = ({ events, meetings, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    event_id: "",
    meeting_id: "",
    event_date: new Date().toISOString().split("T")[0],
    max_attendees: "",
    expires_in_hours: 24,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul sesi harus diisi";
    }

    if (!formData.event_date) {
      newErrors.event_date = "Tanggal event harus diisi";
    }

    if (formData.max_attendees && parseInt(formData.max_attendees) < 1) {
      newErrors.max_attendees = "Kapasitas minimal 1 peserta";
    }

    if (formData.expires_in_hours && parseInt(formData.expires_in_hours) < 1) {
      newErrors.expires_in_hours = "Masa berlaku minimal 1 jam";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Format data untuk API
      const submitData = {
        ...formData,
        event_id: formData.event_id || undefined,
        meeting_id: formData.meeting_id || undefined,
        max_attendees: formData.max_attendees
          ? parseInt(formData.max_attendees)
          : undefined,
        expires_in_hours: parseInt(formData.expires_in_hours),
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
              <FaTag className="me-2" />
              Buat Sesi Absensi Baru
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
                {/* Title */}
                <div className="col-12">
                  <label className="form-label">
                    <FaTag className="me-2" />
                    Judul Sesi *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Contoh: PHP Workshop Attendance"
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                  <div className="form-text">
                    Nama sesi absensi yang akan ditampilkan
                  </div>
                </div>

                {/* Event Date */}
                <div className="col-md-6">
                  <label className="form-label">
                    <FaCalendar className="me-2" />
                    Tanggal Event *
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.event_date ? "is-invalid" : ""}`}
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                  />
                  {errors.event_date && (
                    <div className="invalid-feedback">{errors.event_date}</div>
                  )}
                </div>

                {/* Expiry Hours */}
                <div className="col-md-6">
                  <label className="form-label">
                    <FaClock className="me-2" />
                    Masa Berlaku (jam) *
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.expires_in_hours ? "is-invalid" : ""}`}
                    name="expires_in_hours"
                    value={formData.expires_in_hours}
                    onChange={handleChange}
                    min="1"
                    max="720"
                  />
                  {errors.expires_in_hours && (
                    <div className="invalid-feedback">
                      {errors.expires_in_hours}
                    </div>
                  )}
                  <div className="form-text">
                    QR code akan berlaku selama jumlah jam ini
                  </div>
                </div>

                {/* Event Selection */}
                <div className="col-md-6">
                  <label className="form-label">Event (Opsional)</label>
                  <select
                    className="form-select"
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} (ID: {event.id})
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    Pilih event jika sesi ini terkait dengan event tertentu
                  </div>
                </div>

                {/* Meeting Selection */}
                <div className="col-md-6">
                  <label className="form-label">Meeting (Opsional)</label>
                  <select
                    className="form-select"
                    name="meeting_id"
                    value={formData.meeting_id}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Meeting</option>
                    {meetings.map((meeting) => (
                      <option key={meeting.id} value={meeting.id}>
                        {meeting.title} (ID: {meeting.id})
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    Pilih meeting jika sesi ini terkait dengan meeting tertentu
                  </div>
                </div>

                {/* Max Attendees */}
                <div className="col-12">
                  <label className="form-label">
                    <FaUsers className="me-2" />
                    Kapasitas Maksimal (Opsional)
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.max_attendees ? "is-invalid" : ""}`}
                    name="max_attendees"
                    value={formData.max_attendees}
                    onChange={handleChange}
                    min="1"
                    placeholder="Contoh: 50"
                  />
                  {errors.max_attendees && (
                    <div className="invalid-feedback">
                      {errors.max_attendees}
                    </div>
                  )}
                  <div className="form-text">
                    Kosongkan jika tidak ada batasan jumlah peserta
                  </div>
                </div>

                {/* Preview */}
                <div className="col-12 mt-3">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">Preview Sesi</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <strong>Judul:</strong>{" "}
                          {formData.title || "(Belum diisi)"}
                        </div>
                        <div className="col-md-6">
                          <strong>Tanggal:</strong> {formData.event_date}
                        </div>
                        <div className="col-md-6">
                          <strong>Berlaku:</strong> {formData.expires_in_hours}{" "}
                          jam
                        </div>
                        <div className="col-md-6">
                          <strong>Kapasitas:</strong>{" "}
                          {formData.max_attendees || "Tidak terbatas"}
                        </div>
                      </div>
                    </div>
                  </div>
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
                Buat Sesi & Generate QR Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;
