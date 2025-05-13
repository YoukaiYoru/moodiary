import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TiLocationArrowOutline } from "react-icons/ti";



export default function HomeLogin() {
  return (
    <>
      <h1 className="text-2xl font-light">Bienvenido al Dashboard</h1>

      <div className='flex justify-center items-center min-h-[60vh]'>
        <section className="container flex flex-col justify-center items-center">
          <h1 className="font-dosis font-light text-5xl pt-4 pb-4" >¿Cómo te sientes hoy? 🫣</h1>
          <div className='flex justify-center items-center'>
            <p className='emotion-button'>😄</p>
            <p className='emotion-button'>😍</p>
            <p className='emotion-button'>😕</p>
            <p className='emotion-button'>🫠</p>
            <p className='emotion-button'>😤</p>
            <p className='emotion-button'>😡</p>
          </div>
          <div className="relative w-[60vw] mt-6">
            {/* <Input
              className='h-[50px] w-full pr-16 rounded-2xl border-2 placeholder:text-lg hover:shadow-2xl'
              placeholder='Escribe cómo te sientes hoy... por ejemplo: Estoy motivado y con energía'
            /> */}

            <Textarea
              className="min-h-[50px] w-full pr-16 rounded-2xl border-2 placeholder:text-xl hover:shadow-2xl resize-none overflow-hidden"
              placeholder="Escribe cómo te sientes hoy... Ej: Me siento agradecido y con energía"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />

            <Button
              className='absolute top-[50%] right-4 transform translate-y-[-50%] rounded-xl px-4 py-4 text-sm'
            // onClick={addEmotion()}
            >
              <TiLocationArrowOutline />
            </Button>
          </div>
          <Button
            variant="outline"
            className='mt-8 shadow-amber-100'
          // onClick={addLuckyButton()}
          >
            Me siento con suerte
          </Button>

        </section>
      </div>
    </>
  );
}
