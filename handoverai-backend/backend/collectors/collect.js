const { Octokit } = require('octokit');
const { WebClient } = require('@slack/web-api');
const { google } = require('googleapis');
const axios = require('axios');
const { makeRecord } = require('../schema'); // '../schema' path fix

// --- 1. GITHUB COLLECTOR ---
async function collectGithub(repoName, maxItems = 15) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = repoName.split('/');
  const records = [];

  // Commits
  const commits = await octokit.rest.repos.listCommits({ owner, repo, per_page: maxItems });
  for (const c of commits.data) {
    records.push(makeRecord({
      source: 'github',
      rtype: 'commit',
      title: (c.commit.message || '').split('\n')[0],
      body: c.commit.message || '',
      author: c.commit.author?.name || 'unknown',
      date: c.commit.author?.date || null,
      url: `https://github.com/${owner}/${repo}/commit/${c.sha}`
    }));
  }

  // Pull Requests
  const prs = await octokit.rest.pulls.list({ owner, repo, state: 'all', per_page: maxItems });
  for (const pr of prs.data) {
    records.push(makeRecord({
      source: 'github',
      rtype: 'pull_request',
      title: pr.title,
      body: pr.body || '',
      author: pr.user?.login || 'unknown',
      date: pr.created_at,
      url: pr.html_url,
      state: pr.state
    }));
  }

  // Issues
  const issues = await octokit.rest.issues.listForRepo({ owner, repo, state: 'all', per_page: maxItems });
  for (const issue of issues.data) {
    if (issue.pull_request) continue;
    records.push(makeRecord({
      source: 'github',
      rtype: 'issue',
      title: issue.title,
      body: issue.body || '',
      author: issue.user?.login || 'unknown',
      date: issue.created_at,
      url: issue.html_url,
      state: issue.state
    }));
  }

  // README
  try {
    const readme = await octokit.rest.repos.getReadme({ owner, repo });
    const content = Buffer.from(readme.data.content, 'base64').toString('utf-8');
    records.push(makeRecord({
      source: 'github',
      rtype: 'doc',
      title: `README of ${repoName}`,
      body: content,
      author: 'repo',
      date: null,
      url: readme.data.html_url
    }));
  } catch (e) {}

  console.log(`[github] Fetched ${records.length} records from ${repoName}`);
  return records;
}

// --- 2. JIRA COLLECTOR ---
async function collectJira(jql = "ORDER BY updated DESC", maxResults = 50) {
  const base = process.env.JIRA_BASE_URL.replace(/\/$/, '');
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
  
  const response = await axios.get(`${base}/rest/api/3/search`, {
    params: { jql, maxResults, fields: 'summary,description,status,assignee,reporter,created,updated' },
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }
  });

  const records = [];
  for (const issue of response.data.issues || []) {
    const key = issue.key;
    const fields = issue.fields;
    const status = fields.status?.name || 'Unknown';
    const assignee = fields.assignee?.displayName || 'unassigned';
    const reporter = fields.reporter?.displayName || 'unknown';

    records.push(makeRecord({
      source: 'jira',
      rtype: 'card',
      title: `${key}: ${fields.summary || ''}`,
      body: typeof fields.description === 'string' ? fields.description : JSON.stringify(fields.description || {}),
      author: assignee !== 'unassigned' ? assignee : reporter,
      date: fields.updated || fields.created,
      url: `${base}/browse/${key}`,
      state: status,
      assignee
    }));
  }

  console.log(`[jira] Fetched ${records.length} records`);
  return records;
}

// --- 3. SLACK COLLECTOR ---
async function collectSlack(channelIds, daysBack = 90) {
  const client = new WebClient(process.env.SLACK_USER_TOKEN);
  const oldest = Date.now() / 1000 - daysBack * 86400;
  const records = [];

  for (const channelId of channelIds) {
    try {
      const history = await client.conversations.history({ channel: channelId, oldest: String(oldest), limit: 200 });
      for (const msg of history.messages || []) {
        if (msg.subtype === 'bot_message' || msg.bot_id) continue;
        
        let userName = msg.user || 'unknown';
        try {
          const userInfo = await client.users.info({ user: msg.user });
          userName = userInfo.user?.real_name || userName;
        } catch (e) {}

        let permalink = '';
        try {
          const pl = await client.chat.getPermalink({ channel: channelId, message_ts: msg.ts });
          permalink = pl.permalink || '';
        } catch (e) {}

        const dateIso = new Date(parseFloat(msg.ts) * 1000).toISOString();
        records.push(makeRecord({
          source: 'slack',
          rtype: 'message',
          title: (msg.text || '').substring(0, 80),
          body: msg.text || '',
          author: userName,
          date: dateIso,
          url: permalink,
          channel: channelId,
          thread_ts: msg.thread_ts || null
        }));
      }
    } catch (e) {
      console.error(`[warn] Slack channel ${channelId} failed:`, e.message);
    }
  }

  console.log(`[slack] Fetched ${records.length} records across channels`);
  return records;
}

// --- 4. GOOGLE DRIVE COLLECTOR ---
async function collectDrive(folderId = null, maxFiles = 30) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) return [];
  
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
  const drive = google.drive({ version: 'v3', auth });

  let q = "trashed = false";
  if (folderId && folderId.trim() !== "") q += ` and '${folderId}' in parents`;
  else return []; // Agar folder ID nahi di hai toh drive fetch skip kar do

  const res = await drive.files.list({
    q,
    pageSize: maxFiles,
    orderBy: 'modifiedTime desc',
    fields: 'files(id, name, mimeType, modifiedTime, owners(emailAddress), webViewLink)'
  });

  const records = [];
  const exportMime = {
    'application/vnd.google-apps.document': 'text/plain',
    'application/vnd.google-apps.spreadsheet': 'text/csv',
    'application/vnd.google-apps.presentation': 'text/plain'
  };

  for (const f of res.data.files || []) {
    const owner = f.owners?.[0]?.emailAddress || 'unknown';
    let body = '';
    try {
      if (exportMime[f.mimeType]) {
        const exportRes = await drive.files.export({ fileId: f.id, mimeType: exportMime[f.mimeType] }, { responseType: 'text' });
        body = exportRes.data;
      } else if (['text/plain', 'text/markdown', 'application/json'].includes(f.mimeType)) {
        const getRes = await drive.files.get({ fileId: f.id, alt: 'media' }, { responseType: 'text' });
        body = getRes.data;
      }
    } catch (e) {}

    records.push(makeRecord({
      source: 'drive',
      rtype: 'doc',
      title: f.name,
      body,
      author: owner,
      date: f.modifiedTime,
      url: f.webViewLink || '',
      mime_type: f.mimeType
    }));
  }

  console.log(`[drive] Fetched ${records.length} records`);
  return records;
}

// --- ORCHESTRATOR: FETCH ALL SOURCES ---
async function fetchAllSources({ githubRepo, slackChannels, driveFolderId, jiraJql }) {
  let records = [];

  if (githubRepo && process.env.GITHUB_TOKEN) {
    try {
      records.push(...(await collectGithub(githubRepo)));
    } catch (e) {
      console.error('[warn] GitHub collection failed:', e.message);
    }
  }

  if (slackChannels && slackChannels.length > 0 && process.env.SLACK_USER_TOKEN) {
    try {
      records.push(...(await collectSlack(slackChannels)));
    } catch (e) {
      console.error('[warn] Slack collection failed:', e.message);
    }
  }

  // Google Drive sirf tabhi chalega jab valid folderId diya ho aur env set ho
  if (driveFolderId && driveFolderId.trim() !== "" && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      records.push(...(await collectDrive(driveFolderId)));
    } catch (e) {
      console.error('[warn] Drive collection failed:', e.message);
    }
  }

  if (process.env.JIRA_BASE_URL && process.env.JIRA_API_TOKEN && jiraJql) {
    try {
      records.push(...(await collectJira(jiraJql)));
    } catch (e) {
      console.error('[warn] Jira collection failed:', e.message);
    }
  }

  console.log(`\n=== fetchAllSources: ${records.length} total records ===`);
  return records;
}

module.exports = { fetchAllSources };