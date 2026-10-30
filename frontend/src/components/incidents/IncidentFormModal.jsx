import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SEVERITIES, STATUSES } from "../../constants/incident";
import "./IncidentFormModal.css";

// Mount this fresh each time it opens (App passes a `key`) so the fields reset.
function IncidentFormModal({ incident, error, onSubmit, onClose }) {
  const isEditing = Boolean(incident);

  const [title, setTitle] = useState(incident?.title ?? "");
  const [description, setDescription] = useState(incident?.description ?? "");
  const [severity, setSeverity] = useState(incident?.severity ?? "Medium");
  const [status, setStatus] = useState(incident?.status ?? "Open");

  // Close with the Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ title, description, severity, status });
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div>
            <h3 id="incident-modal-title">
              {isEditing ? "Edit Incident Record" : "Log New Incident"}
            </h3>
            <p>Fill in the incident details below.</p>
          </div>
          <button className="modal__close" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="incident-title">Incident Title *</label>
            <input
              id="incident-title"
              className="field"
              type="text"
              placeholder="e.g. High latency on payment gateway"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="incident-severity">Severity Level</label>
              <select
                id="incident-severity"
                className="field"
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
              >
                {SEVERITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="incident-status">Status</label>
              <select
                id="incident-status"
                className="field"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="incident-description">Incident Description *</label>
            <textarea
              id="incident-description"
              className="field"
              rows={4}
              placeholder="Provide context or root cause details..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
              required
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? "Save Changes" : "Create Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncidentFormModal;
