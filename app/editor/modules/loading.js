export default function ModulesLoading() {
  return (
    <div className="p-6 space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-200" />
        <div className="space-y-1.5">
          <div className="h-6 w-40 bg-slate-200 rounded-lg" />
          <div className="h-3 w-56 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Topic/Subtopic dropdowns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="h-12 bg-orange-500/80 rounded-t-2xl" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-40 bg-slate-200 rounded" />
              <div className="h-2.5 w-20 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
            <div className="h-8 w-8 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
