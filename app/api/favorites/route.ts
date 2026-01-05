import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const favs = await prisma.favorite.findMany();
    return NextResponse.json(favs);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}

/**
 * POST payload:
 * { noteId: number, userId?: string, favorite: boolean }
 * If favorite=true -> create if not exists
 * If favorite=false -> remove if exists
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { noteId, userId = 'anonymous', favorite } = body;
    if (!noteId || typeof favorite !== 'boolean') {
      return NextResponse.json({ error: 'noteId and favorite(bool) required' }, { status: 400 });
    }

    if (favorite) {
      const up = await prisma.favorite.upsert({
        where: { noteId_userId: { noteId, userId } },
        update: {},
        create: { noteId, userId },
      });
      return NextResponse.json({ ok: true, favorite: up });
    } else {
      const del = await prisma.favorite.deleteMany({
        where: { noteId, userId },
      });
      return NextResponse.json({ ok: true, removed: del.count });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}
