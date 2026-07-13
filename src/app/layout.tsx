export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Job Agent</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        background: '#f5f5f5',
        color: '#1a1a1a',
        minHeight: '100vh',
      }}>
        <nav style={{
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          padding: '16px 24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <a href="/" style={{
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#0e141b',
            textDecoration: 'none',
          }}>💼 Job Agent</a>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem' }}>Search</a>
            <a href="/dashboard" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</a>
          </div>
        </nav>
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
