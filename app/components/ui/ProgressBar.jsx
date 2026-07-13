export default function ProgressBar({
  percentage = 0,
  color = "from-orange-500 to-amber-600",
  label,
  showLabel = true,
}) {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <div>
      {showLabel && (
        <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-500">
          <span className="truncate">{label}</span>
          <span>{clamped}%</span>
        </div>
      )}

      <div className="h-2 overflow-hidden rounded-full bg-orange-100">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
