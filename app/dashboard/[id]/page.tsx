import NoteEditor from "@/components/NoteEditor";

export default function DashboardNotePage({ params }: { params: { id: string } }) {
  const handleSave = async (content: string) => {
    await fetch(`/api/notes/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  };

  return (
    <main className="min-h-screen p-6 bg-slate-950 text-white">
      <h1 className="text-2xl font-semibold mb-4">Edit Note</h1>
      <NoteEditor noteId={params.id} onSave={handleSave} />
    </main>
  );
}