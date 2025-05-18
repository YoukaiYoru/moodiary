import { useParams } from "react-router";
import Notes from "@/components/Notes";

export default function MoodNotes() {
  const params = useParams();

  //  <p className='emotion-button'>😄</p>
  //           <p className='emotion-button'>😍</p>
  //           <p className='emotion-button'>😕</p>
  //           <p className='emotion-button'>🫠</p>
  //           <p className='emotion-button'>😤</p>
  //           <p className='emotion-button'>😡</p>
  // Simulación de datos que podrías recibir de una API en base al params.id
  const DatesFromParam = [
    {
      hour: "13:53",
      emotion: "😄",
      text: "Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día. Hoy me siento feliz porque he tenido un buen día.",
    },
    {
      hour: "14:53",
      emotion: "😍",
      text: "Hoy me siento triste porque he tenido un mal día.",
    },
    {
      hour: "15:53",
      emotion: "😕",
      text: "Hoy me siento enojado porque he tenido un mal día.",
    },
    {
      hour: "16:53",
      emotion: "🫠",
      text: "Hoy me siento sorprendido porque he tenido un buen día.",
    },
    {
      hour: "17:53",
      emotion: "😤",
      text: "Hoy me siento asqueado porque he tenido un mal día.",
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Notas de estado de ánimo
        </h1>
        <p className="text-center">
          Tus emociones de la fecha: <b>{params.id}</b>{" "}
        </p>
      </div>

      <div className="grid grid-cols-1 place-items-center gap-4 p-4">
        {DatesFromParam.map((note, index) => (
          <Notes
            key={index}
            hour={note.hour}
            emotion={note.emotion}
            text={note.text}
          />
        ))}
      </div>
    </>
  );
}
