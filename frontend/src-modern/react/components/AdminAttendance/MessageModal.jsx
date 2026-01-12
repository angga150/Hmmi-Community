import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const MessageModal = ({ show, title, message, type = "success", onClose }) => {
  if (!show) return null;

  const config = {
    success: {
      icon: <FaCheckCircle className="text-success" size={24} />,
      buttonClass: "btn-success",
      headerClass: "border-success",
    },
    danger: {
      icon: <FaExclamationCircle className="text-danger" size={24} />,
      buttonClass: "btn-danger",
      headerClass: "border-danger",
    },
    warning: {
      icon: <FaExclamationCircle className="text-warning" size={24} />,
      buttonClass: "btn-warning",
      headerClass: "border-warning",
    },
    info: {
      icon: <FaInfoCircle className="text-info" size={24} />,
      buttonClass: "btn-info",
      headerClass: "border-info",
    },
  };

  const { icon, buttonClass, headerClass } = config[type] || config.success;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow">
            {/* Header */}
            <div className={`modal-header border-bottom-0 ${headerClass}`}>
              <div className="d-flex align-items-center w-100">
                <div className="me-3">{icon}</div>
                <h5 className="modal-title fw-bold mb-0">{title}</h5>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>
            </div>

            <div className="modal-body py-3">
              <p className="mb-0">{message}</p>
            </div>

            <div className="modal-footer border-top-0">
              <button
                type="button"
                className={`btn ${buttonClass} px-4`}
                onClick={onClose}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageModal;
