import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NoteEditor from "@/components/note-editor";
import Navbar from "@/components/navbar";

interface NotePageProps {
  params: { id: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let note = await prisma.note.findUnique({
    where: { id: params.id, userId: user.id },
  });

  // Create new blank note if user visits /dashboard/new
  if (!note && params.id === "new") {
    note = await prisma.note.create({
      data: {
        title: "Untitled Note",
        content: "",
        userId: user.id,
        tags: "",
      },
    });
    redirect(`/dashboard/${note.id}`);
  }

  if (!note) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <NoteEditor note={note} />
      </div>
    </main>
  );
}
