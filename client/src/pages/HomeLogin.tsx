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

  const handleEmojiClick = (emotion: string) => {
    setSelectedEmoji(emotion);
    setBounceEmoji(emotion);
    const audio = new Audio(`/sounds/emoji.mp3`);
    audio.play();
    setTimeout(() => setBounceEmoji(null), 2500);
  };

  // Contador de caracteres
  const max_length = 500;
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
      <h1 className="text-2xl font-light text-center lg:text-left mt-4">
        Bienvenido al Dashboard
      </h1>
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <section className="w-full max-w-3xl flex flex-col justify-center items-center">
          <h1 className="font-dosis font-light text-3xl sm:text-4xl md:text-5xl text-center pt-4 pb-6">
            ¿Cómo te sientes hoy? 🫣
          </h1>
          <TooltipProvider>
            <div className="flex lg:justify-center items-center gap-4 overflow-x-auto flex-nowrap w-full max-w-full px-2 sm:px-0 py-2 scroll-smooth">
              <Tooltip key="Alegria">
                <TooltipTrigger asChild>
                  <button
                    className={`emoji-button text-2xl sm:text-4xl transition duration-200 transform
                  ${selectedEmoji === "Alegria" ? "scale-150" : ""}
                  ${bounceEmoji === "Alegria" ? "animate-bounce" : ""}`}
                    onClick={() => handleEmojiClick("Alegria")}
                    aria-label="Alegria"
                    type="button"
                  >
                    😄
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">Alegría</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key="Ansiedad">
                <TooltipTrigger asChild>
                  <button
                    className={`emoji-button text-2xl sm:text-4xl transition duration-200 transform
                  ${selectedEmoji === "Ansiedad" ? "scale-150" : ""}
                  ${bounceEmoji === "Ansiedad" ? "animate-bounce" : ""}`}
                    onClick={() => handleEmojiClick("Ansiedad")}
                    aria-label="Ansiedad"
                    type="button"
                  >
                    😰
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">Ansiedad</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key="Tristeza">
                <TooltipTrigger asChild>
                  <button
                    className={`emoji-button text-2xl sm:text-4xl transition duration-200 transform
                  ${selectedEmoji === "Tristeza" ? "scale-150" : ""}
                  ${bounceEmoji === "Tristeza" ? "animate-bounce" : ""}`}
                    onClick={() => handleEmojiClick("Tristeza")}
                    aria-label="Tristeza"
                    type="button"
                  >
                    😢
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">Tristeza</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key="Calma">
                <TooltipTrigger asChild>
                  <button
                    className={`emoji-button text-2xl sm:text-4xl transition duration-200 transform
                  ${selectedEmoji === "Calma" ? "scale-150" : ""}
                  ${bounceEmoji === "Calma" ? "animate-bounce" : ""}`}
                    onClick={() => handleEmojiClick("Calma")}
                    aria-label="Calma"
                    type="button"
                  >
                    😌
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">Calma</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip key="Enojo">
                <TooltipTrigger asChild>
                  <button
                    className={`emoji-button text-2xl sm:text-4xl transition duration-200 transform
                  ${selectedEmoji === "Enojo" ? "scale-150" : ""}
                  ${bounceEmoji === "Enojo" ? "animate-bounce" : ""}`}
                    onClick={() => handleEmojiClick("Enojo")}
                    aria-label="Enojo"
                    type="button"
                  >
                    😠
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">Enojo</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <div className="relative w-full sm:w-[60w] mt-6">
            <Textarea
              className="min-h-[50px] w-full pr-14 rounded-2xl border-none text-base sm:text-lg md:text-xl placeholder:text-base md:placeholder:text-xl shadow-lg
                        resize-none overflow-hidden bg-white dark:bg-[#1F1F1F] dark:text-white"
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
                    className="absolute top-[50%] right-2 sm:right-4 md:right-4 xl:right-4 bg-[#455763] hover:bg-[#455763]/90 transform translate-y-[-50%] rounded-xl px-4 py-4 text-sm cursor-pointer"
                    onClick={handleSubmit}
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
            <p>Palabras: {words}&nbsp;</p>
            <p>
              &nbsp;Caracteres: {total_chars}/{remaining}
            </p>
          </div>

          <Button
            variant="outline"
            className="mt-4 shadow-amber-100 cursor-pointer border-blue-400 text-blue-950 hover:text-blue-950 hover:bg-[#8b6f31]/10 hover:shadow hover:scale-105 transition-transform"
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
