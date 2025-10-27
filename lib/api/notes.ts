import { auth } from "@clerk/nextjs";
import type { Note } from "@prisma/client";

export interface NoteInput {
  title: string;
  content?: string;
  tags?: string[];
  isShared?: boolean;
}

const BASE_URL = "/api/notes";

async function fetchJSON(url: string, options: RequestInit = {}) {
  const { getToken } = auth();
  const token = await getToken({ template: "default" });

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ✅ Create Note
export async function createNote(data: NoteInput): Promise<Note> {
  const result = await fetchJSON(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return result.data;
}

// ✅ Get Notes (search + pagination)
export async function getNotes(params?: { q?: string; page?: number; limit?: number }) {
  const url = new URL(BASE_URL, window.location.origin);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.page) url.searchParams.set("page", params.page.toString());
  if (params?.limit) url.searchParams.set("limit", params.limit.toString());

  const result = await fetchJSON(url.toString());
  return result.data;
}

// ✅ Update Note
export async function updateNote(id: string, data: Partial<NoteInput>): Promise<Note> {
  const result = await fetchJSON(BASE_URL, {
    method: "PUT",
    body: JSON.stringify({ id, ...data }),
  });
  return result.data;
}

// ✅ Delete Note
export async function deleteNote(id: string): Promise<{ id: string }> {
  const result = await fetchJSON(`${BASE_URL}?id=${id}`, { method: "DELETE" });
  return result.data;
}
