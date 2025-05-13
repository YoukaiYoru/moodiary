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

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

interface AreaChartProps {
  data: DataPoint[];
  title?: string;
  description?: string;
  height?: number;
  dataKeys: string[];
  colors?: string[];
  timeRangeOptions?: TimeRangeOption[];
  defaultTimeRange?: string;
}

export default function ChartEmotion({
  data,
  title = "Area Chart",
  description = "Interactive area chart",
  height = 250,
  dataKeys = ["value"],
  colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
  ],
  timeRangeOptions = [
    { value: "90d", label: "Last 3 months", days: 90 },
    { value: "30d", label: "Last 30 days", days: 30 },
    { value: "7d", label: "Last 7 days", days: 7 },
  ],
  defaultTimeRange = "90d",
}: AreaChartProps) {
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange);

  // Create chart config dynamically based on dataKeys
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {};

    dataKeys.forEach((key, index) => {
      config[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: colors[index % colors.length],
      };
    });

    return config;
  }, [dataKeys, colors]);

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    const selectedOption = timeRangeOptions.find(
      (option) => option.value === timeRange
    );
    if (!selectedOption) return data;

    const daysToSubtract = selectedOption.days;
    const referenceDate = new Date(data[data.length - 1]?.date || new Date());
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [data, timeRange, timeRangeOptions]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue
              placeholder={
                timeRangeOptions.find(
                  (option) => option.value === defaultTimeRange
                )?.label
              }
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timeRangeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-lg"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
          style={{ height }}
        >
          <AreaChart data={filteredData}>
            <defs>
              {dataKeys.map((key) => (
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
            {dataKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                stroke={`var(--color-${key})`}
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
