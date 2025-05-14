import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  hour: string;
  emotion: string;
  text: string;
};

export default function Notes({ hour, emotion, text }: Props) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > 200;
  const displayedText =
    expanded || !shouldTruncate ? text : text.slice(0, 200) + "…";

  return (
    <div className="flex items-start justify-between p-4 bg-white shadow-md rounded-lg w-full max-w-md">
      {/* Parte izquierda: hora y texto */}
      <div className="flex flex-col flex-1">
        <span className="text-sm text-gray-500">{hour}</span>
        <p className="mt-2 text-gray-800 whitespace-pre-wrap">
          {displayedText}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 self-end mr-4 flex items-center text-gray-400 hover:text-gray-800 transition-transform"
            aria-label="Expandir nota"
          >
            <ChevronDown
              className={`h-4 w-4 transform transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Parte derecha: emoción como cuadrado */}
      <div className="ml-4 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-md text-2xl shrink-0">
        {emotion}
      </div>
    </div>
  );
}
