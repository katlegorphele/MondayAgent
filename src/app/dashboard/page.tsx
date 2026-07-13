'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications')
      .then(r => r.json())
      .then(d => setApps(d.applications || []))
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    draft: '#f59e0b',
    ready: '#3b82f6',
    applied: '#22c55e',
    interview: '#8b5cf6',
    offer: '#ec4899',
    rejected: '#ef4444',
    archived: '#9ca3af',
  };

  const stages = [
    { key: 'draft', label: 'Draft ✏️' },
    { key: 'ready', label: 'Ready 📝' },
    { key: 'applied', label: 'Applied ✅' },
    { key: 'interview', label: 'Interview 🗣️' },
    { key: 'offer', label: 'Offer 🎉' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const grouped = stages.map(stage => ({
    ...stage,
    items: apps.filter(a => a.status === stage.key),
  }));

  async function moveApp(id: string, status: string) {
    await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  if (loading) return <p style={{ color: '#999', textAlign: 'center', padding: 60 }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 24 }}>📊 Application Tracker</h1>

      {apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No applications yet</p>
          <p><a href="/" style={{ color: '#0e141b' }}>Search for jobs →</a></p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {grouped.map(stage => stage.items.length > 0 && (
            <div key={stage.key}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: statusColors[stage.key],
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                {stage.label} ({stage.items.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stage.items.map((app: any) => (
                  <div key={app.id} style={{
                    background: '#fff',
                    borderRadius: 10,
                    padding: '16px 20px',
                    border: '1px solid #e5e5e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                  }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.95rem' }}>
                        {app.job_title}
                      </p>
                      <p style={{ margin: 0, color: '#777', fontSize: '0.85rem' }}>
                        {app.job_company}{app.job_location ? ` · ${app.job_location}` : ''}
                      </p>
                      {app.applied_at && (
                        <p style={{ margin: '4px 0 0', color: '#999', fontSize: '0.75rem' }}>
                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {app.status === 'ready' && (
                        <a href={`/review?id=${app.id}`} style={{
                          fontSize: '0.8rem', color: '#0e141b', textDecoration: 'underline', marginRight: 8,
                        }}>View</a>
                      )}
                      <select
                        value={app.status}
                        onChange={e => moveApp(app.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #ddd',
                          borderRadius: 6,
                          fontSize: '0.82rem',
                          background: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        {stages.map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
