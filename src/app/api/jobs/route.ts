import { NextRequest, NextResponse } from 'next/server';
import { searchJobs, generateCV, generateCoverLetter } from '@/lib/hermes';
import { saveJobs, createApplication, updateApplication, getBaseCV } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { query, location, remote } = await req.json();

  try {
    const jobs = await searchJobs(query, location, remote);
    if (jobs.length > 0) {
      saveJobs(jobs);
    }
    return NextResponse.json({ jobs, count: jobs.length });
  } catch (err) {
    console.error('Job search failed:', err);
    return NextResponse.json({ jobs: [], count: 0, error: 'Search failed. Try again.' });
  }
}
