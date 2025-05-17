import { SignInButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

function Home() {
  const { isSignedIn, isLoaded } = useUser(); // isLoaded indica si los datos están listos
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Redirigir inmediatamente si está logueado
        navigate("/dashboard", { replace: true });
      } else {
        // Ya sabemos que no está logueado, dejamos de cargar
        setLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoaded={!loading} />
      </div>
    );
  }

  // Si está firmado, no renderizamos nada porque redirige
  if (isSignedIn) return null;

  return (
    <div className="h-screen flex justify-center items-center bg-[url(assets/images/bg_image.jpg)] bg-no-repeat bg-center bg-cover">
      <div className="w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6 bg-transparent backdrop-blur-xl">
        <h1 className="font-playwrite text-6xl pt-8 pb-10">Moodiary</h1>
        <p className="font-dosis leading-relaxed text-xl px-4">
          Registra cómo te sientes en cualquier momento del día y empieza a
          entender mejor tus emociones. Reflexiona, crece y cuida de ti mismo
          con solo unos minutos al día. Tu bienestar emocional importa, y aquí
          tienes un espacio seguro para expresarlo.
        </p>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="bg-amber-400 font-dosis text-center text-2xl px-4 py-3 mt-5 mb-1.5 rounded-2xl transform transition hover:scale-110 duration-200 cursor-pointer">
            Iniciar sesión
          </button>
        </SignInButton>
      </div>
    </div>
  );
}

export default Home;
