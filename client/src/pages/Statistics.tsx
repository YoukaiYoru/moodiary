import { useEffect, useState } from "react";
import api from "@/lib/axios";
import axios from "axios";
import ChartEmotion from "@/components/ChartEmotion";
import { useAuth } from "@clerk/clerk-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

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
    // <<<<<<< HEAD
    //     // Sexta idea
    //     <div className="space-y-6 px-1 sm:px-4 pb-8">
    //       <h1 className="text-3xl font-dosis tracking-wider font-semibold text-gray-900 dark:text-white text-center">
    //         Mira tu evolución emocional
    //       </h1>

    //       {/* Móvil: Emoji y Calendario en fila */}
    //       <div className="flex flex-col gap-4 md:hidden">
    //         <div className="flex flex-col sm:flex-row gap-4">
    //           {/* Emoji */}
    //           <div className="flex-1 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-2 sm:p-4 flex flex-col items-center justify-center h-32 sm:h-auto">
    //             <img
    //               src={imageURL}
    //               alt="Emoji"
    //               className="w-10 h-10 md:w-20 md:h-20 object-cover rounded-full mb-2"
    //             />
    //             <p className="text-sm text-gray-700 dark:text-gray-200 text-center">
    //               Estado más frecuente
    //             </p>
    //           </div>

    //           {/* Calendario */}
    //           <div className="flex-1 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-2 sm:p-4 h-32 sm:h-auto flex justify-center items-center">
    //             <div className="scale-75 h-92 sm:scale-75 origin-top pt-4">
    //               <EmojiCalendar />
    //             </div>
    //           </div>
    //         </div>

    //         {/* Frase */}
    //         <div className="bg-white dark:bg-[#1F1F1F] flex items-center text-center p-6 rounded-2xl shadow-md border">
    //           <h2 className="font-lobster text-md p-0 text-[hsl(204,18%,20%)] dark:text-white">
    // =======
    //     <div className="space-y-6">
    //       <h1 className="text-3xl font-bold text-gray-900 text-center">
    //         Mira tu evolución emocional
    //       </h1>

    //       {/* Header Row with Title + Image */}
    //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
    //         <div className="sm:col-span-2 flex justify-center sm:justify-start items-center border border-red-500 h-full rounded-2xl">
    //           <h2 className="text-2xl font-semibold text-red-600 text-center m-4">
    // >>>>>>> c751bc87e247351fb8ab546f6fe88599c0592837
    //             {phrase}
    //           </h2>
    //         </div>
    //       </div>

    // <<<<<<< HEAD
    //       {/* Escritorio: Emoji + Frase a la izquierda, Calendario a la derecha */}
    //       <div className="hidden md:grid grid-cols-5 gap-4 items-stretch">
    //         {/* Columna izquierda: Emoji y frase */}
    //         <div className="flex flex-col gap-4 col-span-2 lg:col-span-3 h-full">
    //           {/* Emoji */}
    //           <div className="flex flex-row items-center justify-evenly h-1/3 bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-4">
    //             <img
    //               src={imageURL}
    //               alt="Emoji"
    //               className="w-20 h-20 xl:w-24 xl:h-24 object-cover rounded-full mb-2"
    //             />
    //             <p className="text-xl text-gray-700 dark:text-gray-200 text-center">
    //               Estado más frecuente
    //             </p>
    //           </div>

    //           {/* Frase */}
    //           <div className="bg-white dark:bg-[#1F1F1F] flex items-center text-center p-6 rounded-2xl shadow-md h-2/3 border">
    //             <h2 className="font-lobster text-4xl md:text-2xl lg:text-3xl p-4 text-[hsl(204,18%,20%)] dark:text-white font-semibold leading-snug">
    //               {phrase}
    //             </h2>
    //           </div>
    //         </div>

    //         {/* Columna derecha: Calendario */}
    //         <div className="bg-white dark:bg-[#1F1F1F] col-span-3 lg:col-span-2 rounded-2xl shadow-md p-6 h-full">
    //           <div className="scale-150 md:scale-100 lg:scale-110 lg:pt-3">
    //             <EmojiCalendar />
    //           </div>
    //         </div>
    //       </div>

    //       {/* Gráfico debajo vista escritorio */}
    //       <div className=" bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-md p-2 max-h-[500px] overflow-auto">
    //         <ChartEmotion
    //           title="Emociones vs Tiempo"
    //           description="Mira lo hermoso que es tu evolución emocional"
    //           data={chartData}
    //           config={chartConfig}
    //           referenceDate={new Date().toISOString().split("T")[0]}
    //         />
    // =======
    //         <div className="flex flex-col items-center border border-red-500 rounded-2xl p-6 shadow-lg bg-white min-h-[200px] justify-center">
    //           {averageMood === null ? (
    //             <div className="flex flex-col items-center justify-center">
    //               <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-4" />
    //               <span className="text-gray-500">Cargando...</span>
    //             </div>
    //           ) : (
    //             <>
    //               <div className="flex items-center justify-center w-28 h-28 rounded-full bg-red-50 mb-3 shadow-inner">
    //                 <span className="text-6xl select-none">
    //                   {averageMood?.emoji || "😐"}
    //                 </span>
    //               </div>
    //               <p className="text-lg font-semibold text-gray-800 text-center capitalize">
    //                 {averageMood?.name || "Sin datos"}
    //               </p>
    //               <p className="text-base text-gray-500 text-center">
    //                 Promedio:{" "}
    //                 <span className="font-bold">
    //                   {averageMood?.average?.toFixed(2) ?? "0.00"}
    //                 </span>
    //               </p>
    //             </>
    //           )}
    //         </div>
    //       </div>

    //       {/* Chart + Calendar Section */}
    //       <div className="flex flex-col lg:flex-row gap-6">
    //         <div className="flex-1 max-h-[500px] overflow-auto">
    //           <ChartEmotion
    //             title="Emociones vs Tiempo"
    //             description="Mira lo hermoso que es tu evolución emocional"
    //             data={chartData}
    //             config={chartConfig}
    //             timeRange={timeRange}
    //             onRangeChange={(value) =>
    //               setTimeRange(value as "1d" | "7d" | "30d")
    //             }
    //           />
    //         </div>

    //         <div className="w-full lg:w-1/4 flex flex-col border border-red-500 rounded-2xl p-4 shadow-sm">
    //           <div className="flex-1">
    //             <Calendar />
    //           </div>
    //         </div>
    // >>>>>>> c751bc87e247351fb8ab546f6fe88599c0592837
    //       </div>
    //     </div>

    <div className="space-y-6 px-1 sm:px-4 pb-8">
      <h1 className="text-3xl font-dosis tracking-wider font-semibold text-gray-900 dark:text-white text-center">
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
