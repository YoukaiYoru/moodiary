import { SignInButton, useUser } from "@clerk/clerk-react";
import Loader from "@/components/Loader";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoaded={false} />
      </div>
    );
  }

  // Si ya está logueado, no mostramos esta pantalla
  if (isSignedIn) return null;

  return (
    <div className="h-screen flex justify-center items-center bg-[url(assets/images/bg_image.jpg)] bg-no-repeat bg-center bg-cover">
      <div className="w-[90%] max-w-2xl flex flex-col items-center rounded-4xl shadow-2xl p-6 bg-transparent backdrop-blur-xl">
        <h1 className="font-playwrite text-6xl pt-8 pb-10 text-center">
          Moodiary
        </h1>
        <p className="font-dosis leading-relaxed text-xl px-4 text-center">
          Registra cómo te sientes en cualquier momento del día y empieza a
          entender mejor tus emociones. Reflexiona, crece y cuida de ti mismo
          con solo unos minutos al día. Tu bienestar emocional importa, y aquí
          tienes un espacio seguro para expresarlo.
        </p>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="bg-amber-400 font-dosis text-center text-2xl px-6 py-3 mt-8 rounded-2xl transform transition hover:scale-110 duration-200 cursor-pointer">
            Iniciar sesión
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
