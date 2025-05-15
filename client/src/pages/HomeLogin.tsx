import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type React from 'react';
import { useEffect, useState } from 'react';
import { TiLocationArrowOutline } from "react-icons/ti";
import confetti from 'canvas-confetti';



export default function HomeLogin() {
  // Play emoji sound
  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.play();
  }

  // Contador de caracteres
  const max_length = 250;
  const [text, setText] = useState('');
  const total_chars = text.length;
  const words = text.trim() === '' ? 0 : text.split(/\s+/).length;
  const remaining = max_length - total_chars;

  const wordCounter = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
  }

  // Feeling lucky button
  const addLuckyButton = () => {
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

  }


  return (
    <>
      <h1 className="text-2xl font-light">Bienvenido al Dashboard</h1>

      <div className='flex justify-center items-center min-h-[80vh]'>
        <section className="container flex flex-col justify-center items-center">
          <h1 className="font-dosis font-light text-5xl pt-4 pb-4" >¿Cómo te sientes hoy? 🫣</h1>
          <div className='flex justify-center items-center'>
            <p className='emotion-button' onClick={() => playSound('happy')}>😄</p>
            <p className='emotion-button' onClick={() => playSound('happy')}>😍</p>
            <p className='emotion-button' onClick={() => playSound('happy')}>😕</p>
            <p className='emotion-button' onClick={() => playSound('happy')}>🫠</p>
            <p className='emotion-button' onClick={() => playSound('happy')}>😤</p>
            <p className='emotion-button' onClick={() => playSound('happy')}>😡</p>
          </div>
          <div className="relative w-[60vw] mt-6">
            <Textarea
              className="min-h-[50px] w-full pr-16 rounded-2xl border-2 text-lg sm:text-lg md:text-xl  placeholder:text-xl hover:shadow-2xl resize-none overflow-hidden"
              placeholder="Escribe cómo te sientes hoy... Ej: Me siento agradecido y con energía"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
              onChange={wordCounter}
              maxLength={max_length}
            />

            <Button
              className='absolute top-[50%] right-4 transform translate-y-[-50%] rounded-xl px-4 py-4 text-sm'
            // onClick={addEmotion()}
            >
              <TiLocationArrowOutline />
            </Button>
          </div>

          {/* Contadores */}
          <div className='flex justify-end items-center w-[60vw] mt-4'>
            <p className='text-sm font-dosis px-2'>Palabras: {words}</p>
            <p className='text-sm font-dosis px-2'>Caracteres: {total_chars}/{remaining}</p>
          </div>

          <Button
            variant="outline"
            className='mt-2 shadow-amber-100 cursor-pointer hover:shadow hover:scale-110'
            onClick={addLuckyButton}
          >
            Me siento con suerte
          </Button>

        </section>
      </div>
    </>
  );
}
