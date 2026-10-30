import { toSlug } from "../../utils/incident";
import "./Badge.css";

// type: "severity" | "status"  ->  class like "badge--severity-high"
function Badge({ type, value }) {
  return <span className={`badge badge--${type}-${toSlug(value)}`}>{value}</span>;
}

export default Badge;
