"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataItem = {
  date: string;
  [key: string]: string | number | boolean | null | undefined;
};

type Props = {
  title: string;
  description?: string;
  data: DataItem[];
  config: ChartConfig;
  timeRange: string;
  onRangeChange: (value: string) => string;
};

const TIME_RANGES = [
  { value: "1d", label: "Últimas 24h" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
];
const userLocale = navigator.language;

export default function ChartEmotion({
  title,
  description,
  data,
  config,
  timeRange,
  onRangeChange,
}: Props) {
  // Normaliza datos para asegurar que todas las claves existan con valor numérico (0 si falta)
  const normalizedData = data.map((item) => {
    const newItem = { ...item };
    Object.keys(config).forEach((key) => {
      if (newItem[key] == null) newItem[key] = 0;
    });
    return newItem;
  });

  const formatDate = (value: string) => {
    const date = new Date(value);
    return timeRange === "1d"
      ? date.toLocaleTimeString(userLocale, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : date.toLocaleDateString(userLocale, {
          month: "short",
          day: "numeric",
        });
  };

  return (
    <Card className="rounded-2xl border border-red-500 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-2 py-5 border-b">
        <div className="text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select value={timeRange} onValueChange={onRangeChange}>
          <SelectTrigger className="w-[160px] rounded-lg">
            <SelectValue placeholder="Selecciona el rango" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TIME_RANGES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={config} className="h-[250px] w-full">
          <AreaChart data={normalizedData}>
            <defs>
              {Object.keys(config).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config[key].color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config[key].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={formatDate}
                  indicator="dot"
                />
              }
            />

            {Object.keys(config).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                stroke={config[key].color}
                fill={`url(#fill${key})`}
                stackId="a"
              />
            ))}

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
