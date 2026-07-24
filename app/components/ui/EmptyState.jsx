"use client";

export default function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>
      <h3 className="text-base font-black text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-400 max-w-xs mb-5">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
