import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Tags API not implemented yet. Prisma schema/migrations pending.' }, { status: 501 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected shape: { noteId: string, tags: string[] }
    // If DATABASE_URL and Prisma are configured, replace this stub with real DB logic.
    return NextResponse.json({ message: 'Stub: received tags', received: body }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 400 });
  }
}
