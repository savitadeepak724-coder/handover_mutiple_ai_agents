require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import your db.js module
const { fetchAllSources } = require('./collectors/collect');
const { appGraph } = require('./collectors/agent/index'); // LangGraph pipeline import

const app = express();
app.use(express.json());
app.use(cors());

async function saveRecordsToDatabase(records) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      INSERT INTO project_records (source, rtype, title, body, author, date, url, state, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    for (const r of records) {
      const { source, rtype, title, body, author, date, url, state = null, ...meta } = r;
      await client.query(query, [
        source,
        rtype,
        title,
        body,
        author,
        date,
        url,
        state,
        JSON.stringify(meta)
      ]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// --- 1. Collector Route ---
app.post('/api/collect', async (req, res) => {
  const { github_repo, slack_channels, drive_folder_id, jira_jql } = req.body;
  try {
    const records = await fetchAllSources({
      githubRepo: github_repo,
      slackChannels: slack_channels,
      driveFolderId: drive_folder_id,
      jiraJql: jira_jql || "ORDER BY updated DESC"
    });

    if (records.length > 0) {
      await saveRecordsToDatabase(records);
    }

    res.json({ status: 'success', total_collected: records.length, records });
  } catch (err) {
    console.error("Collector Route Error:", err); // Added error logging
    res.status(500).json({ error: err.message });
  }
});

// --- 2. Full LangGraph Handover Route ---
app.post('/api/handover', async (req, res) => {
  const { github_repo, slack_channels, drive_folder_id, jira_jql } = req.body;
  try {
    const records = await fetchAllSources({
      githubRepo: github_repo,
      slackChannels: slack_channels,
      driveFolderId: drive_folder_id,
      jiraJql: jira_jql || "ORDER BY updated DESC"
    });

    if (records.length > 0) {
      await saveRecordsToDatabase(records);
    }

    // Run the multi-agent graph (Agents 2 to 7)
    const finalState = await appGraph.invoke({ records });

    res.json({
      status: 'success',
      handover: finalState
    });
  } catch (err) {
    console.error("Handover Pipeline Error Details:", err); // Added detailed error logging
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));