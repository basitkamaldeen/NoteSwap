import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Favorites API not implemented yet. Prisma schema/migrations pending.' }, { status: 501 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected: { noteId: string, favorite: boolean }
    return NextResponse.json({ message: 'Stub: favorite toggled', received: body }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 400 });
  }
}
