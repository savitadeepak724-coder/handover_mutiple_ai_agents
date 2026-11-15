export const AGENTS = [
  {
    id: 1,
    name: "Collector",
    subtitle: "OAuth & MCP Ingestion",
    short:
      "Pulls commits, PRs, selected Slack channels, Drive notes, and Jira/Trello cards via PyGithu...",
    description:
      "Pulls commits, PRs, selected Slack channels, Drive notes, and Jira/Trello cards via PyGithub, slack_sdk, and MCP.",
    tools: ["PyGithub API", "slack_sdk MCP", "Google Drive API", "Jira REST API"],
    evidence: 24,
    result: "24 Code Repos, 142 Slack threads, 12 Jira boards connected",
  },
  {
    id: 2,
    name: "Analyst",
    subtitle: "Decisions & Ownership",
    short:
      "Reads records, computes pgvector embeddings, extracts architectural decisions,...",
    description:
      "Reads records, computes pgvector embeddings, extracts architectural decisions, and attributes code ownership.",
    tools: [
      "pgvector similarity",
      "Pydantic structured parser",
      "Instructor LLM",
      "Langfuse audit",
    ],
    evidence: 38,
    result: "38 Decisive Architectural Choices mapped, 5 core maintainers identified",
  },
  {
    id: 3,
    name: "Risk & Dependency",
    subtitle: "Blockers & Stale Checks",
    short:
      "Scans chat for blockers, detects stale work (e.g. Jira card active with 0 commits in 6...",
    description:
      "Scans chat for blockers, detects stale work (e.g. Jira card active with 0 commits in 6 weeks), and builds dependency graphs.",
    tools: ["NetworkX cycle detector", "Stale heuristic engine", "Conflict pruner"],
    evidence: 19,
    result: "3 critical conflicts flagged, 1 stale Jira card identified (JIRA-402)",
  },
  {
    id: 4,
    name: "Timeline",
    subtitle: "Event & Decision Cards",
    short:
      "Turns historical git activity, Trello card moves, and key Slack milestones into an interactive...",
    description:
      "Turns historical git activity, Trello card moves, and key Slack milestones into an interactive chronological event stream.",
    tools: ["react-chrono engine", "Event normalizer", "Milestone tagger"],
    evidence: 186,
    result: "186 chronological events indexed across 90 days",
  },
  {
    id: 5,
    name: "Action Planner",
    subtitle: "Topological First-Week Plan",
    short: "Orders first-week onboarding tasks using topological sort...",
    description:
      "Orders first-week onboarding tasks using topological sort so tasks never precede their technical prerequisites.",
    tools: ["Topological sorter", "PostgreSQL RLS filter", "Jira task creator"],
    evidence: 7,
    result: "7 sequenced onboarding milestones generated",
  },
  {
    id: 6,
    name: "Compiler",
    subtitle: "Sourced Handover Doc",
    short: "Assembles all agent findings into a structured handover document...",
    description:
      "Assembles all agent findings into a structured handover document with verified source citations and confidence scores.",
    tools: ["Claude API (Synthesis)", "Pydantic validator", "Evidence linker"],
    evidence: 42,
    result: "100% sourced claims, v1.2 ready for human review",
  },
  {
    id: 7,
    name: "Rebuild Agent",
    subtitle: "Docker Sandbox & Draft PR",
    short: "Reads approved handover document, analyzes unfinished specs...",
    description:
      "Reads approved handover document, analyzes unfinished specs in a secure Docker sandbox, and opens a draft PR on GitHub.",
    tools: ["Docker isolated sandbox", "Claude Agent SDK", "GitHub PR Automator"],
    evidence: 11,
    result: "Draft PR #89 created with unit test stubs",
  },
];

export const ROLES = [
  {
    id: "Incoming Developer",
    desc: "RLS policy: handover_read_public. Sees architecture & test tasks.",
    code: "handover_read_public",
  },
  {
    id: "Manager / Reviewer",
    desc: "Full access to review, edit via Tiptap, and approve human gate.",
  },
  {
    id: "External Intern (Restricted)",
    desc: "Sensitive partner credentials redacted via Microsoft Presidio.",
  },
];

export const DATA_SOURCES = [
  {
    key: "github",
    name: "GitHub Repository",
    status: "Connected",
    tone: "ok",
    desc: "Commits, PRs, issues, README via PyGithub & MCP",
  },
  {
    key: "slack",
    name: "Slack Channels",
    status: "#proj-ledger",
    tone: "ok",
    desc: "Selected channels only via slack_sdk & MCP",
  },
  {
    key: "drive",
    name: "Google Drive",
    status: "OAuth Ready",
    tone: "warn",
    desc: "Design docs & meeting notes via Drive API",
  },
  {
    key: "jira",
    name: "Jira / Trello Board",
    status: "Connected",
    tone: "ok",
    desc: "Cards, status, assignees & stale check",
  },
];

export const DEMO_FILES = [
  { name: "Architecture_ADR_v2.pdf", size: "2.4 MB", type: "PDF" },
  { name: "README_Unfinished.md", size: "48 KB", type: "Markdown" },
  { name: "Bank_API_Meeting_Notes.docx", size: "1.1 MB", type: "Word" },
];

export const INITIAL_DOC = `# Compiled Knowledge Handover Document (v1.2)

Every claim is linked to primary evidence and confidence-scored. Conflicts are surfaced explicitly.

## 1. Summary & Architecture Rationale
Core double-entry ledger service built on FastAPI and PostgreSQL 16. Serializable isolation and advisory locks prevent double-spend concurrency bugs (verified via PR #74).

## 2. Surfaced Conflicts & Open Questions
- **Conflict:** JIRA-402 is marked "In Progress" but has zero commits in the past 6 weeks.
- **Blocker:** Blocked on Bank API limit (Contact: Priya S.). Rebuild Agent scoped to interface stub + unit tests only.
- **Verified:** JIRA-402 stale card conflict with GitHub PR #88.

## 3. First-Week Plan
1. Set up local Postgres 16 and run the ledger migrations.
2. Review ADR v2 and the serializable-isolation tests.
3. Pair with a maintainer on the Bank API stub.
`;

export const DIFF_LINES = [
  { t: "meta", s: "@@ -12,4 +12,6 @@" },
  { t: "del", s: "- Status: Pending bank API credentials." },
  {
    t: "add",
    s: "+ Status: Blocked on Bank API limit (Contact: Priya S.). Rebuild Agent scoped to interface stub + unit tests only.",
  },
  { t: "add", s: "+ Verified JIRA-402 stale card conflict with GitHub PR #88." },
];
