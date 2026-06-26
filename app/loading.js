export default function RootLoading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-orange-500" />
        <p className="text-sm font-semibold text-slate-400 tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
