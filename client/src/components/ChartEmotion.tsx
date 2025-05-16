// components/ResponsiveAreaChart.tsx
"use client";

import * as React from "react";
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
  referenceDate?: string;
};

const TIME_RANGES = [
  { value: "1d", label: "Last 24 hours", days: 1 },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
] as const;

export default function ChartEmotion({
  title,
  description,
  data,
  config,
  referenceDate = new Date().toISOString().split("T")[0],
}: Props) {
  const [timeRange, setTimeRange] =
    React.useState<(typeof TIME_RANGES)[number]["value"]>("1d");

  const filteredData = React.useMemo(() => {
    const refDate = new Date(referenceDate);
    const range =
      TIME_RANGES.find((r) => r.value === timeRange) ?? TIME_RANGES[2];
    const startDate = new Date(refDate);
    startDate.setDate(refDate.getDate() - range.days);

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      console.log("Parsed item date:", itemDate); // Debugging log
      return itemDate >= startDate && itemDate <= refDate;
    });
  }, [data, timeRange, referenceDate]);

  const formatDate = (value: string) => {
    const date = new Date(value);
    return timeRange === "1d"
      ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Card className="rounded-2xl border border-red-500 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-2 py-5 border-b">
        <div className="text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as typeof timeRange)}
        >
          <SelectTrigger className="w-[160px] rounded-lg">
            <SelectValue placeholder="Select range" />
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
          <AreaChart data={filteredData}>
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
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
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
              minTickGap={timeRange === "1d" ? 16 : 32}
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
                stroke={`var(--color-${key})`}
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
