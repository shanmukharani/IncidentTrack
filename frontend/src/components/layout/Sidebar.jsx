import {
  ChevronRight,
  LayoutDashboard,
  Layers,
  PlusCircle,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar({ activeTab, onChangeTab, onCreate, search, onSearchChange, total }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h1 className="sidebar__title">IncidentTrack</h1>
        </div>
      </div>

      <div className="sidebar__search">
        <label htmlFor="sidebar-search">Search incidents</label>
        <div className="sidebar__search-box">
          <Search size={16} className="sidebar__search-icon" />
          <input
            id="sidebar-search"
            className="field"
            type="text"
            placeholder="Filter by title..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search && (
            <button
              type="button"
              className="sidebar__search-clear"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <nav className="sidebar__nav">
        <button
          className={`nav-item ${activeTab === "dashboard" ? "nav-item--active" : ""}`}
          onClick={() => onChangeTab("dashboard")}
        >
          <span className="nav-item__label">
            <LayoutDashboard size={16} />
            Dashboard
          </span>
          {activeTab === "dashboard" && <ChevronRight size={14} />}
        </button>

        <button className="nav-item nav-item--create" onClick={onCreate}>
          <span className="nav-item__label">
            <PlusCircle size={16} />
            Create Incident
          </span>
        </button>

        <button
          className={`nav-item ${activeTab === "incidents" ? "nav-item--active" : ""}`}
          onClick={() => onChangeTab("incidents")}
        >
          <span className="nav-item__label">
            <Layers size={16} />
            Incidents List
          </span>
          <span className="nav-item__count">{total}</span>
        </button>
      </nav>

      
    </aside>
  );
}

export default Sidebar;
