import { Activity, Play, Cpu, Sparkles } from "lucide-react";
import { AGENTS } from "../data.js";
import { AgentCardCompact } from "../components/AgentCards.jsx";
import DataSources from "../components/DataSources.jsx";
import HandoverDoc from "../components/HandoverDoc.jsx";

export default function HomePage(p) {
  const {
    status,
    running,
    progress,
    doneCount,
    docReady,
    gateOpen,
    startSimulation,
    setPage,
    inspect,
  } = p;

  const label = gateOpen
    ? "Awaiting Human Gate"
    : running
    ? `Running (${progress}%)`
    : progress === 100
    ? "Complete (100%)"
    : `Idle (${progress}%)`;

  return (
    <>
      <section className="hero">
        <span className="hero-tag mono">
          <Sparkles size={14} /> LangGraph Orchestration v1.2 + PostgreSQL pgvector
        </span>
        <h1>AI Project Handover System</h1>
        <p>
          Rebuild project state instantly when team members leave. Our 7-agent pipeline
          synthesizes authorized commits, Slack threads, Jira tickets, and architecture docs
          into an evidence-linked handover document and automated rebuild PR.
        </p>
        <div className="hero-actions">
          <button className="btn btn-white" onClick={startSimulation} disabled={running}>
            <Play size={16} fill="currentColor" />
            Start Handover Simulation ({progress}%)
          </button>
          <button className="btn btn-outline" onClick={() => setPage("agents")}>
            <Cpu size={16} />
            Inspect 7 Agents ({doneCount}/7 Complete)
          </button>
        </div>
      </section>

      <section className="card status-card">
        <div className="status-row">
          <div className="status-title">
            <Activity size={20} className="accent" />
            LangGraph Pipeline Orchestration Status
          </div>
          <span className="pill pill-accent mono">{label}</span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: progress + "%" }} />
        </div>
      </section>

      <section className="section-head">
        <div>
          <h2>LangGraph Pipeline (7 Agents + Human Gate)</h2>
          <div className="muted small">
            Click any agent below to view its tools, logic, and generated evidence.
          </div>
        </div>
        <button className="link-btn big" onClick={() => setPage("agents")}>
          View All Agents Grid ›
        </button>
      </section>

      <div className="grid-4">
        {AGENTS.slice(0, 4).map((a, i) => (
          <AgentCardCompact key={a.id} agent={a} state={status[i]} onInspect={inspect} />
        ))}
      </div>

      <DataSources />

      {docReady && <HandoverDoc {...p} />}
    </>
  );
}
