import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface NoteUpdateContextType {
  knownDates: Set<string>;
  addDate: (date: string) => void;
  setDates: (dates: string[]) => void;
}

const NoteUpdateContext = createContext<NoteUpdateContextType | null>(null);

const NoteUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [knownDates, setKnownDates] = useState<Set<string>>(new Set());

  const addDate = useCallback((date: string) => {
    setKnownDates((prev) => {
      if (prev.has(date)) return prev;
      const updated = new Set(prev);
      updated.add(date);
      return updated;
    });
  }, []);

  const setDates = useCallback((dates: string[]) => {
    setKnownDates(new Set(dates));
  }, []);

  const value = useMemo(
    () => ({ knownDates, addDate, setDates }),
    [knownDates, addDate, setDates],
  );

  return (
    <NoteUpdateContext.Provider value={value}>
      {children}
    </NoteUpdateContext.Provider>
  );
};

export { NoteUpdateContext, NoteUpdateProvider };
