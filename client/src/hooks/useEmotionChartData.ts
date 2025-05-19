import { useAuth } from "@clerk/clerk-react";
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

export function useEmotionChartData() {
  const { getToken } = useAuth();
  const [timeRange, setTimeRange] = useState("1d");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const timezoneStr = useMemo(() => dayjs.tz.guess(), []);
  const emotionKeys = Object.keys(chartConfig) as Array<
    keyof typeof chartConfig
  >;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const referenceDate = dayjs().tz(timezoneStr).format("YYYY-MM-DD");
      const response = await api.get("/moods/chart", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          range: timeRange,
          date: referenceDate,
          timezone: timezoneStr,
        },
      });

      const rawData = response.data;
      const groupedData: Record<string, ChartDataPoint> = {};

      rawData.forEach((entry: ChartDataPoint) => {
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
              Number(groupedData[dateKey][emo] ?? 0) + Number(entry[emo] ?? 0);
          }
        });
      });

      const processed = Object.values(groupedData).sort((a, b) =>
        dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
      );
      setChartData(processed);
      setIsLoading(false);
    }

    fetchData();
  }, [timeRange, timezoneStr, getToken]);

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
