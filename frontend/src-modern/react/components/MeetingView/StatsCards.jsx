import {
  FaCalendarAlt,
  FaClock,
  FaUserFriends,
  FaHourglassHalf,
} from "react-icons/fa";

function StatsCards({ meetingCount }) {
  const cards = [
    {
      title: "Semua Pertemuan",
      count: meetingCount.all,
      icon: FaCalendarAlt,
      color: "primary",
      bgColor: "bg-primary bg-opacity-10",
    },
    {
      title: "Mendatang",
      count: meetingCount.upcoming,
      icon: FaClock,
      color: "info",
      bgColor: "bg-info bg-opacity-10",
    },
    {
      title: "Berlangsung",
      count: meetingCount.running,
      icon: FaHourglassHalf,
      color: "warning",
      bgColor: "bg-warning bg-opacity-10",
    },
    {
      title: "Selesai",
      count: meetingCount.completed,
      icon: FaUserFriends,
      color: "success",
      bgColor: "bg-success bg-opacity-10",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, index) => (
        <div key={index} className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100 hover-lift">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className={`rounded-circle ${card.bgColor} p-3 me-3`}>
                  <card.icon className={`text-${card.color} fs-4`} />
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">{card.count}</h3>
                  <p className="text-muted mb-0">{card.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
