import { SignInButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isSignedIn) {
      setLoading(true);
      const timer = setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [isSignedIn, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-white dark:bg-gray-400">
        <Loader isLoaded={loading} />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative h-screen w-full flex justify-center items-center overflow-hidden">
        <BackgroundImage />
        <MainContent />
      </div>
    );
  }

  if (isSignedIn) return null;

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden">
      <BackgroundImage />
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4">
        <MainContent />
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

function BackgroundImage() {
  return (
    <div className="absolute inset-0 bg-[url(assets/background_image.webp)] bg-center bg-cover opacity-60 brightness-100 dark:brightness-75 scale-105 z-0" />
  );
}

function MainContent() {
  return (
    <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6 md:p-8 border-2 border-[hsl(204,18%,80%)] bg-gradient-to-b from-[#F8F2EF] to-[#D3DADC] dark:from-[#1F1F1F] dark:to-[#2A2A2A]">
      {/* <h1 className="font-playwrite text-4xl sm:text-5xl md:text-6xl text-[#94461C] dark:text-white pt-6 sm:pt-8 pb-6 sm:pb-10 text-center"> */}
      <h1 className="font-playwrite text-4xl sm:text-5xl md:text-6xl text-orange-500 dark:text-white pt-6 sm:pt-8 pb-6 sm:pb-10 text-center">
        Moodiary
      </h1>
      <p className="font-dosis leading-relaxed text-base sm:text-lg text-center px-2 sm:px-4 text-[#000000] dark:text-[#CCCCCC]">
        Registra cómo te sientes en cualquier momento del día.<br />
        Tu bienestar emocional importa, y aquí tienes un espacio seguro para expresarlo.
      </p>
      <SignInButton mode="modal" forceRedirectUrl="/dashboard">
        <button className="bg-[hsl(83,12%,45%)] dark:bg-[#ffffff] dark:text-[#292933] font-dosis w-[80%] sm:w-[70%] h-[2.8rem] sm:h-[3rem] flex justify-center items-center text-white text-xl sm:text-2xl px-4 py-2 mt-10 sm:mt-12 mb-2 rounded-2xl transform transition hover:scale-110 duration-200 cursor-pointer">
          Iniciar Sesión
        </button>
      </SignInButton>
    </div>
  );
}
