import { useEffect, useRef, useState } from "react";
import { X, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    setTimeout(() => emailRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") await login({ email, password });
      else await register({ email, password, displayName });
      onClose();
    } catch (requestError: unknown) {
      const responseMessage = (requestError as { response?: { data?: { message?: string; error?: string } } })
        .response?.data;
      setError(responseMessage?.message || responseMessage?.error || "No pudimos completar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-[#26363d]/55 backdrop-blur-sm" aria-hidden="true" />
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#D8E3E6] bg-[#FCFEFE] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#E8EFF0] px-6 pb-5 pt-6 sm:px-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[#748991]"><Sparkles className="size-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Tu espacio seguro</span></div>
            <h2 id="auth-title" className="font-playwrite text-2xl text-[#455763]">{mode === "login" ? "Qué bueno verte" : "Crea tu refugio"}</h2>
            <p className="mt-1 text-sm text-[#68777D]">{mode === "login" ? "Continúa registrando cómo te sientes." : "Empieza a guardar tus momentos emocionales."}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar ventana" className="rounded-full p-2 text-[#68777D] transition hover:bg-[#F1F8FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAB7BC]"><X className="size-5" /></button>
        </div>

        <div className="flex gap-1 bg-[#F1F8FA] p-1.5 mx-6 mt-5 rounded-xl sm:mx-8">
          {(["login", "register"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => switchMode(tab)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === tab ? "bg-white text-[#455763] shadow-sm" : "text-[#748991] hover:text-[#455763]"}`}>
              {tab === "login" ? "Iniciar sesión" : "Registrarme"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-7 pt-5 sm:px-8">
          {mode === "register" && <label className="block text-sm font-semibold text-[#455763]">¿Cómo te llamamos?<Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Tu nombre" autoComplete="name" className="mt-1.5 h-11 bg-white" maxLength={80} /></label>}
          <label className="block text-sm font-semibold text-[#455763]">Correo electrónico<Input ref={emailRef} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" autoComplete="email" required className="mt-1.5 h-11 bg-white" /></label>
          <label className="block text-sm font-semibold text-[#455763]">Contraseña<div className="relative mt-1.5"><Input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "register" ? "Mínimo 10 caracteres" : "Tu contraseña"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={10} required className="h-11 bg-white pr-11" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#748991] hover:bg-[#F1F8FA]"><>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</></button></div></label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={submitting} className="h-11 w-full bg-[#455763] text-base text-white hover:bg-[#374852]">{submitting ? "Un momento…" : mode === "login" ? "Entrar a Moodiary" : "Crear mi cuenta"}</Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#748991]"><ShieldCheck className="size-3.5" />Tu sesión queda protegida con una cookie segura.</p>
        </form>
      </section>
    </div>
  );
}
