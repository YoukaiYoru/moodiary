import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import ChartEmotion from "@/components/ChartEmotion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Skeleton } from "@/components/ui/skeleton";
import EmojiCalendar from "@/components/EmojiCalendar";
import Emoji from "@/components/Emoji";
import { CalendarDays, Quote, Sparkles, TrendingUp } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Statistics() {
  // Estados para loaders
  const [loadingPhrase, setLoadingPhrase] = useState(true);
  const [loadingAverageMood, setLoadingAverageMood] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

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
    const controller = new AbortController();
    async function loadStats() {
      setLoadingPhrase(true);
      setLoadingAverageMood(true);
      setLoadingCalendar(true);
      try {
        const tz = dayjs.tz.guess();
        const today = dayjs().tz(tz).format("YYYY-MM-DD");
        const now = dayjs().tz(tz);
        const [quoteRes, avgRes, calRes] = await Promise.allSettled([
          api.get("/motivationalQuotes/today", {
            params: { timezone: tz },
            signal: controller.signal,
          }),
          api.get("/moods/average/today", {
            params: { date: today, timezone: tz },
            signal: controller.signal,
          }),
          api.get("/moods/average/by-date", {
            params: { timezone: tz, year: now.year(), month: now.month() + 1 },
            signal: controller.signal,
          }),
        ]);
        if (!isActive) return;

        if (quoteRes.status === "fulfilled") {
          setPhrase(
            quoteRes.value.data.message ??
              "No hay frase motivacional disponible"
          );
        } else {
          console.error("Error loading motivational quote:", quoteRes.reason);
          setPhrase("Registra tus emociones para recibir una frase personalizada.");
        }

        if (avgRes.status === "fulfilled") {
          setAverageMood(avgRes.value.data);
        } else {
          console.error("Error loading average mood:", avgRes.reason);
          setAverageMood(null);
        }

        if (calRes.status === "fulfilled") {
          setCalendar(
            Array.isArray(calRes.value.data)
              ? calRes.value.data.map(
                  (i: { date: string; emoji: string }) => ({
                    date: i.date,
                    emoji: i.emoji,
                  })
                )
              : []
          );
        } else {
          console.error("Error loading emotion calendar:", calRes.reason);
          setCalendar([]);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error loading statistics:", err);
        }
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
      controller.abort();
    };
  }, []);

  // Memoize calendar mapping for EmojiCalendar
  const calendarMap = useMemo(() => {
    const map: Record<string, string> = {};
    calendar?.forEach(({ date, emoji }) => {
      map[date] = emoji;
    });
    return map;
  }, [calendar]);

  const mappedEmoji = averageMood?.emoji ?? "😐";
  const currentMonth = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl space-y-4 pb-8 sm:space-y-5">
      <header className="flex flex-col gap-2 border-b border-[#D8E3E6] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#68777D]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Tu resumen emocional
          </p>
          <h1 className="text-lg font-dosis font-semibold tracking-wide text-gray-900 sm:text-xl dark:text-white">
            Mira tu evolución emocional
          </h1>
        </div>
        <p className="text-xs capitalize text-[#68777D]">{currentMonth}</p>
      </header>

      {/* Frase motivacional + Emoji Promedio */}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-6">
        {/* Frase */}
        <div className="relative flex min-h-[104px] items-center justify-center overflow-hidden rounded-2xl border border-[#D8E3E6] bg-white p-4 shadow-sm md:col-span-3 dark:bg-[#1F1F1F]">
          <Quote className="absolute left-4 top-4 size-5 text-[#D8E3E6]" aria-hidden="true" />
          {loadingPhrase ? (
            <div className="mx-auto w-full max-w-xl space-y-2 px-4">
              <Skeleton className="mx-auto h-5 w-3/4 rounded bg-[#F1F8FA]" />
              <Skeleton className="mx-auto h-5 w-1/2 rounded bg-[#F1F8FA]" />
            </div>
          ) : (
            <h2 className="max-w-xl px-5 text-center font-lobster text-sm leading-snug text-[hsl(204,18%,20%)] sm:text-base md:text-lg dark:text-white">
              {phrase}
            </h2>
          )}
        </div>

        {/* Emoji promedio */}
        <div className="flex min-h-[168px] flex-col items-center justify-center rounded-2xl border border-[#D8E3E6] bg-white p-4 shadow-sm md:col-span-2 dark:bg-[#1F1F1F]">
          <p className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#68777D]">
            <TrendingUp className="size-3.5" aria-hidden="true" />
            Promedio de hoy
          </p>
          {averageMood === null && loadingAverageMood ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full bg-[#F1F8FA] shadow-inner sm:h-20 sm:w-20" />
              <Skeleton className="h-5 w-20 rounded bg-[#F1F8FA]" />
              <Skeleton className="h-3 w-16 rounded bg-[#F1F8FA]" />
            </div>
          ) : (
            <>
              <div className="mb-2 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[#EAF7FA] shadow-inner sm:h-20 sm:w-20 dark:bg-[#2c2c2c]">
                <div className="select-none text-3xl sm:text-4xl">
                  <Emoji emoji={mappedEmoji} />
                </div>
              </div>
              <p className="text-center text-sm font-semibold capitalize text-gray-800 sm:text-base dark:text-gray-200">
                {averageMood?.name || "Sin datos"}
              </p>
              <p className="text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                Promedio:{" "}
                <span className="font-bold">
                  {averageMood?.average?.toFixed(2) ?? "0.00"}
                </span>
              </p>
            </>
          )}
        </div>

        <div className="flex min-h-[104px] flex-col items-center justify-center rounded-2xl border border-[#D8E3E6] bg-[#F1F8FA] p-3 text-center shadow-sm md:col-span-1 dark:bg-[#1F1F1F]">
          <CalendarDays className="mb-2 size-5 text-[#455763]" aria-hidden="true" />
          <p className="text-xl font-semibold text-[#455763]">
            {loadingCalendar ? "—" : calendar?.length ?? 0}
          </p>
          <p className="text-[0.7rem] font-medium uppercase tracking-wide text-[#68777D]">
            Días registrados
          </p>
        </div>
      </div>

      {/* Gráfico + Calendario */}
      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-4">
        {/* Gráfico */}
        <div className="min-w-0 w-full xl:col-span-3">
          <ChartEmotion
            title="Emociones vs Tiempo"
            description="Mira lo hermoso que es tu evolución emocional"
          />
        </div>

        {/* Calendario */}
        <div className="flex w-full justify-center rounded-2xl border border-[#D8E3E6] bg-white p-3 shadow-sm xl:col-span-1 xl:mx-0 dark:bg-[#1F1F1F]">
          <div className="w-full max-w-xs">
            {loadingCalendar ? (
              <Skeleton className="h-[280px] w-full rounded-xl bg-[#F1F8FA] sm:h-[300px]" />
            ) : (
              <EmojiCalendar dataDate={calendarMap} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
