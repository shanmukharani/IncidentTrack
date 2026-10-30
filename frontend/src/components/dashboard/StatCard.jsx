import "./StatCard.css";

// tone: "neutral" | "sky" | "amber" | "emerald"
function StatCard({ label, value, hint, icon: Icon, tone, percent }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <Icon size={16} className="stat-card__icon" />
      </div>

      <div className="stat-card__middle">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__hint">{hint}</span>
      </div>

      <div className="stat-card__bar">
        <div className="stat-card__bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default StatCard;
