import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

    const note = await prisma.note.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } }, favorites: true, versions: true, shareLinks: true },
    });
    if (!note) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const normalized = {
      ...note,
      tags: note.tags.map((nt) => nt.tag.name),
      favoriteCount: note.favorites.length,
    };
    return NextResponse.json(normalized);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 });
  }
}
