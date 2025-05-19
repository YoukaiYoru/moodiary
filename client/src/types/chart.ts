export type ChartDataPoint = {
  date: string; // eje x (hora o día)
  [emotion: string]: number | string;
};
