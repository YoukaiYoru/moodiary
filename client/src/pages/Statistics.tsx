import { useEffect, useState } from "react";
import api from "@/lib/axios";
import axios from "axios";
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

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("1d");
  const { getToken } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [phrase, setPhrase] = useState("No hay frase motivacional disponible");
  const [averageMood, setAverageMood] = useState<{
    average: number;
    emoji: string;
    name?: string;
  } | null>(null);

  // useEffect para traer los datos del gráfico
  useEffect(() => {
    async function fetchChartData() {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const clientDateISO = new Date().toISOString();

        const response = await api.get("/moods/chart", {
          params: {
            range: timeRange,
            clientDateISO,
          },
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
  }, [getToken, timeRange]);

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
        setPhrase(
          response.data.message || "No hay frase motivacional disponible"
        );
      } catch (error) {
        console.error("Error fetching motivational quote:", error);
      }
    }
    fetchMotivationalQuote();
  }, [getToken]);

  // useEffect para traer el estado de ánimo promedio
  useEffect(() => {
    const fetchAverageMood = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const now = new Date(); // Fecha y hora actuales del cliente
        now.setHours(0, 0, 0, 0); // Setea a medianoche local del cliente
        const clientDateUTC = now.toISOString(); // Convierte a UTC para enviar al backend

        console.log("Client Date UTC:", clientDateUTC);
        const response = await api.get(
          `/moods/average/today?date=${clientDateUTC}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAverageMood(response.data);
      } catch (error: unknown) {
        let message = "Error desconocido";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.error || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        console.error("Error fetching average mood:", message);
      }
    };

    fetchAverageMood();
  }, [getToken]);

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

        <div className="flex flex-col items-center border border-red-500 rounded-2xl p-6 shadow-lg bg-white min-h-[200px] justify-center">
          {averageMood === null ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-4" />
              <span className="text-gray-500">Cargando...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-28 h-28 rounded-full bg-red-50 mb-3 shadow-inner">
                <span className="text-6xl select-none">
                  {averageMood?.emoji || "😐"}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 text-center capitalize">
                {averageMood?.name || "Sin datos"}
              </p>
              <p className="text-base text-gray-500 text-center">
                Promedio:{" "}
                <span className="font-bold">
                  {averageMood?.average?.toFixed(2) ?? "0.00"}
                </span>
              </p>
            </>
          )}
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
