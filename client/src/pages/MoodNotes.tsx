import React from "react";
import { useParams } from "react-router";
import Notes from "@/components/Notes";
import api from "@/lib/axios"; // tu instancia axios configurada
import { useAuth } from "@clerk/clerk-react";

export default function MoodNotes() {
  const { id: dateParam } = useParams<{ id: string }>(); // asumiendo que la ruta es /moods/entries/:id
  const { getToken } = useAuth();
  const [notes, setNotes] = React.useState<
    { hour: string; emotion: string; text: string }[]
  >([]);

  React.useEffect(() => {
    if (!dateParam) return;

    const fetchNotesByDate = async () => {
      try {
        const token = await getToken();
        const response = await api.get(`/moods/entries/${dateParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Aquí adaptas según la forma que te llegue el JSON
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching mood notes:", error);
        setNotes([]); // opcional: limpiar notas si hay error
      }
    };

    fetchNotesByDate();
  }, [dateParam, getToken]);
  // const DatesFromParam = [
  //   {
  //     hour: "13:53",
  //     emotion: "😄",
  //     text: "Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día.",
  //   },
  //   {
  //     hour: "14:53",
  //     emotion: "😍",
  //     text: "Hoy me siento triste porque he tenido un mal día.",
  //   },
  //   {
  //     hour: "15:53",
  //     emotion: "😕",
  //     text: "Hoy me siento enojado porque he tenido un mal día.",
  //   },
  //   {
  //     hour: "16:53",
  //     emotion: "🫠",
  //     text: "Hoy me siento sorprendido porque he tenido un buen día.",
  //   },
  //   {
  //     hour: "17:53",
  //     emotion: "😤",
  //     text: "Hoy me siento asqueado porque he tenido un mal día.",
  //   },
  // ];

  const [loading, setLoading] = React.useState(true);

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
        setNotes(response.data);
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
