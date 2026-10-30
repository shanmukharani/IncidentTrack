import { Edit3, ShieldAlert, Trash2 } from "lucide-react";
import Badge from "../common/Badge";
import IncidentFilters from "./IncidentFilters";
import { formatDate, formatIncidentId } from "../../utils/incident";
import "./IncidentTable.css";

function IncidentTable({ incidents, filters, onFilterChange, onEdit, onDelete }) {
  return (
    <section className="incident-section">
      <div className="incident-section__toolbar">
        <div className="incident-section__heading">
          <h3>Recent Incidents</h3>
          <span className="incident-section__count">{incidents.length} items</span>
        </div>

        <IncidentFilters
          status={filters.status}
          severity={filters.severity}
          onChange={onFilterChange}
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title &amp; ID</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Date Created</th>
              <th className="table__actions-head">Actions</th>
            </tr>
          </thead>

          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">
                  <ShieldAlert size={32} />
                  <p className="table__empty-title">No incidents match your current filters.</p>
                  <p>Try clearing your search term or adjusting the selected options.</p>
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <tr key={incident._id}>
                  <td>
                    <div className="table__title">{incident.title}</div>
                    <div className="table__id">{formatIncidentId(incident._id)}</div>
                  </td>
                  <td>
                    <Badge type="severity" value={incident.severity} />
                  </td>
                  <td>
                    <Badge type="status" value={incident.status} />
                  </td>
                  <td className="table__date">{formatDate(incident.createdAt)}</td>
                  <td>
                    <div className="table__actions">
                      <button className="action-btn" onClick={() => onEdit(incident)}>
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button
                        className="action-btn action-btn--danger"
                        onClick={() => onDelete(incident._id)}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default IncidentTable;
