import React, { useState, useContext, useRef } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import api from "@/lib/axios";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TiLocationArrowOutline } from "react-icons/ti";
import confetti from "canvas-confetti";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { NoteUpdateContext } from "@/contexts/NoteUpdateContext";
import Emoji from "@/components/Emoji";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function HomeLogin() {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [bounceEmoji, setBounceEmoji] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const context = useContext(NoteUpdateContext);
  if (!context)
    throw new Error("HomeLogin must be used within NoteDatesProvider");
  const { addDate } = context;

  const emotions = [
    { key: "Alegría", emoji: "grinning-face-with-smiling-eyes" },
    { key: "Ansiedad", emoji: "anxious-face-with-sweat" },
    { key: "Tristeza", emoji: "crying-face" },
    { key: "Calma", emoji: "relieved-face" },
    { key: "Enojo", emoji: "angry-face" },
  ];

  const handleEmojiClick = (id: string) => {
    setSelectedEmoji(id);
    setBounceEmoji(id);
    soundRef.current ??= new Audio("/sounds/emoji.mp3");
    soundRef.current.currentTime = 0;
    void soundRef.current.play().catch(() => undefined);
    setTimeout(() => setBounceEmoji(null), 2500);
  };

  // Contador de caracteres
  const max_length = 500;
  const total_chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const wordCounter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!selectedEmoji) {
      toast.error("Selecciona una emoción");
      return;
    }
    if (!text.trim()) {
      toast.error("Escribe una nota antes de enviar");
      return;
    }
    setSubmitting(true);

    try {
      const res = await api.post(
        "/moods",
        {
          mood: selectedEmoji,
          date: new Date().toISOString(),
          note: text,
        },
      );

      // Extraer y formatear fecha local correctamente
      const createdAt = res.data.created_at || new Date().toISOString();
      const localDate = dayjs(createdAt).tz().format("YYYY-MM-DD");

      // Disparar actualización en sidebar
      addDate(localDate);

      setText("");
      setSelectedEmoji(null);
      toast.success("Estado de ánimo enviado con éxito ✅");
    } catch (error: unknown) {
      let message = "Error desconocido";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error("Error enviando estado de ánimo", {
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 200,
      angle: 60,
      spread: 180,
      origin: { x: 0, y: 0.6 },
    });
    confetti({
      particleCount: 200,
      angle: 120,
      spread: 180,
      origin: { x: 1, y: 0.6 },
    });
  };

  return (
    <>
      <h1 className="mt-2 text-center text-xl font-medium tracking-tight text-slate-800 sm:text-2xl lg:text-left">
        Bienvenido al Dashboard
      </h1>

      <div className="flex min-h-[calc(100svh-8rem)] items-start justify-center px-1 py-8 sm:px-4 sm:py-12">
        <section className="flex w-full max-w-3xl flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 pb-5 sm:flex-row sm:gap-4 sm:pb-7">
            <h1 className="text-center font-dosis text-[clamp(1.3rem,3.5vw,2.25rem)] font-light leading-tight">
              ¿Cómo te sientes hoy?
            </h1>
            <Emoji emoji="hugging-face" size={34} />
          </div>
          <TooltipProvider>
            <div className="flex w-full items-center justify-center gap-1 overflow-x-auto px-1 py-2 scroll-smooth sm:gap-3 sm:px-0">
              {emotions.map(({ key, emoji }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      className={`emoji-button transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAB7BC] ${selectedEmoji === key ? "scale-125 rounded-full bg-[#EAF7FA] ring-2 ring-[#AAB7BC]" : ""} ${bounceEmoji === key ? "emotion-pop" : ""}`}
                      onClick={() => handleEmojiClick(key)}
                      aria-label={key}
                      aria-pressed={selectedEmoji === key}
                      type="button"
                    >
                      <Emoji emoji={emoji} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{key}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
          <div className="relative mt-5 w-full sm:mt-7 sm:w-[min(60vw,42rem)]">
            <Textarea
              className="min-h-[46px] w-full resize-none overflow-hidden rounded-xl border-none bg-white pr-16 text-base leading-6 shadow-lg placeholder:text-sm sm:text-sm sm:placeholder:text-sm dark:bg-[#1F1F1F] dark:text-white"
              placeholder="Escribe cómo te sientes hoy... Ej: Me siento agradecido y con energía"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              value={text}
              onChange={wordCounter}
              maxLength={max_length}
              onKeyDown={handleKeyDown}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-lg bg-[#455763] p-0 text-sm hover:bg-[#455763]/90"
                    onClick={handleSubmit}
                    disabled={submitting}
                    aria-label={submitting ? "Enviando estado de ánimo" : "Enviar estado de ánimo"}
                    type="button"
                  >
                    <TiLocationArrowOutline />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Enviar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Contadores */}
          <div className="flex justify-end items-center w-full mt-4 text-sm font-dosis px-2">
            <p aria-live="polite">Palabras: {words}&nbsp;</p>
            <p>
              &nbsp;Caracteres: {total_chars}/{max_length}
            </p>
          </div>

          <Button
            variant="outline"
            className="mt-4 cursor-pointer border-[#AAB7BC] text-[#455763] shadow-slate-100 transition-transform hover:scale-105 hover:bg-slate-100 hover:text-[#374852] hover:shadow"
            onClick={handleConfetti}
            type="button"
          >
            ¡Fue un buen día!
          </Button>
        </section>
      </div>
    </>
  );
}
