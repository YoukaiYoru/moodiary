import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";
import backgroundImage from "@/assets/background_image.webp";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-svh w-full items-center justify-center overflow-x-hidden">
        <BackgroundImage />
        <MainContent onOpenAuth={() => setAuthOpen(true)} />
      </div>
    );
  }

  if (isAuthenticated) return <Loader isLoaded={false} />;

  return (
    <div className="relative flex min-h-svh w-full flex-col overflow-hidden">
      <BackgroundImage />
      <div className="relative z-10 flex flex-grow flex-col items-center justify-center px-4 pb-0 pt-8 sm:pt-10">
        <MainContent onOpenAuth={() => setAuthOpen(true)} />
      </div>
      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function BackgroundImage() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 bg-cover bg-center opacity-60 brightness-100 dark:brightness-75"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  );
}

function MainContent({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-[#D8E3E6] bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:p-6">
      <h1 className="font-playwrite pb-4 pt-1 text-center text-2xl text-[#455763] sm:pb-6 sm:pt-2 sm:text-3xl md:text-4xl">
        Moodiary
      </h1>
      <p className="px-2 text-center font-dosis text-xs leading-relaxed text-[#3F4B52] sm:px-3 sm:text-sm">
        Registra cómo te sientes en cualquier momento del día.<br />
        Tu bienestar emocional importa, y aquí tienes un espacio seguro para expresarlo.
      </p>
      <button type="button" onClick={onOpenAuth} className="mt-6 mb-1 flex h-10 w-full max-w-[14rem] items-center justify-center rounded-lg bg-[#455763] px-4 py-2 font-dosis text-base text-white transition duration-200 hover:bg-[#374852] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAB7BC] focus-visible:ring-offset-2 sm:mt-8 sm:text-lg">
        Iniciar sesión
      </button>
    </div>
  );
}
