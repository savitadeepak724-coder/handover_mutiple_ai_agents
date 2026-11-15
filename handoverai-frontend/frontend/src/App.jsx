import { useEffect, useRef, useState } from "react";
import { AGENTS, INITIAL_DOC } from "./data.js";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import AgentsPage from "./pages/AgentsPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import CollectorForm from './components/CollectorForm';

const TITLES = {
  home: "Home Dashboard & LangGraph Pipeline",
  agents: "All Agents",
  projects: "Projects & Artifacts",
  settings: "Settings & OAuth",
};

const STEP_MS = 1400;

export default function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("Incoming Developer");
  // status per agent: idle | running | done
  const [status, setStatus] = useState(() => AGENTS.map(() => "idle"));
  const [running, setRunning] = useState(false);
  const [docText, setDocText] = useState(INITIAL_DOC);
  const [approved, setApproved] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const timer = useRef(null);

  const doneCount = status.filter((s) => s === "done").length;
  const progress = Math.round((doneCount / AGENTS.length) * 100);
  const docReady = status[5] === "done";
  const gateOpen = docReady && !approved; // pipeline waits at human gate

  const setAgent = (i, v) =>
    setStatus((prev) => prev.map((s, idx) => (idx === i ? v : s)));

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  // Run agents sequentially from index `from` up to `to` (inclusive)
  const runRange = (from, to) => {
    clearTimer();
    setRunning(true);
    let i = from;
    const step = () => {
      setAgent(i, "running");
      timer.current = setTimeout(() => {
        setAgent(i, "done");
        if (i < to) {
          i += 1;
          step();
        } else {
          setRunning(false);
        }
      }, STEP_MS);
    };
    step();
  };

  const startSimulation = () => {
    if (running) return;
    setApproved(false);
    setStatus(AGENTS.map(() => "idle"));
    setTimeout(() => runRange(0, 5), 50);
  };

  const runSingle = (i) => {
    if (running) return;
    if (i === 6 && !approved) return;
    clearTimer();
    setRunning(true);
    setAgent(i, "running");
    timer.current = setTimeout(() => {
      setAgent(i, "done");
      setRunning(false);
    }, STEP_MS);
  };

  const approve = () => {
    if (role !== "Manager / Reviewer") return;
    setApproved(true);
    runRange(6, 6);
  };

  const inspect = (id) => {
    setHighlight(id);
    setPage("agents");
  };

  useEffect(() => () => clearTimer(), []);

  const common = {
    status,
    running,
    progress,
    doneCount,
    docReady,
    gateOpen,
    approved,
    role,
    docText,
    setDocText,
    approve,
    startSimulation,
    runSingle,
    inspect,
    setPage,
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <div className="main">
        <Topbar
          title={TITLES[page]}
          role={role}
          setRole={setRole}
          onRun={() => {
            setPage("home");
            startSimulation();
          }}
          running={running}
        />
        <div className="content">
          {page === "home" && (
            <>
              {/* Aapka CollectorForm yahan render hoga */}
              <CollectorForm />
              <HomePage {...common} />
            </>
          )}
          {page === "agents" && <AgentsPage {...common} highlight={highlight} />}
          {page === "projects" && <ProjectsPage />}
          {page === "settings" && <SettingsPage role={role} setRole={setRole} />}
        </div>
      </div>
    </div>
  );
}