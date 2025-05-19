import { useEffect, useState } from "react";
import api from "@/lib/axios";
import axios from "axios";
import ChartEmotion from "@/components/ChartEmotion";
import EmojiCalendar from "../components/EmojiCalendar";
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
  const [calendar, setCalendar] = useState<
    | {
        date: string;
        emoji: string;
      }[]
    | null
  >(null);
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

  // Obtener la frase motivacional

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

  // Obtener el estado promedio
  useEffect(() => {
    const fetchAverageMood = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const localDateStr = dayjs().tz().format("YYYY-MM-DD");

        const response = await api.get(`/moods/average/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: localDateStr,
            timezone: dayjs.tz.guess(), // Detecta la zona horaria
          },
        });

        setAverageMood(response.data || []);
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

  //Obtener emoji por fecha
  //GET /moods/average/by-date?timezone=America/Lima
  useEffect(() => {
    const fetchEmojiByDate = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const timezone = dayjs.tz.guess(); // Detecta la zona horaria
        const now = dayjs().tz(timezone); // Fecha local

        const response = await api.get(`/moods/average/by-date`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timezone,
            year: now.year(),
            month: now.month() + 1, // month es 0-indexado → +1
          },
        });

        const rawData = response.data;

        if (!Array.isArray(rawData)) {
          throw new Error("Respuesta inválida: se esperaba un arreglo");
        }

        // Usamos forEach en vez de map
        interface EmojiData {
          date: string;
          emoji: string;
        }

        const formattedData: EmojiData[] = [];
        rawData.forEach((item) => {
          formattedData.push({
            date: item.date,
            emoji: item.emoji,
          });
        });

        setCalendar(formattedData || []);
      } catch (error) {
        let message = "Error desconocido";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.error || error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        console.error("Error fetching emoji by date:", message);
      }
    };

    fetchEmojiByDate();
  }, [getToken]);

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl sm:text-3xl font-dosis tracking-wide font-semibold text-gray-900 dark:text-white text-center">
        Mira tu evolución emocional
      </h1>

      {/* Frase motivacional + Emoji Promedio */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-5">
        {/* Frase */}
        <div className="md:col-span-3 flex items-center justify-center bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-4 min-h-[120px]">
          {loadingPhrase ? (
            <div className="space-y-2 p-4 max-w-xl w-full mx-auto">
              <Skeleton className="h-6 w-3/4 mx-auto rounded" />
              <Skeleton className="h-6 w-1/2 mx-auto rounded" />
            </div>
          ) : (
            <h2 className="text-lg sm:text-xl md:text-2xl font-lobster text-[hsl(204,18%,20%)] dark:text-white text-center leading-snug">
              {phrase}
            </h2>
          )}
        </div>

        {/* Emoji promedio */}
        <div className="md:col-span-2 flex flex-col items-center justify-center rounded-2xl p-6 shadow-md bg-white dark:bg-[#1F1F1F] min-h-[200px]">
          {averageMood === null && loadingAverageMood ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Skeleton className="rounded-full w-24 h-24 sm:w-28 sm:h-28 shadow-inner" />
              <Skeleton className="h-6 w-20 sm:w-24 rounded" />
              <Skeleton className="h-4 w-16 sm:w-20 rounded" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-50 dark:bg-[#2c2c2c] mb-3 shadow-inner">
                <span className="text-5xl sm:text-6xl select-none">
                  {averageMood?.emoji || "😐"}
                </span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 text-center capitalize">
                {averageMood?.name || "Sin datos"}
              </p>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">
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
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Gráfico */}
        <div className="xl:col-span-3 w-full  mx-auto xl:mx-0 bg-white dark:bg-[#1F1F1F] rounded-2xl p-4 shadow-sm">
          {loadingChart ? (
            <Skeleton className="h-[300px] sm:h-[320px] w-full rounded-xl" />
          ) : (
            <ChartEmotion
              title="Emociones vs Tiempo"
              description="Mira lo hermoso que es tu evolución emocional"
            />
          )}
        </div>

        {/* Calendario */}
        <div className="xl:col-span-1 w-full flex justify-center mx-auto xl:mx-0 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-sm p-5">
          <div className="max-w-xs w-full">
            <EmojiCalendar
              dataDate={(() => {
                const obj: Record<string, string> = {};
                if (calendar) {
                  calendar.forEach(({ date, emoji }) => {
                    obj[date] = emoji;
                  });
                }
                return obj;
              })()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
