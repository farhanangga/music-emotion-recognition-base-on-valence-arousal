"use client";

import { Moon, Sun } from "lucide-react";

interface Props {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({
  darkMode,
  toggleDarkMode,
}: Props) {
  return (
    <nav className="border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">
            Music Emotion Recognition
          </h1>

          <p className="text-sm opacity-70">
            CNN Valence-Arousal Framework
          </p>
        </div>

        <button
          onClick={toggleDarkMode}
          className="
          w-10 h-10
          rounded-xl
          border
          border-white/10
          flex
          items-center
          justify-center
          hover:scale-110
          transition
        "
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>
      </div>
    </nav>
  );
}