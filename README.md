# Job Agent

AI-powered job application assistant for law, compliance, forensic auditing, and finance roles.

## What it does

1. **Find jobs** — searches job boards for relevant roles
2. **Tailor CV** — rewrites CV to match each job description
3. **Write cover letter** — drafts a custom cover letter per application
4. **Track pipeline** — dashboard for: Draft → Ready → Applied → Interview → Offer

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
# Open http://localhost:3000
```

## Project Structure

```
job-agent/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Job search + results
│   │   ├── dashboard/page.tsx    # Application tracker
│   │   ├── review/page.tsx       # CV/cover letter review
│   │   └── api/                  # API routes (jobs, apply, applications, cv)
│   └── lib/
│       ├── db.ts                 # SQLite database (jobs, applications, CV)
│       └── hermes.ts             # Hermes Agent API client
├── hermes/
│   └── skills/                   # Hermes skills (job-search, cv-writer, etc.)
├── Dockerfile
├── railway.toml
└── data/                         # SQLite database file (gitignored)
```

## Deploy to Railway

```bash
railway up
```

Set environment variables in Railway dashboard:
- `HERMES_API_URL` — URL of Hermes agent (if running separately)

## TODO
- [ ] Wire Hermes agent on Railway (separate service or sidecar)
- [ ] Upload base CV through the UI
- [ ] Full browser automation for auto-apply
- [ ] Email notifications for new job matches
