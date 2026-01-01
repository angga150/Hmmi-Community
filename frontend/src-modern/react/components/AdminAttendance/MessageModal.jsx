import React from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const MessageModal = ({
  show,
  title,
  message,
  type,
  onShowQRCode,
  onClose,
}) => {
  if (!show) return null;

  const typeConfig = {
    success: {
      icon: FaCheckCircle,
      bgColor: "bg-success",
      textColor: "text-white",
    },
    danger: {
      icon: FaTimesCircle,
      bgColor: "bg-danger",
      textColor: "text-white",
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "bg-info",
      textColor: "text-white",
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className={`modal-header ${config.bgColor} ${config.textColor}`}>
            <h5 className="modal-title">
              <Icon className="me-2" />
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body d-flex justify-content-center align-items-center flex-column pt-3">
            {onShowQRCode}
            <div className="text-center">
              {/* <Icon size={48} className={`mb-3 ${config.textColor}`} /> */}
              <p className="mb-0">{message}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
