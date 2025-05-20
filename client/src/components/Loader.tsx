import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Loader({ isLoaded }: { isLoaded: boolean }) {
  const [progress, setProgress] = useState(50);

  useEffect(() => {
    // Aumentar el progreso de 0 a 100
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval); // Detener cuando llegue al 100%
            return 100;
          }
          return prev + 10; // Aumentar de 2 en 2 para simular carga
        });
      }, 150); // Incremento más rápido para llegar al 100%

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }
    return undefined;
  }, [progress]);

  // Mostrar el loader hasta que el progreso esté al 100% y Clerk esté completamente cargado
  if (!isLoaded || progress < 100) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4 w-64">
          <Progress value={progress}
            className="w-full h-4 bg-gray-200 dark:bg-gray-700overflow-hidden relative rounded-md
              [&>div]:bg-[#292933] [&>div]:transition-colors 
              dark:[&>div]:bg-white"
          />
        </div>
      </div>
    );
  }

  return null; // Una vez que todo está cargado, no muestra nada más
}
