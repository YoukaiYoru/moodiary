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
        const msg = err instanceof Error ? err.message : String(err);
        if (isActive) setError(msg || "Error fetching notes");
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchNotesByDate();
    return () => {
      isActive = false;
    };
  }, [dateParam, getToken]);

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
          Notas de estado de ánimo
        </h1>
        <p className="text-center text-sm md:text-base">
          Tus emociones de la fecha: <b>{dateParam}</b>
        </p>
      </div>

      <div className="grid grid-cols-1 place-items-center gap-4 p-4 text-sm md:text-base">
        {error && <p className="text-red-600">{error}</p>}
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : notes.length > 0 ? (
          notes.map((note, idx) => <Notes key={idx} {...note} />)
        ) : (
          <p>No hay notas para esta fecha.</p>
        )}
      </div>
    </>
  );
}
