import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 🧩 UPDATE – PATCH (Edit a note)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content, tags } = await req.json();

    const updated = await prisma.note.updateMany({
      where: { id: params.id, userId },
      data: {
        title,
        content,
        tags: Array.isArray(tags) ? tags.join(",") : "",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[UPDATE_NOTE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// 🧩 DELETE – DELETE (Remove a note)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.note.deleteMany({
      where: { id: params.id, userId },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("[DELETE_NOTE_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
