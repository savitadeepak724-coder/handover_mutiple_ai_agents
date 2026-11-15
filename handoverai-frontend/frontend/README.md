# HandoverAI – Frontend

React (Vite) frontend for the AI Project Handover System.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## What's included

- **Home Dashboard** – hero, LangGraph pipeline progress bar, first 4 agent cards, authorised data sources, and (after Agent 6 finishes) the Compiled Handover Document with editor, diff viewer and the Human Interrupt Gate.
- **All Agents** – full grid of all 7 agents with tools and per-agent Run buttons (Agent 7 unlocks after approval).
- **Projects & Artifacts** – drag-and-drop uploader, demo bundle, staged artifacts list.
- **Settings & OAuth** – RLS role switcher and OAuth/MCP integration status.

## Demo behaviour

- "Start Handover Simulation" runs Agents 1–6 sequentially, then pauses at the human gate.
- The **RLS Role** selector (top bar) changes behaviour: only *Manager / Reviewer* can edit the document and approve; *External Intern* sees sensitive names/partners redacted.
- Approving runs Agent 7 (Rebuild).

All data is mocked in `src/data.js`; wire up your FastAPI/LangGraph endpoints where `startSimulation` / `runSingle` / `approve` live in `src/App.jsx`.

# 🚀 Multi-Agent Project Handover Platform

An automated project handover system designed to bridge knowledge gaps when transitioning projects between teams. It aggregates developer data from multiple sources and leverages a multi-agent AI pipeline to synthesize actionable project documentation.

## 🛠️ Tech Stack
* **Frontend**: React (Vite / Component-based UI)
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **AI Pipeline**: LangGraph (`@langchain/langgraph`) powered by Gemini, Claude, and GPT-4o
* **Integrations**: GitHub API, Slack Web API, Jira, Google Drive

## 🤖 7-Agent Pipeline Architecture
1. **Collector Agent**: Gathers commits, PRs, issues, Slack chats, and docs.
2. **Analyst Agent**: Summarizes technical state and repository status.
3. **Risk & Blocker Agent**: Identifies technical debt, open bottlenecks, and warning signs.
4. **Timeline Builder**: Organizes milestones and progress cards.
5. **Action Plan Agent**: Formulates next steps for incoming developers.
6. **Compiler Agent**: Packages the final unified handover documentation.
7. **Rebuild / PR Status Agent**: Tracks integration status and readiness.
