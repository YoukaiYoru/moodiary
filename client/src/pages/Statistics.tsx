import ChartEmotion from "@/components/ChartEmotion";
const chartData = [
  { date: "2024-04-01", ventas: 222, visitas: 150 },
  { date: "2024-04-15", ventas: 120, visitas: 170 },
  { date: "2024-05-01", ventas: 165, visitas: 220 },
  { date: "2024-05-15", ventas: 473, visitas: 380 },
  { date: "2024-06-01", ventas: 178, visitas: 200 },
  { date: "2024-06-15", ventas: 307, visitas: 350 },
  { date: "2024-06-30", ventas: 446, visitas: 400 },
];

export default function Statistics() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Ejemplo de Gráfico de Área Reutilizable
      </h1>

      <ChartEmotion
        data={chartData}
        title="Análisis de Rendimiento"
        description="Ventas y visitas durante los últimos 3 meses"
        dataKeys={["ventas", "visitas"]}
        colors={["hsl(var(--primary))", "hsl(var(--secondary))"]}
        height={300}
      />
    </div>
  );
}
