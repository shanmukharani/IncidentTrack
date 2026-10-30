import { SlidersHorizontal } from "lucide-react";
import { SEVERITIES, STATUSES } from "../../constants/incident";
import "./IncidentFilters.css";

function IncidentFilters({ status, severity, onChange }) {
  return (
    <div className="filters">
      <span className="filters__label">
        <SlidersHorizontal size={14} />
        Filters:
      </span>

      <select
        className="field filters__select"
        aria-label="Filter by severity"
        value={severity}
        onChange={(event) => onChange("severity", event.target.value)}
      >
        <option value="">All Severities</option>
        {SEVERITIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        className="field filters__select"
        aria-label="Filter by status"
        value={status}
        onChange={(event) => onChange("status", event.target.value)}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default IncidentFilters;
