// Short reference shown under the title, e.g. INC-EF56AB
export function formatIncidentId(id = "") {
  return `INC-${id.slice(-6).toUpperCase()}`;
}

// ISO date -> 2026-10-29
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-CA");
}

// "In Progress" -> "in-progress" (used for CSS class names)
export function toSlug(value = "") {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export function toPercent(value, total) {
  return total ? Math.round((value / total) * 100) : 0;
}
