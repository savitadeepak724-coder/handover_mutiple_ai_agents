import { ChevronRight, Play } from "lucide-react";

export function StatusPill({ state }) {
  const label = { idle: "Idle", running: "Running…", done: "Complete" }[state];
  return <span className={"status status-" + state}>{label}</span>;
}

export function AgentCardCompact({ agent, state, onInspect }) {
  const n = String(agent.id).padStart(2, "0");
  return (
    <div className="card agent-compact" onClick={() => onInspect(agent.id)}>
      <div className="agent-head">
        <span className="tag mono">Agent {n}</span>
        <StatusPill state={state} />
      </div>
      <h3>{agent.name}</h3>
      <div className="agent-sub">{agent.subtitle}</div>
      <p className="agent-desc clamp">{agent.short}</p>
      <div className="agent-foot">
        <span className="muted small">{agent.evidence} evidence items</span>
        <span className="inspect">
          Inspect <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

export function AgentCardFull({ agent, state, onRun, disabled, selected }) {
  const n = String(agent.id).padStart(2, "0");
  return (
    <div className={"card agent-full" + (selected ? " selected" : "")}>
      <div className="agent-head">
        <span className="tag mono">Agent {n}</span>
        <StatusPill state={state} />
      </div>
      <h3>{agent.name}</h3>
      <div className="agent-sub">{agent.subtitle}</div>
      <p className="agent-desc">{agent.description}</p>
      <div className="tools-label">Tools &amp; Integrations:</div>
      <div className="tools">
        {agent.tools.map((t) => (
          <span key={t} className="chip mono">
            {t}
          </span>
        ))}
      </div>
      <div className="agent-foot bordered">
        <span className="mono muted small result">
          {state === "done" || state === "idle" ? agent.result : "Processing…"}
        </span>
        <button
          className="btn btn-run"
          onClick={() => onRun(agent.id - 1)}
          disabled={disabled}
        >
          <Play size={12} />
          <span>
            Run
            <br />
            Agent
          </span>
        </button>
      </div>
    </div>
  );
}
