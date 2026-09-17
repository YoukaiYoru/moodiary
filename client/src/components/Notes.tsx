import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  hour: string;
  emotion: string;
  text: string;
};

export default function Notes({ hour, emotion, text }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("80px");
  const contentRef = useRef<HTMLDivElement>(null);

  const shouldTruncate = text.length > 200;
  const shortText = text.slice(0, 200) + "…";

  // Actualiza altura al cambiar expansión
  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      if (expanded) {
        setHeight(`${scrollHeight}px`);
      } else {
        setHeight("80px");
      }
    }
  }, [expanded, text]);

  return (
    <article className="flex w-full max-w-2xl min-w-0 flex-col gap-1.5 rounded-xl bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md sm:p-3">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 sm:text-sm">
          {hour}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg" aria-label={`Emoción: ${emotion}`}>
          {emotion}
        </div>
      </div>

      <div
        id={`note-content-${hour.replace(/[^a-z0-9]/gi, "-")}`}
        className="min-w-0 overflow-hidden text-xs leading-5 text-slate-700 transition-[max-height] duration-300 ease-out [overflow-wrap:anywhere] sm:text-sm"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="whitespace-pre-wrap">
          {expanded || !shouldTruncate ? text : shortText}
        </div>
      </div>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-xl text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAB7BC] sm:text-sm"
          aria-expanded={expanded}
          aria-controls={`note-content-${hour.replace(/[^a-z0-9]/gi, "-")}`}
        >
          {expanded ? "Mostrar menos" : "Leer nota completa"}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      )}
    </article>
  );
}
