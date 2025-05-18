import React from "react";
import { useParams } from "react-router-dom";
import Notes from "@/components/Notes";
import api from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";

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
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Ej: "America/Lima"

        const response = await api.get(`/moods/entries/${dateParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { timezone }, // Enviar zona horaria al backend
        });

        type ApiNote = {
          timestamp: string;
          emotion: string;
          text: string;
        };

        const notes = response.data as ApiNote[];

        // Ordenar primero por hora (más reciente primero) en la zona horaria del usuario
        const sorted = notes.sort((a, b) => {
          const aDate = new Date(a.timestamp).toLocaleString("en-US", {
            timeZone: timezone,
          });
          const bDate = new Date(b.timestamp).toLocaleString("en-US", {
            timeZone: timezone,
          });
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });

        // Adaptar los datos
        const adaptedNotes: Note[] = sorted.map((item) => {
          const date = new Date(item.timestamp);

          const timeStr = date.toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: timezone,
          });

          return {
            hour: timeStr, // Solo hora, ej: "23:54"
            emotion: item.emotion,
            text: item.text,
          };
        });

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
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Notas de estado de ánimo
        </h1>
        <p className="text-center">
          Tus emociones de la fecha: <b>{dateParam}</b>
        </p>
      </div>

      <div className="grid grid-cols-1 place-items-center gap-4 p-4">
        {loading ? (
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
      </div>
    </>
  );
}
