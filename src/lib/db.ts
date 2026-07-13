import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data/job-agent.db';

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(path.resolve(DB_PATH));
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS base_cv (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      file_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      description TEXT,
      url TEXT,
      source TEXT,
      salary TEXT,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES jobs(id),
      cv_content TEXT,
      cover_letter TEXT,
      status TEXT DEFAULT 'draft',
      notes TEXT,
      applied_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  url: string | null;
  source: string | null;
  salary: string | null;
  status: string;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  cv_content: string | null;
  cover_letter: string | null;
  status: string;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  job_title?: string;
  job_company?: string;
  job_location?: string;
}

export function getJobs(status?: string): Job[] {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC').all(status) as Job[];
  }
  return db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all() as Job[];
}

export function getApplications(): (Application & { job_title: string; job_company: string })[] {
  const db = getDb();
  return db.prepare(`
    SELECT a.*, j.title as job_title, j.company as job_company, j.location as job_location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    ORDER BY a.created_at DESC
  `).all() as any[];
}

export function getBaseCV(): { content: string } | undefined {
  const db = getDb();
  return db.prepare('SELECT content FROM base_cv ORDER BY id DESC LIMIT 1').get() as any;
}

export function saveBaseCV(name: string, content: string) {
  const db = getDb();
  db.prepare('INSERT INTO base_cv (name, content) VALUES (?, ?)').run(name, content);
}

export function saveJobs(jobs: Omit<Job, 'created_at' | 'status'>[]) {
  const db = getDb();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO jobs (id, title, company, location, description, url, source, salary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const tx = db.transaction(() => {
    for (const j of jobs) {
      insert.run(j.id, j.title, j.company, j.location, j.description, j.url, j.source, j.salary);
    }
  });
  tx();
  return getJobs();
}

export function createApplication(jobId: string): Application {
  const db = getDb();
  const id = 'app_' + Date.now().toString(36);
  db.prepare('INSERT INTO applications (id, job_id, status) VALUES (?, ?, ?)').run(id, jobId, 'draft');
  return db.prepare('SELECT * FROM applications WHERE id = ?').get(id) as Application;
}

export function updateApplication(id: string, data: Partial<Pick<Application, 'cv_content' | 'cover_letter' | 'status' | 'notes' | 'applied_at'>>) {
  const db = getDb();
  const sets: string[] = [];
  const vals: any[] = [];
  for (const [k, v] of Object.entries(data)) {
    sets.push(`${k} = ?`);
    vals.push(v);
  }
  sets.push("updated_at = datetime('now')");
  db.prepare(`UPDATE applications SET ${sets.join(', ')} WHERE id = ?`).run(...vals, id);
}

export function getPreference(key: string): string | undefined {
  const db = getDb();
  const row = db.prepare('SELECT value FROM preferences WHERE key = ?').get(key) as any;
  return row?.value;
}

export function setPreference(key: string, value: string) {
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)').run(key, value);
}
