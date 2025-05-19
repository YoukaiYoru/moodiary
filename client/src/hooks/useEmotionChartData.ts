import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "@/lib/axios";

type DataItem = {
  date: string;
  [mood: string]: number | string;
};

// Función para aplicar offset local en minutos a la fecha ISO recibida
function applyLocalOffset(dateStr: string) {
  const date = new Date(dateStr);
  // getTimezoneOffset() da la diferencia en minutos UTC - local (negativo si local está adelante de UTC)
  // Para compensar sumamos el negativo del offset:
  const offsetMinutes = -date.getTimezoneOffset();
  return new Date(date.getTime() + offsetMinutes * 60000);
}

export function useEmotionChartData(
  initialRange: "1d" | "7d" | "30d" = "1d",
  initialDate?: string
) {
  const { getToken } = useAuth();
  const [timeRange, setTimeRange] = useState(initialRange);
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  const timezone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  const date = initialDate || new Date().toISOString();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("No token disponible");

        const params = {
          range: timeRange,
          date,
          timezone,
        };

        const res = await api.get<DataItem[]>("/moods/chart", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Aplicar offset local a cada fecha antes de setear
        const adjustedData = res.data.map((item) => ({
          ...item,
          date: applyLocalOffset(item.date).toISOString(),
        }));

        setData(adjustedData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange, date, timezone, getToken]);

  return { data, loading, error, timeRange, setTimeRange, locale, timezone };
}
