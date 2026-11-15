import { Code2, Radio, HardDrive, SquareCheckBig } from "lucide-react";
import { DATA_SOURCES } from "../data.js";

const ICONS = {
  github: { Icon: Code2, cls: "ico-dark" },
  slack: { Icon: Radio, cls: "ico-purple" },
  drive: { Icon: HardDrive, cls: "ico-blue" },
  jira: { Icon: SquareCheckBig, cls: "ico-green" },
};

export default function DataSources() {
  return (
    <section className="card sources">
      <div className="status-row">
        <div>
          <h2>Authorised Data Sources</h2>
          <div className="muted small">OAuth + MCP servers securely indexing project assets</div>
        </div>
        <span className="pill pill-ok mono">MCP v1.2 Active</span>
      </div>
      <div className="grid-4 sources-grid">
        {DATA_SOURCES.map((s) => {
          const { Icon, cls } = ICONS[s.key];
          return (
            <div key={s.key} className="source">
              <div className="source-top">
                <div className={"ico " + cls}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="source-name">{s.name}</div>
                  <div className={"source-status " + s.tone}>{s.status}</div>
                </div>
              </div>
              <div className="muted small">{s.desc}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
