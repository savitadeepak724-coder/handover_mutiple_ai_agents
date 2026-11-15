const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatAnthropic } = require("@langchain/anthropic");
const db = require('../../db'); // '../db' ki jagah '../../db' karein

// --- Agent 1: Collector ---
async function collectorNode(state) {
  console.log("[Agent 1] Running Collector & Fetching from DB...");
  // Database se saare collected records nikal lo
  const res = await db.query("SELECT * FROM project_records ORDER BY date DESC LIMIT 20");
  return { ...state, records: res.rows };
}

// --- Agent 2: Analyst (Gemini 1.5 Pro) ---
async function analystNode(state) {
  console.log("[Agent 2] Running Analyst with Gemini 1.5 Pro...");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `You are Agent 2 (Analyst). Read these project records and summarize key decisions, tech choices, and ownership in clean JSON:\n${JSON.stringify(state.records)}`;
  const response = await llm.invoke(prompt);
  
  return { ...state, analysis: response.content };
}

// --- Agent 3: Risk and Dependency (Claude 3.5 Sonnet) ---
async function riskNode(state) {
  console.log("[Agent 3] Running Risk Agent with Claude 3.5 Sonnet...");
  const llm = new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
    temperature: 0,
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `You are Agent 3 (Risk & Dependency). Scan these records to find stale work, unassigned cards, blockers, and dependencies:\n${JSON.stringify(state.records)}`;
  const response = await llm.invoke(prompt);

  return { ...state, risks: response.content };
}

// --- Agent 4: Timeline (Gemini 1.5 Flash) ---
async function timelineNode(state) {
  console.log("[Agent 4] Running Timeline Agent with Gemini 1.5 Flash...");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `You are Agent 4 (Timeline). Convert project activity and commits into chronological decision cards:\n${JSON.stringify(state.records)}`;
  const response = await llm.invoke(prompt);

  return { ...state, timeline: response.content };
}

// --- Agent 5: Action Planner (GPT-4o) ---
async function actionPlannerNode(state) {
  console.log("[Agent 5] Running Action Planner with GPT-4o...");
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `You are Agent 5 (Action Planner). Build a structured first-week action plan for the incoming person using logical dependencies:\n${JSON.stringify(state.records)}`;
  const response = await llm.invoke(prompt);

  return { ...state, plan: response.content };
}

// --- Agent 6: Compiler (Gemini 1.5 Pro) ---
async function compilerNode(state) {
  console.log("[Agent 6] Running Compiler with Gemini 1.5 Pro...");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const combinedData = `Analysis: ${state.analysis}\nRisks: ${state.risks}\nTimeline: ${state.timeline}\nPlan: ${state.plan}`;
  const prompt = `You are Agent 6 (Compiler). Combine all these agent outputs into one final smooth handover document with source links:\n${combinedData}`;
  const response = await llm.invoke(prompt);

  return { ...state, handover_doc: response.content };
}

// --- Agent 7: Rebuild Agent (Claude 3.5 Sonnet) ---
async function rebuildNode(state) {
  console.log("[Agent 7] Running Rebuild Agent with Claude 3.5 Sonnet...");
  const llm = new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
    temperature: 0,
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `You are Agent 7 (Rebuild Agent). Read this approved handover document, list incomplete items, and prepare the draft PR summary:\n${state.handover_doc}`;
  const response = await llm.invoke(prompt);

  return { ...state, pr_status: response.content };
}

module.exports = {
  collectorNode,
  analystNode,
  riskNode,
  timelineNode,
  actionPlannerNode,
  compilerNode,
  rebuildNode
};
