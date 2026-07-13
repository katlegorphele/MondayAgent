import { NextRequest, NextResponse } from 'next/server';
import { getBaseCV, saveBaseCV } from '@/lib/db';

export async function GET() {
  const cv = getBaseCV();
  return NextResponse.json({ cv: cv?.content || null });
}

export async function POST(req: NextRequest) {
  const { content, name } = await req.json();
  saveBaseCV(name || 'My CV', content);
  return NextResponse.json({ ok: true });
}
