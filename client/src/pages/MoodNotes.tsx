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
        const response = await api.get(`/moods/entries/${dateParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        type ApiNote = {
          timestamp: string;
          emotion: string;
          text: string;
        };

        const adaptedNotes: Note[] = (response.data as ApiNote[]).map(
          (item) => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString(navigator.language); // Ej: "18/5/2025"
            const timeStr = date.toLocaleTimeString(navigator.language, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false, // Usa formato 24h
            });

            return {
              hour: `${dateStr} ${timeStr}`, // ej: "18/5/2025 23:15"
              emotion: item.emotion,
              text: item.text,
            };
          }
        );

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
