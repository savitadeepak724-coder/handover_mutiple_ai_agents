import { ShieldCheck, KeyRound, Code2, Radio } from "lucide-react";
import { ROLES } from "../data.js";

export default function SettingsPage({ role, setRole }) {
  return (
    <>
      <section className="card">
        <h2 className="h-icon">
          <ShieldCheck size={20} className="accent" /> PostgreSQL Row-Level Security (RLS) &amp;
          Role-Based Access
        </h2>
        <div className="muted small">
          Switch active viewer roles to preview how PostgreSQL RLS and Microsoft Presidio redact
          restricted items instead of silently hiding them.
        </div>
        <div className="grid-3 roles">
          {ROLES.map((r) => (
            <button
              key={r.id}
              className={"role-card" + (role === r.id ? " active" : "")}
              onClick={() => setRole(r.id)}
            >
              <div className="role-name">{r.id}</div>
              <div className="muted small">
                {r.code ? (
                  <>
                    RLS policy: <span className="mono accent">{r.code}</span>. Sees architecture
                    &amp; test tasks.
                  </>
                ) : (
                  r.desc
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="h-icon">
          <KeyRound size={20} className="accent" /> OAuth &amp; MCP Server Integrations
        </h2>
        <div className="muted small">
          Manage OAuth connection tokens for GitHub, Slack, Google Drive, and Jira.
        </div>
        <div className="oauth-list">
          <div className="oauth-row">
            <Code2 size={20} />
            <div className="grow">
              <div className="source-name">GitHub Enterprise OAuth</div>
              <div className="muted small">Connected via PyGithub &amp; MCP v1.2</div>
            </div>
            <span className="pill pill-ok mono">Active</span>
          </div>
          <div className="oauth-row">
            <Radio size={20} className="purple" />
            <div className="grow">
              <div className="source-name">Slack Workspace Bot</div>
              <div className="muted small">Connected to #proj-ledger</div>
            </div>
            <span className="pill pill-ok mono">Active</span>
          </div>
        </div>
      </section>
    </>
  );
}
