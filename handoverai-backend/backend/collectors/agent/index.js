const { StateGraph } = require("@langchain/langgraph");
const { 
  collectorNode, 
  analystNode, 
  riskNode, 
  timelineNode, 
  actionPlannerNode, 
  compilerNode, 
  rebuildNode 
} = require('./all_nodes');

// Define graph state schema
const graphState = {
  records: { value: (x, y) => y, default: () => [] },
  analysis: { value: (x, y) => y, default: () => "" },
  risks: { value: (x, y) => y, default: () => "" },
  timeline: { value: (x, y) => y, default: () => "" },
  plan: { value: (x, y) => y, default: () => "" },
  handover_doc: { value: (x, y) => y, default: () => "" },
  pr_status: { value: (x, y) => y, default: () => "" }
};

const workflow = new StateGraph({ channels: graphState });

// Add nodes with unique names
workflow.addNode("collector_node", collectorNode);
workflow.addNode("analyst_node", analystNode);
workflow.addNode("risk_node", riskNode);
workflow.addNode("timeline_node", timelineNode);
workflow.addNode("action_planner_node", actionPlannerNode);
workflow.addNode("compiler_node", compilerNode);
workflow.addNode("rebuild_node", rebuildNode);

// Define workflow edges using the exact node names
workflow.addEdge("__start__", "collector_node");
workflow.addEdge("collector_node", "analyst_node");
workflow.addEdge("collector_node", "risk_node");
workflow.addEdge("collector_node", "timeline_node");
workflow.addEdge("collector_node", "action_planner_node");

// Fan-in to compiler
workflow.addEdge("analyst_node", "compiler_node");
workflow.addEdge("risk_node", "compiler_node");
workflow.addEdge("timeline_node", "compiler_node");
workflow.addEdge("action_planner_node", "compiler_node");

// Compiler leads to Rebuild agent
workflow.addEdge("compiler_node", "rebuild_node");
workflow.addEdge("rebuild_node", "__end__");

const appGraph = workflow.compile();
module.exports = { appGraph };