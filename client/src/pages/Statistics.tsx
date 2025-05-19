import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { transformChartData } from "@/lib/transformChartData";
import axios from "axios";
import ChartEmotion from "@/components/ChartEmotion";
import { Calendar } from "@ui/calendar";
import { useAuth } from "@clerk/clerk-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type DataItem = {
  date: string;
  Alegría?: number;
  Calma?: number;
  Ansiedad?: number;
  Tristeza?: number;
  Enojo?: number;
};
type ChartData = DataItem[];

export default function Statistics() {
  const { getToken } = useAuth();
  const [phrase, setPhrase] = useState("No hay frase motivacional disponible");
  const [averageMood, setAverageMood] = useState<{
    average: number;
    emoji: string;
    name?: string;
  } | null>(null);
  const [data, setData] = useState<ChartData>([]);
  const [range, setRange] = useState<"1d" | "7d" | "30d">("1d");

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
  }, [getToken, range]);

  useEffect(() => {
    const fetchAverageMood = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const localDateStr = dayjs().tz().format("YYYY-MM-DD");

        const response = await api.get(
          `/moods/average/today?date=${localDateStr}`,
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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const response = await api.get("/moods/chart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            range: range,
            date: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        });

        const transformed = transformChartData(
          response.data,
          range,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        setData(transformed);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [getToken, range]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">
        Mira tu evolución emocional
      </h1>

      {/* Header con frase motivacional y promedio */}
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

      {/* Gráfico + Calendario */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-h-[500px] overflow-auto">
          <ChartEmotion
          // title="Emociones vs Tiempo"
          // description="Mira lo hermoso que es tu evolución emocional"
          // data={data}
          // range={range}
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
