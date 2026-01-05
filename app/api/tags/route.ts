import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(tags);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}

/**
 * POST payloads:
 * - Create tags for a note: { noteId: number, tags: string[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { noteId, tags } = body;
    if (!noteId || !Array.isArray(tags)) {
      return NextResponse.json({ error: 'noteId and tags required' }, { status: 400 });
    }

    const created: any[] = [];
    for (const t of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: t },
        update: {},
        create: { name: t },
      });
      await prisma.noteTag.upsert({
        where: { noteId_tagId: { noteId, tagId: tag.id } },
        update: {},
        create: { noteId, tagId: tag.id },
      }).catch(() => {});
      created.push(tag);
    }

    return NextResponse.json({ ok: true, created });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}
