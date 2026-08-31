"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import PropertyQuiz from "../components/PropertyQuiz";

// The quiz modal is mounted once here rather than inside the navbar, so any
// surface can open it — the hero CTA matters most on phones, where the navbar
// button is buried in the burger menu.
const QuizContext = createContext<{ openQuiz: () => void } | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <QuizContext.Provider value={{ openQuiz: () => setOpen(true) }}>
      {children}
      <PropertyQuiz open={open} onClose={() => setOpen(false)} />
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
