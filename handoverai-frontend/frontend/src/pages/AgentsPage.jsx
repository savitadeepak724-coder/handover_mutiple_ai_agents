import { useEffect, useRef } from "react";
import { AGENTS } from "../data.js";
import { AgentCardFull } from "../components/AgentCards.jsx";

export default function AgentsPage({ status, running, runSingle, approved, highlight }) {
  const refs = useRef({});

  useEffect(() => {
    if (highlight && refs.current[highlight]) {
      refs.current[highlight].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  return (
    <div className="grid-3">
      {AGENTS.map((a, i) => (
        <div key={a.id} ref={(el) => (refs.current[a.id] = el)}>
          <AgentCardFull
            agent={a}
            state={status[i]}
            onRun={runSingle}
            selected={highlight ? highlight === a.id : a.id === 1}
            disabled={running || (a.id === 7 && !approved)}
          />
        </div>
      ))}
    </div>
  );
}
