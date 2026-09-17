import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Notes from "@/components/Notes";
import api from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type Note = { hour: string; emotion: string; text: string };

export default function MoodNotes() {
  const { id: dateParam } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dateParam) return;
    let isActive = true;
    const controller = new AbortController();
    const fetchNotesByDate = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication failed");
        const timezone = dayjs.tz.guess();
        const response = await api.get(`moods/entries/${dateParam}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeZone: timezone },
          signal: controller.signal,
        });
        if (!isActive) return;
        const apiNotes: { timestamp: string; emotion: string; text: string }[] =
          response.data;
        const sorted = apiNotes.sort(
          (a, b) =>
            dayjs(b.timestamp).tz(timezone).valueOf() -
            dayjs(a.timestamp).tz(timezone).valueOf()
        );
        const adapted = sorted.map((item) => ({
          hour: dayjs(item.timestamp).tz(timezone).format("hh:mm A"),
          emotion: item.emotion,
          text: item.text,
        }));
        setNotes(adapted);
      } catch (err: unknown) {
        if (isActive && !controller.signal.aborted) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(msg || "Error fetching notes");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchNotesByDate();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [dateParam, getToken]);

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-2 px-1 py-3 sm:py-5">
        <h1 className="text-center text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Notas de estado de ánimo
        </h1>
        <p className="text-center text-xs text-slate-600 sm:text-sm">
          Tus emociones de la fecha: <b>{dateParam}</b>
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 place-items-center gap-3 px-1 pb-8 text-xs sm:gap-4 sm:text-sm">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-red-700" role="alert">
            No pudimos cargar tus notas. Intenta nuevamente.
          </p>
        )}
        {loading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" role="status" aria-label="Cargando notas" />
        ) : notes.length > 0 ? (
          notes.map((note, idx) => <Notes key={idx} {...note} />)
        ) : (
          <p>No hay notas para esta fecha.</p>
        )}
      </div>
    </>
  );
}
