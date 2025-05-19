import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ChartDataItem {
  date: string;
  [key: string]: unknown; // Add more specific fields if known, e.g., Alegría, Tristeza, etc.
}

export function transformChartData(
  rawData: ChartDataItem[],
  range: "1d" | "7d" | "30d",
  timeZone: string
) {
  if (!Array.isArray(rawData)) return [];

  if (range === "1d") {
    return rawData; // ya viene agrupado por hora
  }

  // Para 7d y 30d: asegurar que todos los días estén presentes aunque no haya datos
  const today = dayjs().tz(timeZone);
  const days = range === "7d" ? 7 : 30;
  const dateMap = new Map(rawData.map((item) => [item.date, item]));

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = today.subtract(i, "day").format("YYYY-MM-DD");
    result.push({
      date: d,
      ...dateMap.get(d), // puede tener Alegría, Tristeza, etc., o undefined
    });
  }

  return result;
}
