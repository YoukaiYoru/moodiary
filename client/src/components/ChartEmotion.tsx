"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

dayjs.extend(utc);
dayjs.extend(timezone);

const chartData = [
  // Varias entradas en un mismo día para probar filtro 24h (con horas)
  {
    date: "2025-05-18T08:00:00",
    Alegría: 20,
    Calma: 15,
    Ansiedad: 5,
    Tristeza: 2,
    Enojo: 0,
  },
  {
    date: "2025-05-18T12:00:00",
    Alegría: 30,
    Calma: 10,
    Ansiedad: 7,
    Tristeza: 3,
    Enojo: 1,
  },
  {
    date: "2025-05-18T16:00:00",
    Alegría: 25,
    Calma: 20,
    Ansiedad: 3,
    Tristeza: 4,
    Enojo: 2,
  },
  {
    date: "2025-05-18T20:00:00",
    Alegría: 15,
    Calma: 12,
    Ansiedad: 4,
    Tristeza: 1,
    Enojo: 3,
  },

  // Entradas de días anteriores
  {
    date: "2025-05-17T10:00:00",
    Alegría: 40,
    Calma: 30,
    Ansiedad: 6,
    Tristeza: 5,
    Enojo: 1,
  },
  {
    date: "2025-05-17T15:00:00",
    Alegría: 35,
    Calma: 25,
    Ansiedad: 8,
    Tristeza: 3,
    Enojo: 2,
  },

  {
    date: "2025-05-16T09:00:00",
    Alegría: 28,
    Calma: 22,
    Ansiedad: 9,
    Tristeza: 4,
    Enojo: 1,
  },
];

const chartConfig = {
  Alegría: {
    label: "Alegría",
    color: "var(--chart-1)", // verde
  },
  Calma: {
    label: "Calma",
    color: "var(--chart-2)", // azul
  },
  Ansiedad: {
    label: "Ansiedad",
    color: "var(--chart-3)", // amarillo
  },
  Tristeza: {
    label: "Tristeza",
    color: "var(--chart-4)", // gris
  },
  Enojo: {
    label: "Enojo",
    color: "var(--chart-5)", // rojo
  },
} satisfies ChartConfig;

export default function ChartEmotion() {
  const [timeRange, setTimeRange] = React.useState("1d");

  // Calcular el límite inferior según timeRange
  const startDate = React.useMemo(() => {
    const now = dayjs();
    switch (timeRange) {
      case "1d":
        return now.subtract(24, "hour");
      case "7d":
        return now.subtract(7, "day");
      case "30d":
        return now.subtract(30, "day");
      default:
        return now.subtract(90, "day");
    }
  }, [timeRange]);

  const filteredData = React.useMemo(() => {
    return chartData.filter((item) => {
      // Parsear la fecha del item con dayjs para comparar
      const itemDate = dayjs(item.date);
      return itemDate.isAfter(startDate);
    });
  }, [startDate]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1d" className="rounded-lg">
              Last 24 hours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
