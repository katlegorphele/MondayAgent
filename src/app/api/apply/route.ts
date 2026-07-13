import { NextRequest, NextResponse } from 'next/server';
import { getJobs, createApplication, updateApplication, getBaseCV } from '@/lib/db';
import { generateCV, generateCoverLetter } from '@/lib/hermes';

export async function GET() {
  const jobs = getJobs('new');
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  const jobs = getJobs();
  const job = jobs.find(j => j.id === jobId);
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const baseCV = getBaseCV();
  const cvContent = baseCV?.content || '';

  // Create application
  const app = createApplication(jobId);

  // Generate CV and cover letter in parallel
  const [cv, coverLetter] = await Promise.all([
    generateCV(job.description || job.title, cvContent),
    generateCoverLetter(job.title, job.company, job.description || '', cvContent),
  ]);

  updateApplication(app.id, { cv_content: cv, cover_letter: coverLetter, status: 'ready' });

  return NextResponse.json({
    application: { ...app, cv_content: cv, cover_letter: coverLetter },
  });
}
