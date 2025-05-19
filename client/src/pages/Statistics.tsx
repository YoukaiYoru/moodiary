import ChartEmotion from "@/components/ChartEmotion";
import EmojiCalendar from "../components/EmojiCalendar";

const chartData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );

  return {
    date: date.toISOString(),
    Alegría: Math.floor(Math.random() * 100),
    Tristeza: Math.floor(Math.random() * 100),
    Calma: Math.floor(Math.random() * 100),
    Ansiedad: Math.floor(Math.random() * 100),
    Enojo: Math.floor(Math.random() * 100),
  };
});

const imageURL = "/src/assets/happy.webp";

const chartConfig = {
  Alegría: { label: "Alegría", color: "var(--chart-1)" },
  Calma: { label: "Calma", color: "var(--chart-2)" },
  Ansiedad: { label: "Ansiedad", color: "var(--chart-3)" },
  Tristeza: { label: "Tristeza", color: "var(--chart-4)" },
  Enojo: { label: "Enojo", color: "var(--chart-5)" },
};

const phrase =
  "Concentra todos tus pensamientos sobre el trabajo en una mano. Los rayos del sol no queman hasta que hacen foco";

export default function Statistics() {
  return (
    // Sexta idea
    <div className="space-y-6 px-1 sm:px-4 pb-8">
      <h1 className="text-3xl font-dosis tracking-wider font-semibold text-gray-900 dark:text-white text-center">
        Mira tu evolución emocional
      </h1>

      {/* Móvil: Emoji y Calendario en fila */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Emoji */}
          <div className="flex-1 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-2 sm:p-4 flex flex-col items-center justify-center h-32 sm:h-auto">
            <img
              src={imageURL}
              alt="Emoji"
              className="w-10 h-10 md:w-20 md:h-20 object-cover rounded-full mb-2"
            />
            <p className="text-sm text-gray-700 dark:text-gray-200 text-center">
              Estado más frecuente
            </p>
          </div>

          {/* Calendario */}
          <div className="flex-1 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-2 sm:p-4 h-32 sm:h-auto flex justify-center items-center">
            <div className="scale-75 h-92 sm:scale-75 origin-top pt-4">
              <EmojiCalendar />
            </div>
          </div>
        </div>

        {/* Frase */}
        <div className="bg-white dark:bg-[#1F1F1F] flex items-center text-center p-6 rounded-2xl shadow-md border">
          <h2 className="font-lobster text-md p-0 text-[hsl(204,18%,20%)] dark:text-white">
            {phrase}
          </h2>
        </div>
      </div>

      {/* Escritorio: Emoji + Frase a la izquierda, Calendario a la derecha */}
      <div className="hidden md:grid grid-cols-5 gap-4 items-stretch">
        {/* Columna izquierda: Emoji y frase */}
        <div className="flex flex-col gap-4 col-span-2 lg:col-span-3 h-full">
          {/* Emoji */}
          <div className="flex flex-row items-center justify-evenly h-1/3 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-4">
            <img
              src={imageURL}
              alt="Emoji"
              className="w-20 h-20 xl:w-24 xl:h-24 object-cover rounded-full mb-2"
            />
            <p className="text-xl text-gray-700 dark:text-gray-200 text-center">
              Estado más frecuente
            </p>
          </div>
        
          {/* Frase */}
          <div className="bg-white dark:bg-[#1F1F1F] flex items-center text-center p-6 rounded-2xl shadow-md h-2/3 border">
            <h2 className="font-lobster text-4xl md:text-2xl lg:text-3xl p-4 text-[hsl(204,18%,20%)] dark:text-white font-semibold leading-snug">
              {phrase}
            </h2>
          </div>
        </div>

        {/* Columna derecha: Calendario */}
        <div className="bg-white dark:bg-[#1F1F1F] col-span-3 lg:col-span-2 rounded-2xl shadow-md p-6 h-full">
          <div className="scale-150 md:scale-100 lg:scale-110 lg:pt-3">
            <EmojiCalendar />
          </div>
        </div>
      </div>

      {/* Gráfico debajo vista escritorio */}
      <div className=" bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-2 max-h-[500px] overflow-auto">
        <ChartEmotion
          title="Emociones vs Tiempo"
          description="Mira lo hermoso que es tu evolución emocional"
          data={chartData}
          config={chartConfig}
          referenceDate={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
  );
}
