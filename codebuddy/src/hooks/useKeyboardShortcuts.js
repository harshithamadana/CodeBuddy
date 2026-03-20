import { useEffect } from "react";
import { subjects } from "../config/subjects";

export function useKeyboardShortcuts({ inputRef, onSelectSubject, onToggleMemory }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in a textarea/input (except Ctrl combos)
      const inInput = ["INPUT", "TEXTAREA"].includes(e.target.tagName);

      // Ctrl+K: focus input
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // Ctrl+B: toggle memory panel
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        onToggleMemory();
        return;
      }

      // Ctrl+1–5: select subject (only when not in an input)
      if (e.ctrlKey && !inInput && e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        const idx = parseInt(e.key, 10) - 1;
        if (subjects[idx]) onSelectSubject(subjects[idx]);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputRef, onSelectSubject, onToggleMemory]);
}
