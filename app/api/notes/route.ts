import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, tags } = body; // tags: string[]

    const note = await prisma.note.create({
      data: { title: title ?? 'Untitled', content: content ?? '' },
    });

    if (Array.isArray(tags) && tags.length > 0) {
      for (const t of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: t },
          update: {},
          create: { name: t },
        });
        await prisma.noteTag.create({
          data: { noteId: note.id, tagId: tag.id },
        });
      }
    }

    return NextResponse.json(note);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: { tags: { include: { tag: true } }, favorites: true },
      orderBy: { updatedAt: 'desc' },
    });
    // normalize tags
    const normalized = notes.map((n) => ({
      ...n,
      tags: n.tags.map((nt) => nt.tag.name),
      favoriteCount: n.favorites.length,
    }));
    return NextResponse.json(normalized);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}
