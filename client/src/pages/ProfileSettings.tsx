import { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Check, KeyRound, ShieldAlert, Trash2, UserRound, X } from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Profile = {
  email: string;
  display_name: string | null;
  preferred_mood: string | null;
  avatar_url: string | null;
};

const moods = ["Alegría", "Calma", "Ansiedad", "Tristeza", "Enojo"];

function requestMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.response?.data?.error || error.message;
  return error instanceof Error ? error.message : "No pudimos completar la solicitud.";
}

export default function ProfileSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState(user?.displayName || "");
  const [mood, setMood] = useState("");
  const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState<"data" | "account" | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    api.get<Profile>("/profile")
      .then((response) => {
        if (!active) return;
        setProfile(response.data);
        setName(response.data.display_name || user?.displayName || "");
        setMood(response.data.preferred_mood || "");
        setAvatar(response.data.avatar_url);
      })
      .catch((error) => toast.error("No pudimos cargar tu perfil", { description: requestMessage(error) }))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, user?.displayName]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 1_000_000) {
      toast.error("Imagen no válida", { description: "Usa JPG, PNG o WebP de máximo 1 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.patch("/profile", { display_name: name.trim(), preferred_mood: mood || null, avatar_url: avatar });
      await refreshUser();
      toast.success("Perfil actualizado");
    } catch (error) {
      toast.error("No pudimos guardar tu perfil", { description: requestMessage(error) });
    } finally { setSaving(false); }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setChangingPassword(true);
    try {
      await api.patch("/profile/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Contraseña actualizada", { description: "Tus otras sesiones fueron cerradas." });
    } catch (error) {
      toast.error("No pudimos cambiar la contraseña", { description: requestMessage(error) });
    } finally { setChangingPassword(false); }
  };

  const deleteData = async () => {
    const password = window.prompt("Escribe tu contraseña para borrar tus notas y estadísticas:");
    if (!password) return;
    setDeleting("data");
    try {
      const response = await api.delete("/profile/data", { data: { currentPassword: password } });
      toast.success("Datos eliminados", { description: `${response.data.moodEntriesDeleted} notas fueron eliminadas.` });
    } catch (error) { toast.error("No pudimos borrar tus datos", { description: requestMessage(error) }); }
    finally { setDeleting(null); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Esta acción elimina tu cuenta y todos tus datos. ¿Continuar?")) return;
    const password = window.prompt("Escribe tu contraseña para confirmar la eliminación:");
    if (!password) return;
    setDeleting("account");
    try {
      await api.delete("/profile", { data: { currentPassword: password } });
      await logout();
      window.location.assign("/");
    } catch (error) { toast.error("No pudimos eliminar la cuenta", { description: requestMessage(error) }); setDeleting(null); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-[#26363d]/55 backdrop-blur-sm" aria-hidden="true" />
      <section role="dialog" aria-modal="true" aria-labelledby="profile-settings-title" className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#D8E3E6] bg-[#FCFEFE] shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
        <header className="flex shrink-0 items-start justify-between border-b border-[#D8E3E6] px-5 pb-4 pt-5 sm:px-7">
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#68777D]">Cuenta</p><h1 id="profile-settings-title" className="font-dosis text-2xl font-semibold text-[#455763]">Tu perfil y privacidad</h1><p className="mt-1 text-sm text-[#68777D]">Personaliza tu espacio y decide qué conservar.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar ajustes de perfil" className="rounded-full p-2 text-[#68777D] transition hover:bg-[#F1F8FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAB7BC]"><X className="size-5" /></button>
        </header>
        <div className="min-h-0 overflow-y-auto p-3 sm:p-5">
          {loading && <div className="py-10 text-center text-sm text-[#68777D]" role="status">Cargando tu perfil…</div>}
          {!loading && <div className="space-y-5">

      <form onSubmit={saveProfile} className="rounded-2xl border border-[#D8E3E6] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DDECEF] text-2xl font-semibold text-[#455763]">
            {avatar ? <img src={avatar} alt="Tu foto de perfil" className="size-full object-cover" /> : <UserRound className="size-8" />}
            <label className="absolute inset-x-0 bottom-0 flex cursor-pointer items-center justify-center bg-[#26363d]/75 py-1 text-white" aria-label="Cambiar foto de perfil">
              <Camera className="size-4" /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatar} className="sr-only" />
            </label>
          </div>
          <div><h2 className="font-dosis text-lg font-semibold text-[#455763]">Información personal</h2><p className="text-xs text-[#68777D]">JPG, PNG o WebP · máximo 1 MB</p></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#455763]">Nombre visible<Input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} className="mt-1.5 h-11 bg-white" /></label>
          <label className="text-sm font-semibold text-[#455763]">Correo electrónico<Input value={profile?.email || user?.email || ""} readOnly className="mt-1.5 h-11 bg-[#F1F8FA] text-[#68777D]" /></label>
        </div>
        <label className="mt-4 block text-sm font-semibold text-[#455763]">Estado de ánimo preferido<select value={mood} onChange={(event) => setMood(event.target.value)} className="mt-1.5 flex h-11 w-full rounded-md border border-[#D8E3E6] bg-white px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[#AAB7BC]"><option value="">Sin preferencia</option>{moods.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div className="mt-5 flex justify-end"><Button type="submit" disabled={saving} className="bg-[#455763] text-white hover:bg-[#374852]"><Check className="size-4" />{saving ? "Guardando…" : "Guardar cambios"}</Button></div>
      </form>

      <form onSubmit={changePassword} className="rounded-2xl border border-[#D8E3E6] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-[#F1F8FA] p-2 text-[#455763]"><KeyRound className="size-5" /></div><div><h2 className="font-dosis text-lg font-semibold text-[#455763]">Seguridad</h2><p className="text-xs text-[#68777D]">Cambia tu contraseña y cierra las sesiones anteriores.</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#455763]">Contraseña actual<Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} minLength={10} required className="mt-1.5 h-11 bg-white" /></label><label className="text-sm font-semibold text-[#455763]">Nueva contraseña<Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={10} maxLength={128} required className="mt-1.5 h-11 bg-white" /></label></div>
        <div className="mt-5 flex justify-end"><Button type="submit" variant="outline" disabled={changingPassword}>{changingPassword ? "Actualizando…" : "Cambiar contraseña"}</Button></div>
      </form>

      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-red-100 p-2 text-red-700"><ShieldAlert className="size-5" /></div><div><h2 className="font-dosis text-lg font-semibold text-red-900">Zona de datos</h2><p className="text-xs text-red-800/75">Estas acciones son permanentes y requieren tu contraseña.</p></div></div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-red-900">Borrar notas y estadísticas</p><p className="text-xs text-red-800/75">Conserva tu cuenta, nombre y foto.</p></div><Button type="button" variant="outline" onClick={() => void deleteData()} disabled={deleting !== null} className="border-red-300 text-red-800 hover:bg-red-100">{deleting === "data" ? "Borrando…" : "Borrar mis datos"}</Button></div>
        <div className="mt-5 flex flex-col gap-3 border-t border-red-200 pt-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-red-900">Eliminar cuenta</p><p className="text-xs text-red-800/75">Elimina tu perfil, sesiones y todo su contenido.</p></div><Button type="button" variant="destructive" onClick={() => void deleteAccount()} disabled={deleting !== null}><Trash2 className="size-4" />{deleting === "account" ? "Eliminando…" : "Eliminar cuenta"}</Button></div>
      </section>
          </div>}
        </div>
      </section>
    </div>
  );
}
