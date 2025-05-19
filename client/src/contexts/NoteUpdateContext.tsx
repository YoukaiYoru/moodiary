import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface NoteUpdateContextType {
  knownDates: Set<string>;
  triggerNoteUpdate: (date: string) => void;
  addDate: (date: string) => void;
}

// 1. Crear el contexto
const NoteUpdateContext = createContext<NoteUpdateContextType | null>(null);

// 2. Definir el provider como constante (clave para Fast Refresh)
const NoteUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [knownDates, setKnownDates] = useState<Set<string>>(new Set());

  const triggerNoteUpdate = (date: string) => {
    setKnownDates((prev) => {
      if (prev.has(date)) return prev;
      const updated = new Set(prev);
      updated.add(date);
      return updated;
    });
  };

  const addDate = (date: string) => {
    setKnownDates((prev) => {
      const updated = new Set(prev);
      updated.add(date);
      return updated;
    });
  };

  // 3. Usar <NoteUpdateContext> como provider (React 19)
  return (
    <NoteUpdateContext value={{ knownDates, triggerNoteUpdate, addDate }}>
      {children}
    </NoteUpdateContext>
  );
};

// 4. Exports nombrados para evitar error de HMR (Vite + React 19)
export { NoteUpdateContext, NoteUpdateProvider };
