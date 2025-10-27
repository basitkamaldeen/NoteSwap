"use client";
export function Tags({ tags, onClick }: any) {
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {tags.split(",").map((t: string) => (
        <span
          key={t}
          onClick={() => onClick(t)}
          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded cursor-pointer text-sm"
        >
          #{t.trim()}
        </span>
      ))}
    </div>
  );
}
