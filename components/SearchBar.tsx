"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [term, setTerm] = useState("");

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder="Search your notes..."
        className="w-full px-5 py-3 rounded-full bg-white/10 backdrop-blur text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <Search className="absolute right-4 top-3.5 text-gray-300" />
    </div>
  );
}
