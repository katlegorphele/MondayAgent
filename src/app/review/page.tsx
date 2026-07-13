'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('/api/applications')
      .then(r => r.json())
      .then(d => {
        const found = (d.applications || []).find((a: any) => a.id === id);
        setApp(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function markApplied() {
    if (!app) return;
    await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: app.id, status: 'applied' }),
    });
    router.push('/dashboard');
  }

  if (loading) return <p style={{ color: '#999', textAlign: 'center', padding: 60 }}>Loading...</p>;
  if (!app) return <p style={{ textAlign: 'center', padding: 60, color: '#999' }}>Application not found.</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>
        📝 Review Your Application
      </h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        {app.job_title} · {app.job_company}
      </p>

      {/* Cover Letter */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #e5e5e5',
        marginBottom: 16,
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>📄 Cover Letter</h3>
        <div style={{
          whiteSpace: 'pre-wrap',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: '#333',
          fontFamily: 'Georgia, serif',
          background: '#fafafa',
          padding: 20,
          borderRadius: 8,
          maxHeight: 400,
          overflow: 'auto',
        }}>
          {app.cover_letter || 'Not generated yet.'}
        </div>
      </div>

      {/* CV */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #e5e5e5',
        marginBottom: 24,
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>📋 Tailored CV</h3>
        <div style={{
          whiteSpace: 'pre-wrap',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: '#333',
          background: '#fafafa',
          padding: 20,
          borderRadius: 8,
          maxHeight: 400,
          overflow: 'auto',
        }}>
          {app.cv_content || 'Not generated yet.'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={markApplied}
          style={{
            padding: '14px 32px',
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          ✅ Mark as Applied
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            padding: '14px 32px',
            background: '#fff',
            color: '#555',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<p style={{ color: '#999', textAlign: 'center', padding: 60 }}>Loading...</p>}>
      <ReviewContent />
    </Suspense>
  );
}
