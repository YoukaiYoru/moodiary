import { SignInButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
function Home() {
  const { isSignedIn } = useUser();
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

  if (isSignedIn) return null;

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-[40%] flex flex-col items-center rounded-4xl shadow-2xl p-6">
        <h1 className="font-playwrite text-6xl pb-10">Moodiary</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
          distinctio vel est culpa, iste reiciendis laudantium rerum. Ea,
          laboriosam recusandae!
        </p>
        <SignInButton forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}

export default Home;
