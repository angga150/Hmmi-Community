import { FaCalendarAlt } from "react-icons/fa";

function CalendarSection() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title fw-bold mb-3">Kalender Bulan Ini</h5>
        <div className="text-center py-5 bg-light rounded">
          <FaCalendarAlt className="text-muted mb-3" size={48} />
          <h6 className="text-muted">Integrasi Kalender</h6>
          <p className="text-muted small">Segera Hadir</p>
        </div>
      </div>
    </div>
  );
}

export default CalendarSection;
