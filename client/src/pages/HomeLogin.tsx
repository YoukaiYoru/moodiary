import axios from "axios";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";
import { useState } from "react";
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

export default function HomeLogin() {
  const { getToken } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [bounceEmoji, setBounceEmoji] = useState<string | null>(null);
  const [confettiCount, setConfettiCount] = useState(0);
  const emojis = [
    { emoji: "😄", value: "Alegría" },
    { emoji: "😰", value: "Ansiedad" },
    { emoji: "😞", value: "Tristeza" },
    { emoji: "😌", value: "Calma" },
    { emoji: "😤", value: "Enojo" },
  ];

  // Seleccionar emoji
  const handleEmojiClick = (emotion: string) => {
    setSelectedEmoji(emotion);
    setBounceEmoji(emotion);
    const audio = new Audio(`/sounds/emoji.mp3`);
    audio.play();
    setTimeout(() => setBounceEmoji(null), 2500);
  };

  // Contador de caracteres
  const max_length = 250;
  const total_chars = text.length;
  const words = text.trim() === "" ? 0 : text.split(/\s+/).length;
  const remaining = max_length - total_chars;
  const wordCounter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
  };

  // Enviar datos
  const handleSubmit = async () => {
    if (!text.trim() || !selectedEmoji) {
      return;
    }

    try {
      // Obtener token JWT de Clerk
      const token = await getToken();

      // Construir body para el POST
      const body = {
        mood: selectedEmoji,
        date: new Date().toISOString(),
        note: text,
      };

      // Petición POST con Axios incluyendo token en headers
      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación.");
      }
      await api.post("/moods", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Resetear formulario y estados
      setText("");
      setSelectedEmoji(null);
      toast.success("Estado de ánimo enviado con éxito ✅");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error("Error enviando estado de ánimo", {
          description: error.response?.data?.error || error.message,
        });
      } else if (error instanceof Error) {
        toast.error("Error enviando estado de ánimo", {
          description: error.message,
        });
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Confetti
  const handleConfetti = () => {
    // Add some confetti
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
    setConfettiCount((prev) => prev + 1);
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
            >
              <TiLocationArrowOutline />
            </Button>
          </div>
          {/* Contadores */}
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
          >
            ¡Boom emocional!
          </Button>
        </section>
      </div>
    </>
  );
}
