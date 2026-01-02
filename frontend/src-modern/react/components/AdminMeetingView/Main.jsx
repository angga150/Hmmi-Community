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
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data meeting";
      showMessage("Error", errorMessage, "danger");
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        showMessage(
          "Sukses",
          response.data.message || "Meeting berhasil dibuat",
          "success"
        );
        setShowForm(false);
        fetchMeetings();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal membuat meeting";
      showMessage("Error", errorMessage, "danger");
    }
  };

  const handleUpdateMeeting = async (id, updateData) => {
    try {
      // Sesuai backend, PUT hanya menerima query parameter id dan body dengan status
      const response = await axios.put(`/api/meetings?id=${id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        showMessage(
          "Sukses",
          response.data.message || "Meeting berhasil diperbarui",
          "success"
        );
        fetchMeetings();
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui meeting";
      showMessage("Error", errorMessage, "danger");
    }
  };

  const handleDeleteMeeting = async () => {
    try {
      const response = await axios.delete(
        `/api/meetings?id=${meetingToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        showMessage(
          "Sukses",
          response.data.message || "Meeting berhasil dihapus",
          "success"
        );
        setShowDeleteModal(false);
        setMeetingToDelete(null);
        fetchMeetings();
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal menghapus meeting";
      showMessage("Error", errorMessage, "danger");
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
    <div className="container-fluid p-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-5">
        <div>
          <h1 className="h2 fw-bold text-dark mb-2">
            <FaCalendarAlt className="me-2" />
            Manajemen Meeting
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
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Pencarian
          </h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchMeetings}
            disabled={loading}
          >
            <FaSync className={loading ? "fa-spin" : ""} />
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Status Meeting</label>
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
              <label className="form-label">Tanggal Meeting</label>
              <input
                type="date"
                className="form-control"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Hanya Yang Akan Datang</label>
              <select
                className="form-select"
                value={filters.upcoming}
                onChange={(e) => handleFilterChange("upcoming", e.target.value)}
              >
                <option value="">Tampilkan Semua</option>
                <option value="true">Ya</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                disabled={loading}
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
        title="Konfirmasi Hapus Meeting"
        message="Apakah Anda yakin ingin menghapus meeting ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteMeeting}
        onCancel={() => {
          setShowDeleteModal(false);
          setMeetingToDelete(null);
        }}
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
