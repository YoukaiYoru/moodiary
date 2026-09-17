import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import type { ChartDataPoint } from "@/types/chart";

dayjs.extend(utc);
dayjs.extend(timezone);

const chartConfig = {
  Alegría: { label: "Alegría", color: "var(--chart-1)" },
  Calma: { label: "Calma", color: "var(--chart-2)" },
  Ansiedad: { label: "Ansiedad", color: "var(--chart-3)" },
  Tristeza: { label: "Tristeza", color: "var(--chart-4)" },
  Enojo: { label: "Enojo", color: "var(--chart-5)" },
};
const emotionKeys = Object.keys(chartConfig) as Array<keyof typeof chartConfig>;

export function useEmotionChartData() {
  const [timeRange, setTimeRange] = useState("1d");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const timezoneStr = useMemo(() => dayjs.tz.guess(), []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      try {
        if (!isActive) return;

        const referenceDate = dayjs().tz(timezoneStr).format("YYYY-MM-DD");
        const response = await api.get("/moods/chart", {
          params: {
            range: timeRange,
            date: referenceDate,
            timezone: timezoneStr,
          },
          signal: controller.signal,
        });

        const groupedData: Record<string, ChartDataPoint> = {};
        (Array.isArray(response.data) ? response.data : []).forEach(
          (entry: ChartDataPoint) => {
            const dateKey = dayjs(entry.date)
              .tz(timezoneStr)
              .format(timeRange === "1d" ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD");

            if (!groupedData[dateKey]) {
              groupedData[dateKey] = { date: dateKey };
              emotionKeys.forEach((emo) => (groupedData[dateKey][emo] = 0));
            }

            emotionKeys.forEach((emo) => {
              if (entry[emo] !== undefined) {
                groupedData[dateKey][emo] =
                  Number(groupedData[dateKey][emo] ?? 0) +
                  Number(entry[emo] ?? 0);
              }
            });
          },
        );

        if (isActive) {
          const processed = Object.values(groupedData).sort((a, b) =>
            dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1,
          );
          setChartData(processed);
        }
      } catch (error) {
        if (isActive) {
          if (!controller.signal.aborted) {
            console.error("Error loading chart data:", error);
          }
          setChartData([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [timeRange, timezoneStr]);

  return {
    chartData,
    timeRange,
    setTimeRange,
    chartConfig,
    timezoneStr,
    emotionKeys,
    isLoading,
  };
}
