"use client";
import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <input
      className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
      placeholder="Search notes..."
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onSearch(e.target.value);
      }}
    />
  );
}
