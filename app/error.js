"use client";

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F4]">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl" aria-hidden="true">⚠️</span>
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
