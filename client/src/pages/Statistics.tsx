import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import ChartEmotion from "@/components/ChartEmotion";
import { useAuth } from "@clerk/clerk-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Skeleton } from "@/components/ui/skeleton";
import EmojiCalendar from "@/components/EmojiCalendar";
import Emoji from "react-emojis";

dayjs.extend(utc);
dayjs.extend(timezone);

// Map unicode emoji char to react-emoji name
const charToEmojiName: { char: string; name: string }[] = [
  { char: "😄", name: "grinning-face-with-smiling-eyes" },
  { char: "😌", name: "relieved-face" },
  { char: "😢", name: "crying-face" },
  { char: "😰", name: "anxious-face-with-sweat" },
  { char: "😠", name: "angry-face" },
];

export default function Statistics() {
  // Estados para loaders
  const [loadingPhrase, setLoadingPhrase] = useState(true);
  const [loadingAverageMood, setLoadingAverageMood] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

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

  // Fetch motivational quote, average mood, and calendar data together
  useEffect(() => {
    let isActive = true;
    async function loadStats() {
      setLoadingPhrase(true);
      setLoadingAverageMood(true);
      setLoadingCalendar(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication failed");
        const tz = dayjs.tz.guess();
        const today = dayjs().tz(tz).format("YYYY-MM-DD");
        const now = dayjs().tz(tz);
        const [quoteRes, avgRes, calRes] = await Promise.all([
          api.get("/motivationalQuotes/today", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/moods/average/today", {
            headers: { Authorization: `Bearer ${token}` },
            params: { date: today, timezone: tz },
          }),
          api.get("/moods/average/by-date", {
            headers: { Authorization: `Bearer ${token}` },
            params: { timezone: tz, year: now.year(), month: now.month() + 1 },
          }),
        ]);
        if (!isActive) return;
        setPhrase(
          quoteRes.data.message ?? "No hay frase motivacional disponible"
        );
        setAverageMood(avgRes.data);
        setCalendar(
          Array.isArray(calRes.data)
            ? calRes.data.map((i: { date: string; emoji: string }) => ({
                date: i.date,
                emoji: i.emoji,
              }))
            : []
        );
      } catch (err) {
        console.error("Error loading statistics:", err);
      } finally {
        if (isActive) {
          setLoadingPhrase(false);
          setLoadingAverageMood(false);
          setLoadingCalendar(false);
        }
      }
    }
    loadStats();
    return () => {
      isActive = false;
    };
  }, [getToken]);

  // Memoize calendar mapping for EmojiCalendar
  const calendarMap = useMemo(() => {
    const map: Record<string, string> = {};
    calendar?.forEach(({ date, emoji }) => {
      map[date] = emoji;
    });
    return map;
  }, [calendar]);

  // Map averageMood.emoji (unicode) to react-emoji name
  const mappedEmojiName = averageMood?.emoji
    ? (charToEmojiName.find((m) => m.char === averageMood.emoji)?.name ??
      "neutral-face")
    : "neutral-face";

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
                <div className="text-5xl sm:text-6xl select-none">
                  <Emoji emoji={mappedEmojiName} />
                </div>
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
          <ChartEmotion
            title="Emociones vs Tiempo"
            description="Mira lo hermoso que es tu evolución emocional"
          />
        </div>

        {/* Calendario */}
        <div className="xl:col-span-1 w-full flex justify-center mx-auto xl:mx-0 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-sm p-5">
          <div className="max-w-xs w-full">
            {loadingCalendar ? (
              <Skeleton className="h-[300px] sm:h-[320px] w-full rounded-xl" />
            ) : (
              <EmojiCalendar dataDate={calendarMap} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
