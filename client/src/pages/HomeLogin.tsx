import React, { useState } from "react";
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
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { NoteUpdateContext } from "@/contexts/NoteUpdateContext";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function HomeLogin() {
  const { getToken } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [bounceEmoji, setBounceEmoji] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const context = React.use(NoteUpdateContext);
  if (!context)
    throw new Error("HomeLogin must be used within NoteDatesProvider");
  const { addDate } = context;

  const emojis = [
    { emoji: "😄", value: "Alegría" },
    { emoji: "😰", value: "Ansiedad" },
    { emoji: "😞", value: "Tristeza" },
    { emoji: "😌", value: "Calma" },
    { emoji: "😤", value: "Enojo" },
  ];

  const handleEmojiClick = (emotion: string) => {
    setSelectedEmoji(emotion);
    setBounceEmoji(emotion);
    const audio = new Audio(`/sounds/emoji.mp3`);
    audio.play();
    setTimeout(() => setBounceEmoji(null), 2500);
  };

  const max_length = 250;
  const total_chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const remaining = max_length - total_chars;

  const wordCounter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text.trim() || !selectedEmoji || submitting) return;
    setSubmitting(true);

    try {
      const token = await getToken();
      if (!token)
        throw new Error("No se pudo obtener el token de autenticación.");

      const res = await api.post(
        "/moods",
        {
          mood: selectedEmoji,
          date: new Date().toISOString(),
          note: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      <h1 className="text-2xl font-light">Bienvenido al Dashboard</h1>
      <div className="flex justify-center items-center min-h-[80vh]">
        <section className="container flex flex-col justify-center items-center">
          <h1 className="font-dosis font-light text-5xl pt-4 pb-4">
            ¿Cómo te sientes hoy? 🫣
          </h1>

          <TooltipProvider>
            <div className="flex justify-center items-center">
              {emojis.map(({ emoji, value }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <button
                      className={`emoji-button transition duration-200 transform
                        ${selectedEmoji === value ? "scale-150" : ""}
                        ${bounceEmoji === value ? "animate-bounce" : ""}`}
                      onClick={() => handleEmojiClick(value)}
                      aria-label={value}
                      type="button"
                    >
                      {emoji}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{value}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <div className="relative w-[60vw] mt-6">
            <Textarea
              className="min-h-[50px] w-full pr-16 rounded-2xl border-none text-lg sm:text-lg md:text-xl placeholder:text-xl shadow-lg
                resize-none overflow-hidden backdrop-blur-2xl"
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
            <Button
              className="absolute top-[50%] right-4 transform translate-y-[-50%] rounded-xl px-4 py-4 text-sm cursor-pointer"
              title="Enviar"
              onClick={handleSubmit}
              disabled={!text.trim() || !selectedEmoji || submitting}
              type="button"
            >
              <TiLocationArrowOutline />
            </Button>
          </div>

          <div className="flex justify-end items-center w-[60vw] mt-4">
            <p className="text-sm font-dosis px-2">Palabras: {words}</p>
            <p className="text-sm font-dosis px-2">
              Caracteres: {total_chars}/{remaining}
            </p>
          </div>

          <Button
            variant="outline"
            className="mt-2 shadow-amber-100 cursor-pointer hover:shadow hover:scale-110"
            onClick={handleConfetti}
            type="button"
          >
            ¡Boom emocional!
          </Button>
        </section>
      </div>
    </>
  );
}
