import { AlertTriangle, CheckCircle2, Clock, Layers } from "lucide-react";
import StatCard from "./StatCard";
import { toPercent } from "../../utils/incident";
import "./DashboardStats.css";

function DashboardStats({ stats }) {
  const { total, open, highSeverity, resolved } = stats;

  return (
    <section className="stats">
      <StatCard
        label="Total Incidents"
        value={total}
        hint="Recorded"
        icon={Layers}
        tone="neutral"
        percent={total ? 100 : 0}
      />
      <StatCard
        label="Open Incidents"
        value={open}
        hint="Requires action"
        icon={Clock}
        tone="sky"
        percent={toPercent(open, total)}
      />
      <StatCard
        label="High Severity"
        value={highSeverity}
        hint="High / Critical"
        icon={AlertTriangle}
        tone="amber"
        percent={toPercent(highSeverity, total)}
      />
      <StatCard
        label="Resolved"
        value={resolved}
        hint="Closed out"
        icon={CheckCircle2}
        tone="emerald"
        percent={toPercent(resolved, total)}
      />
    </section>
  );
}

export default DashboardStats;
