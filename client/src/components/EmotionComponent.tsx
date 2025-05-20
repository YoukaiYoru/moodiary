import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dayjs from "dayjs";
import type { ChartDataPoint } from "@/types/chart";

type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

type Props = {
  data: ChartDataPoint[];
  config: ChartConfig;
  range: string;
  timezoneStr: string;
  emotionKeys: string[];
};

export default function EmotionComponent({
  data,
  config,
  range,
  timezoneStr,
  emotionKeys,
}: Props) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <AreaChart
        data={data}
        {...(range === "1d" && {
          xAxis: {
            ticks: Array.from({ length: 24 }, (_, i) =>
              dayjs()
                .tz(timezoneStr)
                .startOf("day")
                .add(i, "hour")
                .format("YYYY-MM-DD HH:mm")
            ),
          },
        })}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={20}
          ticks={
            range === "1d"
              ? Array.from({ length: 24 }, (_, i) =>
                  dayjs()
                    .tz(timezoneStr)
                    .startOf("day")
                    .add(i, "hour")
                    .format("YYYY-MM-DD HH:mm")
                )
              : undefined
          }
          tickFormatter={(value) => {
            const d = dayjs(value).tz(timezoneStr);
            return range === "1d" ? d.format("HH:mm") : d.format("MMM DD");
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                const d = dayjs(value).tz(timezoneStr);
                return range === "1d" ? d.format("HH:mm") : d.format("MMM DD");
              }}
              indicator="dot"
            />
          }
        />
        {emotionKeys.map((key) => (
          <Area
            key={key}
            type="natural"
            dataKey={key}
            stackId="a"
            stroke={config[key].color}
            fill={config[key].color}
            fillOpacity={0.3}
            isAnimationActive={false}
            connectNulls
            dot={range === "1d"}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
