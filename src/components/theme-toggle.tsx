'use client'
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []); 

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/40 text-foreground shadow-sm ring-1 ring-black/5 hover:bg-white/50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:ring-white/10 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-all duration-200" />
      ) : (
        <Moon className="h-5 w-5 transition-all duration-200" />
      )}
    </button>
  );
}