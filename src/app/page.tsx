'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);
  const router = useRouter();

  async function search() {
    setLoading(true);
    setError('');
    setJobs([]);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location: location || undefined, remote }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      setJobs(data.jobs || []);
    } catch {
      setError('Search failed. Check your connection.');
    }
    setLoading(false);
  }

  async function apply(jobId: string) {
    setGenerating(jobId);
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId }),
    });
    const data = await res.json();
    setGenerating(null);
    if (data.application) {
      router.push(`/review?id=${data.application.id}`);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Find Your Next Role</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Tell me what you're looking for and I'll find matching jobs, tailor your CV, and draft your cover letter.
      </p>

      {/* Search form */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #e5e5e5',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Job title or keywords..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            style={{
              flex: 2,
              minWidth: 200,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: '0.95rem',
            }}
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{
              flex: 1,
              minWidth: 150,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: '0.95rem',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: '#555', cursor: 'pointer' }}>
            <input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} />
            Remote only
          </label>
          <button
            onClick={search}
            disabled={!query || loading}
            style={{
              padding: '12px 28px',
              background: query ? '#0e141b' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: query ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24, color: '#991b1b', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Results */}
      {jobs.length > 0 && (
        <div>
          <p style={{ color: '#666', marginBottom: 16, fontSize: '0.9rem' }}>{jobs.length} jobs found</p>
          {jobs.map((job: any) => (
            <div key={job.id} style={{
              background: '#fff',
              borderRadius: 10,
              padding: 20,
              border: '1px solid #e5e5e5',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem' }}>{job.title}</h3>
                  <p style={{ margin: '0 0 4px', color: '#555', fontSize: '0.9rem' }}>
                    {job.company}{job.location ? ` · ${job.location}` : ''}
                  </p>
                  {job.salary && <p style={{ margin: '0 0 8px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>{job.salary}</p>}
                  <p style={{ margin: 0, color: '#777', fontSize: '0.88rem', lineHeight: 1.5 }}>{job.description}</p>
                </div>
                <button
                  onClick={() => apply(job.id)}
                  disabled={generating === job.id}
                  style={{
                    padding: '10px 20px',
                    background: generating === job.id ? '#ccc' : '#0e141b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: generating === job.id ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {generating === job.id ? 'Writing...' : 'Apply →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
