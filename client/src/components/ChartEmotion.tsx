"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmotionChartData } from "@/hooks/useEmotionChartData";
import EmotionComponent from "./EmotionComponent";

type Props = {
  title?: string;
  description?: string;
};

export default function ChartEmotion({ title, description }: Props) {
  const {
    chartData,
    timeRange,
    setTimeRange,
    chartConfig,
    timezoneStr,
    emotionKeys,
    isLoading,
  } = useEmotionChartData();

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description ||
              "Visualiza tus estados de ánimo a lo largo del tiempo."}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Seleccionar rango" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1d">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        ) : (
          <EmotionComponent
            data={chartData}
            config={chartConfig}
            range={timeRange}
            timezoneStr={timezoneStr}
            emotionKeys={emotionKeys}
          />
        )}
      </CardContent>
    </Card>
  );
}
