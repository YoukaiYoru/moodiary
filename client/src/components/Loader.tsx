export default function Loader({ isLoaded }: { isLoaded: boolean }) {
  if (isLoaded) return null;

  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Cargando">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
    </div>
  );
}
