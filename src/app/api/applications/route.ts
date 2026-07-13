import { NextRequest, NextResponse } from 'next/server';
import { getApplications, updateApplication } from '@/lib/db';

export async function GET() {
  const apps = getApplications();
  return NextResponse.json({ applications: apps });
}

export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json();
  updateApplication(id, { status, notes, ...(status === 'applied' ? { applied_at: new Date().toISOString() } : {}) });
  return NextResponse.json({ ok: true });
}
