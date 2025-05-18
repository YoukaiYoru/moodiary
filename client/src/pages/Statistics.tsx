import ChartEmotion from "@/components/ChartEmotion";
import { Calendar } from "@ui/calendar";

//Data de ejemplo para el gráfico
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

const imageURL = "/src/assets/happy.webp"; // URL de la imagen del emoji

// Fechas con emojis

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
    <div className=" space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">
        Mira tu evolución emocional
      </h1>

      {/* Header Row with Title + Image */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Text (spans 2 on larger screens) */}
        <div className="sm:col-span-2 flex justify-center sm:justify-start items-center border border-red-500 h-full rounded-2xl">
          <h2 className="text-2xl font-semibold text-red-600 text-center m-4">
            {phrase}
          </h2>
        </div>

        {/* Image + Label */}
        <div className="flex flex-col items-center border border-red-500 rounded-2xl p-4 shadow-sm">
          <img
            src={imageURL}
            alt="Example"
            className="w-20 h-20 object-cover rounded-full mb-2"
          />
          <p className="text-sm text-gray-700 text-center">Image label</p>
        </div>
      </div>

      {/* Chart + Calendar Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-h-[500px] overflow-auto">
          <ChartEmotion
            title="Emociones vs Tiempo"
            description="Mira lo hermoso que es tu evolución emocional"
            data={chartData}
            config={chartConfig}
            referenceDate={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="w-full lg:w-1/4 flex flex-col border border-red-500 rounded-2xl p-4 shadow-sm">
          <div className="flex-1">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
