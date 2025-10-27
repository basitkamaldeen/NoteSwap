import { prisma } from "@/lib/prisma";

export default async function SharedNotePage({ params }: any) {
  const note = await prisma.note.findUnique({ where: { shareId: params.id } });
  if (!note) return <div className="p-10 text-center">Note not found 😢</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-3">{note.title}</h1>
      <p className="whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}
