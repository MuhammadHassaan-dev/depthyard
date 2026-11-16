"use client";

export function ThemeToggle() {
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center rounded-full border border-line bg-field px-4 text-sm font-semibold text-ink"
      onClick={() => {
        const root = document.documentElement;
        const next = root.classList.contains("dark") ? "light" : "dark";
        root.classList.toggle("dark", next === "dark");
        try {
          localStorage.setItem("theme", next);
        } catch {
          // The class still changes for this view when storage is blocked.
        }
      }}
    >
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  );
}
