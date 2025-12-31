import React, { useState, useEffect } from "react";
import axios from "axios";
import MeetingList from "./MeetingList";
import MeetingForm from "./MeetingForm";
import ConfirmationModal from "./ConfirmationModal";
import MessageModal from "./MessageModal";
import { FaCalendarAlt, FaPlus, FaFilter, FaSync } from "react-icons/fa";

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    upcoming: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [messageModal, setMessageModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append("status", filters.status);
      if (filters.date) queryParams.append("date", filters.date);
      if (filters.upcoming) queryParams.append("upcoming", filters.upcoming);

      const queryString = queryParams.toString();
      const url = `/api/meetings${queryString ? `?${queryString}` : ""}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMeetings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      showMessage("Error", "Gagal mengambil data meeting", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [filters]);

  const handleCreateMeeting = async (meetingData) => {
    try {
      const response = await axios.post("/api/meetings", meetingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        showMessage("Sukses", "Meeting berhasil dibuat", "success");
        setShowForm(false);
        fetchMeetings();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      showMessage("Error", "Gagal membuat meeting", "danger");
    }
  };

  const handleUpdateMeeting = async (id, updateData) => {
    console.log("pesan", id);
    try {
      const response = await axios.put(`/api/meetings/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        showMessage("Sukses", "Meeting berhasil diperbarui", "success");
        fetchMeetings();
      } else {
        showMessage("Error", "Gagal memperbajarui meeting", "danger");
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      showMessage("Error", "Gagal memperbarui meeting", "danger");
    }
  };

  const handleDeleteMeeting = async () => {
    try {
      const response = await axios.delete(`/api/meetings/${meetingToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        showMessage("Sukses", "Meeting berhasil dihapus", "success");
        setShowDeleteModal(false);
        fetchMeetings();
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      showMessage("Error", "Gagal menghapus meeting", "danger");
    }
  };

  const confirmDelete = (id) => {
    setMeetingToDelete(id);
    setShowDeleteModal(true);
  };

  const showMessage = (title, message, type = "success") => {
    setMessageModal({
      show: true,
      title,
      message,
      type,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      date: "",
      upcoming: "",
    });
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center my-5 p-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">
            <FaCalendarAlt className="me-2" />
            Jadwal Pertemuan
          </h1>
          <p className="text-muted">Kelola jadwal pertemuan dan workshop</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedMeeting(null);
            setShowForm(true);
          }}
        >
          <FaPlus className="me-2" />
          Buat Meeting Baru
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Tanggal</label>
              <input
                type="date"
                className="form-control"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Upcoming Only</label>
              <select
                className="form-select"
                value={filters.upcoming}
                onChange={(e) => handleFilterChange("upcoming", e.target.value)}
              >
                <option value="">Semua</option>
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                <FaSync className="me-2" />
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting List */}
      <MeetingList
        meetings={meetings}
        loading={loading}
        onEdit={(meeting) => {
          setSelectedMeeting(meeting);
          setShowForm(true);
        }}
        onDelete={confirmDelete}
        onUpdateStatus={handleUpdateMeeting}
      />

      {/* Meeting Form Modal */}
      {showForm && (
        <MeetingForm
          meeting={selectedMeeting}
          onSubmit={
            selectedMeeting
              ? (data) => handleUpdateMeeting(selectedMeeting.id, data)
              : handleCreateMeeting
          }
          onClose={() => {
            setShowForm(false);
            setSelectedMeeting(null);
          }}
          isEdit={!!selectedMeeting}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus meeting ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteMeeting}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Message Modal */}
      <MessageModal
        show={messageModal.show}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        onClose={() => setMessageModal({ ...messageModal, show: false })}
      />
    </div>
  );
};

export default AdminMeetings;
