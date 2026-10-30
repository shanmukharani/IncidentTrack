import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { EMPTY_FILTERS, EMPTY_STATS } from "../constants/incident";

const SEARCH_DEBOUNCE_MS = 300;

export default function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Loads the table rows (respecting filters) and the dashboard numbers together.
  const refresh = useCallback(async () => {
    try {
      setError("");

      const [incidentsResponse, statsResponse] = await Promise.all([
        api.get("/incidents", { params: filters }),
        api.get("/incidents/stats"),
      ]);

      setIncidents(incidentsResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Unable to load incidents. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Re-fetch whenever filters change (debounced so typing doesn't spam the API).
  useEffect(() => {
    const timer = setTimeout(refresh, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [refresh]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  // Runs a write request, then reloads data. Returns { ok, message } for the UI.
  async function runMutation(request, fallbackMessage) {
    try {
      await request();
      await refresh();
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || fallbackMessage,
      };
    }
  }

  const createIncident = (data) =>
    runMutation(() => api.post("/incidents", data), "Failed to create incident.");

  const updateIncident = (id, data) =>
    runMutation(
      () => api.patch(`/incidents/${id}`, data),
      "Failed to update incident."
    );

  const deleteIncident = async (id) => {
    const result = await runMutation(
      () => api.delete(`/incidents/${id}`),
      "Failed to delete incident."
    );
    if (!result.ok) setError(result.message);
  };

  return {
    incidents,
    stats,
    filters,
    loading,
    error,
    updateFilter,
    createIncident,
    updateIncident,
    deleteIncident,
  };
}
