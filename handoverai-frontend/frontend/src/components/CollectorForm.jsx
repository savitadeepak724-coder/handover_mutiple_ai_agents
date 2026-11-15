import React, { useState } from 'react';

export default function CollectorForm() {
  const [githubRepo, setGithubRepo] = useState('');
  const [slackChannel, setSlackChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError('');

    try {
      // Changed endpoint from /api/collect to /api/handover to run all 7 agents
      const res = await fetch('http://localhost:5000/api/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          github_repo: githubRepo,
          slack_channels: slackChannel ? [slackChannel] : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run handover pipeline');
      
      setResponse(data.handover);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Project Handover: Multi-Agent Pipeline</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="GitHub Repo (e.g. octocat/Hello-World)"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '15px' }}
        />
        <input
          type="text"
          placeholder="Slack Channel ID (optional)"
          value={slackChannel}
          onChange={(e) => setSlackChannel(e.target.value)}
          style={{ padding: '10px', fontSize: '15px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px', background: '#0f172a', color: '#fff', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Running 7 AI Agents & Generating Handover...' : 'Generate Handover'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}

      {response && (
        <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Agent Pipeline Results</h3>
          
          <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h4>Analyst Summary</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{response.analysis}</p>
          </div>

          <div style={{ padding: '15px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
            <h4>Risks & Blockers</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{response.risks}</p>
          </div>

          <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
            <h4>Timeline Cards</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{response.timeline}</p>
          </div>

          <div style={{ padding: '15px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
            <h4>Action Plan</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{response.plan}</p>
          </div>

          <div style={{ padding: '15px', background: '#f1f5f9', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <h4>Compiler Handover Document</h4>
            <p style={{ whiteSpace: 'pre-wrap', fontWeight: '500' }}>{response.handover_doc}</p>
          </div>

          <div style={{ padding: '15px', background: '#faf5ff', borderRadius: '6px', border: '1px solid #e9d5ff' }}>
            <h4>Rebuild Agent / PR Status</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{response.pr_status}</p>
          </div>
        </div>
      )}
    </div>
  );
}