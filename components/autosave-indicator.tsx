// components/autosave-indicator.tsx
"use client";
export function AutosaveIndicator({ saving }: { saving: boolean }) {
  return (
    <div className="text-sm text-gray-500">
      {saving ? "Saving…" : "All changes saved"}
    </div>
  );
}
