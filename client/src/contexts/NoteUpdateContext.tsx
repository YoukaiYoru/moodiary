import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface NoteUpdateContextType {
  knownDates: Set<string>;
  addDate: (date: string) => void;
}

const NoteUpdateContext = createContext<NoteUpdateContextType | null>(null);

const NoteUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [knownDates, setKnownDates] = useState<Set<string>>(new Set());

  const addDate = (date: string) => {
    setKnownDates((prev) => {
      if (prev.has(date)) return prev;
      const updated = new Set(prev);
      updated.add(date);
      return updated;
    });
  };

  return (
    <NoteUpdateContext.Provider value={{ knownDates, addDate }}>
      {children}
    </NoteUpdateContext.Provider>
  );
};

export { NoteUpdateContext, NoteUpdateProvider };
