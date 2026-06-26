export default function TableSkeleton({ rows = 5, cols = 3 }) {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* header */}
      <div className="h-12 bg-orange-400/60 rounded-t-2xl" />
      {/* rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0">
          <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-44 bg-slate-200 rounded" />
            <div className="h-2.5 w-24 bg-slate-100 rounded" />
          </div>
          {Array.from({ length: cols - 1 }).map((_, j) => (
            <div key={j} className="h-6 w-16 bg-slate-100 rounded-full" />
          ))}
          <div className="h-8 w-8 bg-slate-100 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
