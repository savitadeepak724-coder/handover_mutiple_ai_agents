import { LayoutGrid, Cpu, FolderSearch, Settings, Sparkles } from "lucide-react";
import { AGENTS } from "../data.js";

const NAV = [
  { id: "home", label: "Home Dashboard", icon: LayoutGrid },
  { id: "agents", label: "All Agents", icon: Cpu, badge: AGENTS.length },
  { id: "projects", label: "Projects & Artifacts", icon: FolderSearch },
  { id: "settings", label: "Settings & OAuth", icon: Settings },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Sparkles size={26} />
        </div>
        <div>
          <div className="brand-row">
            <span className="brand-name">HandoverAI</span>
            <span className="version">v1.2</span>
          </div>
          <div className="brand-sub">Knowledge Handover Platform</div>
        </div>
      </div>

      <nav className="nav">
        {NAV.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            className={"nav-item" + (page === id ? " active" : "")}
            onClick={() => setPage(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {badge != null && <span className="nav-badge">{badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="repo-card">
          <div className="repo-top">
            <span>Repository Target</span>
            <span className="pill pill-ok mono">connected</span>
          </div>
          <div className="mono repo-name">fintech-ledger-core</div>
          <div className="repo-bottom">
            <span>
              Branch: <span className="mono accent">main</span>
            </span>
            <button className="link-btn" onClick={() => setPage("agents")}>
              Run Agents ▷
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
