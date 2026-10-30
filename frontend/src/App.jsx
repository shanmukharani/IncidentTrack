import { useState } from "react";
import "./App.css";

import useIncidents from "./hooks/useIncidents";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardStats from "./components/dashboard/DashboardStats";
import IncidentTable from "./components/incidents/IncidentTable";
import IncidentFormModal from "./components/incidents/IncidentFormModal";

const PAGE_TITLES = {
  dashboard: "Overview Dashboard",
  incidents: "Incident Repository",
};

function App() {
  const {
    incidents,
    stats,
    filters,
    loading,
    error,
    updateFilter,
    createIncident,
    updateIncident,
    deleteIncident,
  } = useIncidents();

  const [activeTab, setActiveTab] = useState("dashboard");

  // Modal state: closed | creating a new incident | editing an existing one
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [formError, setFormError] = useState("");

  function openCreateModal() {
    setEditingIncident(null);
    setFormError("");
    setIsModalOpen(true);
  }

  function openEditModal(incident) {
    setEditingIncident(incident);
    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingIncident(null);
    setFormError("");
  }

  async function handleSaveIncident(incidentData) {
    setFormError("");

    const result = editingIncident
      ? await updateIncident(editingIncident._id, incidentData)
      : await createIncident(incidentData);

    if (result.ok) {
      closeModal();
    } else {
      setFormError(result.message);
    }
  }

  async function handleDeleteIncident(id) {
    const confirmed = window.confirm("Are you sure you want to delete this incident?");
    if (confirmed) await deleteIncident(id);
  }

  return (
    <div className="app">
      <Sidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onCreate={openCreateModal}
        search={filters.search}
        onSearchChange={(value) => updateFilter("search", value)}
        total={stats.total}
      />

      <main className="main">
        <Header
          title={PAGE_TITLES[activeTab]}
          subtitle="Monitor, track, and mitigate software incidents."
          onCreate={openCreateModal}
        />

        <div className="content">
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}

          {loading && <p className="loading">Loading dashboard...</p>}

          {activeTab === "dashboard" && <DashboardStats stats={stats} />}

          <IncidentTable
            incidents={incidents}
            filters={filters}
            onFilterChange={updateFilter}
            onEdit={openEditModal}
            onDelete={handleDeleteIncident}
          />
        </div>
      </main>

      {isModalOpen && (
        <IncidentFormModal
          key={editingIncident?._id ?? "new"}
          incident={editingIncident}
          error={formError}
          onSubmit={handleSaveIncident}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
