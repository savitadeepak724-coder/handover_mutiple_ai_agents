import { Copy, FileText, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { DIFF_LINES } from "../data.js";

function redact(text, role) {
  if (!role.startsWith("External Intern")) return text;
  return text
    .replace(/Priya S\./g, "[REDACTED:PERSON]")
    .replace(/Bank API/g, "[REDACTED:PARTNER] API");
}

export default function HandoverDoc({
  docText,
  setDocText,
  role,
  approved,
  approve,
  running,
}) {
  const isManager = role === "Manager / Reviewer";
  const shown = redact(docText, role);

  const copy = () => navigator.clipboard?.writeText(shown);

  return (
    <section className="card doc-card">
      <div className="doc-head">
        <div>
          <h2>
            <span className="tag">Agent 6</span> Compiled Knowledge Handover Document
          </h2>
          <div className="muted small">
            Pydantic Structured Schema v1.0 • Every claim linked to primary evidence
          </div>
        </div>
        <div className="doc-actions">
          <button className="btn btn-ghost" onClick={copy}>
            <FileText size={16} /> Copy Markdown
          </button>
          <span className={"status-badge " + (approved ? "approved" : "pending")}>
            {approved ? "Approved" : "Pending Reviewer Approval"}
          </span>
        </div>
      </div>

      <div className="doc-grid">
        <div>
          <div className="editor-label">
            <span>Reviewer Editor (Rich Markdown)</span>
            <span className="accent small">Auto-saved to PostgreSQL versions</span>
          </div>
          <textarea
            className="editor mono"
            value={shown}
            readOnly={!isManager}
            onChange={(e) => setDocText(e.target.value)}
            spellCheck={false}
          />
          {!isManager && (
            <div className="muted small lock-note">
              <Lock size={12} /> Read-only for this role. Switch to Manager / Reviewer to edit.
            </div>
          )}
        </div>

        <div className="doc-side">
          <div className="diff">
            <div className="diff-title">
              <ShieldCheck size={18} className="accent" />
              Version Diff Viewer (v1.1 AI Draft vs v1.2 Human Edit)
            </div>
            <div className="mono diff-body">
              {DIFF_LINES.map((l, i) => (
                <div key={i} className={"diff-" + l.t}>
                  {redact(l.s, role)}
                </div>
              ))}
            </div>
          </div>

          <div className="gate">
            <div>
              <div className="gate-title">LangGraph Human Interrupt Gate</div>
              <div className="muted small">
                Approve handover to unlock Rebuild Agent (Agent 7).
              </div>
            </div>
            <button
              className="btn btn-green"
              onClick={approve}
              disabled={approved || running || !isManager}
              title={!isManager ? "Only Manager / Reviewer can approve" : ""}
            >
              <CheckCircle2 size={16} />
              {approved ? "Approved" : "Approve & Unlock Rebuild"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
