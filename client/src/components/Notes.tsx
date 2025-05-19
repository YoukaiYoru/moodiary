import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  hour: string;
  emotion: string;
  text: string;
};

export default function Notes({ hour, emotion, text }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  const shouldTruncate = text.length > 200;
  const shortText = text.slice(0, 200) + "…";

  // Actualiza altura al cambiar expansión
  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      // Asegurarse de que la altura se actualice correctamente tanto al expandir como al comprimir
      if (expanded) {
        setHeight(`${scrollHeight}px`);
      } else {
        setTimeout(() => setHeight("80px"), 10); // Agregar un pequeño retraso para suavizar la compresión
      }
    }
  }, [expanded, text]);

  return (
    <div className="flex items-start justify-between p-4 bg-white shadow-md rounded-lg w-[110%] max-w-2xl mb-4 transition-all duration-500">
      {/* Parte izquierda */}
      <div className="flex flex-col flex-1">
        <span className="text-sm text-gray-500">{hour}</span>

        {/* Contenedor animado */}
        <div
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out mt-2 text-gray-800 whitespace-pre-wrap`}
          style={{ maxHeight: height }}
        >
          <div ref={contentRef}>
            {expanded || !shouldTruncate ? text : shortText}
          </div>
        </div>

        {shouldTruncate && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 self-end mr-4 flex items-center text-gray-400 hover:text-gray-800 transition-transform"
            aria-label="Expandir nota"
          >
            <ChevronDown
              className={`h-4 w-4 transform transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        )}
      </div>

      {/* Parte derecha: emoción */}
      <div className="ml-4 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-md text-2xl shrink-0">
        {emotion}
      </div>
    </div>
  );
}
