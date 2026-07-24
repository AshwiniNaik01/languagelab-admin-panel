export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-[#fdf8f4] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-orange-500" />
        <p className="text-sm font-semibold text-slate-400 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
