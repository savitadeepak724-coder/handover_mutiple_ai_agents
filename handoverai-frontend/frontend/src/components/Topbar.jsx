import { LayoutGrid, PlayCircle } from "lucide-react";
import { ROLES } from "../data.js";

export default function Topbar({ title, role, setRole, onRun, running }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <LayoutGrid size={20} className="accent" />
        <span>{title}</span>
      </div>
      <div className="topbar-right">
        <button className="btn btn-primary" onClick={onRun} disabled={running}>
          <PlayCircle size={18} />
          Run 7-Agent Handover
        </button>
        <div className="role-box">
          <span className="muted">RLS Role:</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id.replace(" (Restricted)", "")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
