import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ChartEmotion from "@/components/ChartEmotion";
import { Calendar } from "@ui/calendar";
import { useAuth } from "@clerk/clerk-react";

const chartConfig = {
  Alegría: { label: "Alegría", color: "var(--chart-1)" },
  Calma: { label: "Calma", color: "var(--chart-2)" },
  Ansiedad: { label: "Ansiedad", color: "var(--chart-3)" },
  Tristeza: { label: "Tristeza", color: "var(--chart-4)" },
  Enojo: { label: "Enojo", color: "var(--chart-5)" },
};

const imageURL = "/src/assets/happy.webp";

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("1d");
  const { getToken } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [phrase, setPhrase] = useState("No hay frase motivacional disponible");

  // useEffect para traer los datos del gráfico
  useEffect(() => {
    async function fetchChartData() {
      try {
        const token = await getToken();
        const response = await api.get(`/moods/chart?range=${timeRange}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchChartData();
  }, [timeRange, getToken]);

  // useEffect para traer la frase motivacional
  useEffect(() => {
    async function fetchMotivationalQuote() {
      try {
        const token = await getToken();
        const response = await api.get("/motivationalQuotes/today", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Asumiendo que la frase viene en response.data.phrase o similar
        setPhrase(response.data.phrase || phrase);
      } catch (error) {
        console.error("Error fetching motivational quote:", error);
      }
    }
    fetchMotivationalQuote();
  }, [getToken, phrase]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">
        Mira tu evolución emocional
      </h1>

      {/* Header Row with Title + Image */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="sm:col-span-2 flex justify-center sm:justify-start items-center border border-red-500 h-full rounded-2xl">
          <h2 className="text-2xl font-semibold text-red-600 text-center m-4">
            {phrase}
          </h2>
        </div>

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
            timeRange={timeRange}
            onRangeChange={(value) =>
              setTimeRange(value as "1d" | "7d" | "30d")
            }
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
