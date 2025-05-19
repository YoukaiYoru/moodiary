import { useEffect, useState } from "react";
import api from "@/lib/axios";
import axios from "axios";
import ChartEmotion from "@/components/ChartEmotion";
import { Calendar } from "@ui/calendar";
import { useAuth } from "@clerk/clerk-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Skeleton } from "@/components/ui/skeleton";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Statistics() {
  // Estados para loaders
  const [loadingPhrase, setLoadingPhrase] = useState(true);
  const [loadingAverageMood, setLoadingAverageMood] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  const { getToken } = useAuth();
  const [phrase, setPhrase] = useState("No hay frase motivacional disponible");
  const [averageMood, setAverageMood] = useState<{
    average: number;
    emoji: string;
    name?: string;
  } | null>(null);

  //simulación de carga
  useEffect(() => {
    const phraseTimer = setTimeout(() => setLoadingPhrase(false), 1500);
    const averageMoodTimer = setTimeout(
      () => setLoadingAverageMood(false),
      1500
    );
    const chartTimer = setTimeout(() => setLoadingChart(false), 1500);

    return () => {
      clearTimeout(phraseTimer);
      clearTimeout(averageMoodTimer);
      clearTimeout(chartTimer);
    };
  }, []);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">
        Mira tu evolución emocional
      </h1>

      {/* Header con frase motivacional y promedio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="sm:col-span-2 flex justify-center sm:justify-start items-center border border-red-500 h-full rounded-2xl">
          {loadingPhrase ? (
            <div className="space-y-2 p-4 max-w-xl w-full mx-auto">
              <Skeleton className="h-6 w-3/4 mx-auto rounded" />
              <Skeleton className="h-6 w-1/2 mx-auto rounded" />
            </div>
          ) : (
            <h2 className="text-2xl font-semibold text-red-600 text-center m-4">
              {phrase}
            </h2>
          )}
        </div>

        <div className="flex flex-col items-center border border-red-500 rounded-2xl p-6 shadow-lg bg-white min-h-[200px] justify-center">
          {averageMood === null && loadingAverageMood ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Skeleton className="rounded-full w-28 h-28 shadow-inner" />
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
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
        <div className="w-full lg:w-3/4 flex flex-col border border-red-500 rounded-2xl p-4 shadow-sm">
          {loadingChart ? (
            <Skeleton className="h-[320px] w-full rounded-xl" />
          ) : (
            <ChartEmotion
              title="Emociones vs Tiempo"
              description="Mira lo hermoso que es tu evolución emocional"
            />
          )}
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
