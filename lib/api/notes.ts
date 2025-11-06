// NOTE: This file was refactored to avoid calling server-only auth() inside client-shippable code.
// Callers that run in the browser should obtain a token (e.g., via Clerk client getToken()) and pass it in.

import type { Note } from "@prisma/client";

export interface NoteInput {
  title: string;
  content?: string;
  tags?: string[];
  isShared?: boolean;
}

const BASE_URL = "/api/notes";

/**
 * fetchJSON now accepts an optional token param.
 * If you call these helpers from client components, obtain a token on the client and pass it.
 */
async function fetchJSON(url: string, options: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ✅ Create Note
export async function createNote(data: NoteInput, token?: string): Promise<Note> {
  const result = await fetchJSON(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  }, token);
  return result.data;
}

// ✅ Get Notes (search + pagination)
export async function getNotes(params?: { q?: string; page?: number; limit?: number }, token?: string) {
  const url = new URL(BASE_URL, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.page) url.searchParams.set("page", params.page.toString());
  if (params?.limit) url.searchParams.set("limit", params.limit.toString());

  const result = await fetchJSON(url.toString(), {}, token);
  return result.data;
}

// ✅ Update Note
export async function updateNote(id: string, data: Partial<NoteInput>, token?: string): Promise<Note> {
  const result = await fetchJSON(BASE_URL, {
    method: "PUT",
    body: JSON.stringify({ id, ...data }),
  }, token);
  return result.data;
}

// ✅ Delete Note
export async function deleteNote(id: string, token?: string): Promise<{ id: string }> {
  const result = await fetchJSON(`${BASE_URL}?id=${id}`, { method: "DELETE" }, token);
  return result.data;
}