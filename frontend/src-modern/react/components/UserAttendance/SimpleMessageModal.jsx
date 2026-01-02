import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const SimpleMessageModal = ({ show, success, title, message, onClose }) => {
  if (!show) return null;

  const Icon = success ? FaCheckCircle : FaTimesCircle;
  const bgColor = success ? "bg-success" : "bg-danger";

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className={`modal-header ${bgColor} text-white`}>
            <h5 className="modal-title">
              <Icon className="me-2" />
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body text-center py-4">
            <Icon
              size={64}
              className={`mb-3 ${success ? "text-success" : "text-danger"}`}
            />
            <h4 className="mb-3">{title}</h4>
            <p className="mb-0">{message}</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMessageModal;
