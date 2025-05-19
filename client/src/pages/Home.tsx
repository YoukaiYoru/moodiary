import { SignInButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isSignedIn) {
      setLoading(true); // Inicia el loading
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500); // Puedes ajustar el tiempo de transición
    } else {
      setLoading(false); // No es necesario el loading si no está logueado
    }
  }, [isSignedIn, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoaded={loading} />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative h-screen w-full flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url(assets/background_image.webp)] bg-center bg-cover opacity-60 brightness-100 dark:brightness-75 scale-105 z-0" />
        <div
          className="relative z-10 w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6 border-2 border-[hsl(204,18%,80%)]
                            bg-gradient-to-b from-[#F8F2EF] to-[#D3DADC]
                            dark:from-[#1F1F1F] dark:to-[#2A2A2A]"
        >
          <h1 className="font-playwrite text-6xl text-[#94461C] dark:text-white pt-8 pb-10">
            Moodiary
          </h1>
          <p className="font-dosis leading-relaxed text-lg text-center  px-4 text-[#000000] dark:text-[#CCCCCC]">
            Registra cómo te sientes en cualquier momento del día. Tu bienestar
            emocional importa, y aquí tienes un espacio seguro para expresarlo.
          </p>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="bg-[hsl(83,12%,45%)] dark:bg-[#ffffff] dark:text-[#292933] font-dosis w-[70%] h-[3rem] flex justify-center items-center text-white text-2xl px-4 py-3 mt-12 mb-1.5 rounded-2xl transform transition hover:scale-110 duration-200 cursor-pointer">
              Iniciar Sesión
            </button>
          </SignInButton>
        </div>
      </div>
      // <div className="flex justify-center items-center h-screen">
      //   <Loader isLoaded={false} />
      // </div>
    );
  }

  // Si ya está logueado, no mostramos esta pantalla
  if (isSignedIn) return null;

  return (
    <div className="relative h-screen w-full flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-[url(assets/background_image.webp)] bg-center bg-cover opacity-60 brightness-100 dark:brightness-75 scale-105 z-0" />
      <div
        className="relative z-10 w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6 border-2 border-[hsl(204,18%,80%)]
                            bg-gradient-to-b from-[#F8F2EF] to-[#D3DADC]
                            dark:from-[#1F1F1F] dark:to-[#2A2A2A]"
      >
        <h1 className="font-playwrite text-6xl text-[#94461C] dark:text-white pt-8 pb-10">
          Moodiary
        </h1>
        <p className="font-dosis leading-relaxed text-lg text-center  px-4 text-[#000000] dark:text-[#CCCCCC]">
          Registra cómo te sientes en cualquier momento del día. Tu bienestar
          emocional importa, y aquí tienes un espacio seguro para expresarlo.
        </p>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="bg-[hsl(83,12%,45%)] dark:bg-[#ffffff] dark:text-[#292933] font-dosis w-[70%] h-[3rem] flex justify-center items-center text-white text-2xl px-4 py-3 mt-12 mb-1.5 rounded-2xl transform transition hover:scale-110 duration-200 cursor-pointer">
            Iniciar Sesión
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
