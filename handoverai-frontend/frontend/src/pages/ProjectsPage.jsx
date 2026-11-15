import { useRef, useState } from "react";
import { Database, Upload, Sparkles, FileText } from "lucide-react";
import { DEMO_FILES } from "../data.js";

const fmtSize = (b) =>
  b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";

const kind = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  return (
    { pdf: "PDF", md: "Markdown", docx: "Word", zip: "ZIP", txt: "Text" }[ext] ||
    ext.toUpperCase()
  );
};

export default function ProjectsPage() {
  const [files, setFiles] = useState(DEMO_FILES);
  const [drag, setDrag] = useState(false);
  const input = useRef(null);

  const add = (list) => {
    const next = Array.from(list)
      .filter((f) => f.size <= 50 * 1024 * 1024)
      .map((f) => ({ name: f.name, size: fmtSize(f.size), type: kind(f.name) }));
    setFiles((prev) => [...prev, ...next]);
  };

  return (
    <>
      <section className="card workspace-head">
        <div>
          <span className="hero-tag mono sm">Active Project Workspace</span>
          <h1 className="ws-title">fintech-ledger-core</h1>
          <div className="muted small">
            Double-entry ledger service in FastAPI &amp; PostgreSQL 16 • 24 GitHub repos linked
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setFiles(DEMO_FILES)}>
          <Sparkles size={16} /> Load Demo Project Bundle
        </button>
      </section>

      <section className="card upload-card">
        <h2 className="h-icon">
          <Database size={20} className="accent" /> Project Document Upload (Chunker + pgvector)
        </h2>
        <div className="muted small">
          Upload architecture specs, stale READMEs, meeting notes, post-mortems, or source
          archives for Agent 1 &amp; Agent 2 ingestion. Sensitive PII is auto-redacted via Presidio.
        </div>

        <div
          className={"dropzone" + (drag ? " drag" : "")}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            add(e.dataTransfer.files);
          }}
        >
          <div className="drop-ico">
            <Upload size={26} />
          </div>
          <div className="drop-title">Drag &amp; drop project documents here, or browse files</div>
          <div className="muted small center">
            Supports PDF, Markdown (.md), Architecture Docs, Meeting Notes, ZIP/Code up to
            <br />
            50MB per file. Sensitive PII is auto-redacted via Presidio.
          </div>
          <button className="btn btn-dark" onClick={() => input.current?.click()}>
            Browse Files
          </button>
          <input
            ref={input}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              add(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="staged-head">
          <h3>Staged Project Artifacts ({files.length})</h3>
          <button className="link-btn underline" onClick={() => setFiles([])}>
            Clear all
          </button>
        </div>
        <div className="staged-list">
          {files.map((f, i) => (
            <div key={f.name + i} className="staged">
              <div className="ico ico-indigo">
                <FileText size={18} />
              </div>
              <div className="staged-info">
                <div className="staged-name">{f.name}</div>
                <div className="muted small">
                  {f.size} • {f.type} • Indexed via pgvector
                </div>
              </div>
              <span className="pill pill-ok">Ready</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
