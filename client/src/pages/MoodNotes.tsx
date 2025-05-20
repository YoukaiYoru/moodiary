import React from "react";
import { useParams } from "react-router-dom";
import Notes from "@/components/Notes";
import api from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type Note = {
  hour: string;
  emotion: string;
  text: string;
};

export default function MoodNotes() {
  const { id: dateParam } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!dateParam) return;

    const fetchNotesByDate = async () => {
      setLoading(true);
      try {
        const token = await getToken();

        // Crear dayjs para la fecha seleccionada a medianoche local
        const dateObj = dayjs.tz(`${dateParam}T00:00:00`, dayjs.tz.guess());

        // Offset en minutos para esa fecha (signo invertido para backend)
        const offsetMinutes = -dateObj.utcOffset();

        const response = await api.get(`/moods/entries/${dateParam}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { offset: offsetMinutes },
        });

        type ApiNote = {
          timestamp: string;
          emotion: string;
          text: string;
        };

        const apiNotes = response.data as ApiNote[];

        // Obtener zona horaria local
        const timezone = dayjs.tz.guess();

        // Ordenar notas por timestamp (más reciente primero), usando dayjs y zona local
        const sorted = apiNotes.sort(
          (a, b) =>
            dayjs(b.timestamp).tz(timezone).valueOf() -
            dayjs(a.timestamp).tz(timezone).valueOf()
        );

        // Mapear a tipo Note con hora formateada en zona local y hora12
        const adaptedNotes: Note[] = [];
        for (let i = 0; i < sorted.length; i++) {
          const item = sorted[i];
          const timeStr = dayjs(item.timestamp).tz(timezone).format("hh:mm A"); // Formato 12h con AM/PM
          adaptedNotes.push({
            hour: timeStr,
            emotion: item.emotion,
            text: item.text,
          });
        }

        setNotes(adaptedNotes);
      } catch (error) {
        console.error("Error fetching mood notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotesByDate();
  }, [dateParam, getToken]);

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
          Notas de estado de ánimo
        </h1>
        <p className="text-center text-sm md:text-base">
          Tus emociones de la fecha: <br className="block md:hidden" /> <span className="hidden md:inline"></span> <b>{dateParam}</b>{" "}
        </p>
      </div>

      {/* <<<<<<< HEAD */}
      <div className="grid grid-cols-1 place-items-center gap-4 p-4 text-sm md:text-base">
        {/* {DatesFromParam.map((note, index) => ( */}
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : notes.length > 0 ? (
          (() => {
            const notesElements = [];
            for (let i = 0; i < notes.length; i++) {
              const note = notes[i];
              notesElements.push(
                <Notes
                  key={note.hour + note.text}
                  hour={note.hour}
                  emotion={note.emotion}
                  text={note.text}
                />
              );
            }
            return notesElements;
          })()
        ) : (
          <p>No hay notas para esta fecha.</p>
        )}

        {/* {loading ? (
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    ) : notes.length > 0 ? (
      notes.map((note, index) => (
        <Notes
          key={index}
          hour={note.hour}
          emotion={note.emotion}
          text={note.text}
        />
      ))
    ) : (
      <p>No hay notas para esta fecha.</p>
    )}
>>>>>>> c751bc87e247351fb8ab546f6fe88599c0592837 */}
      </div>
    </>
  );
}
