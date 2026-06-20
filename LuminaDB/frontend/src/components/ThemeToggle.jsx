import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer group"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
      )}
    </button>
  );
}
