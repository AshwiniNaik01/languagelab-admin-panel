import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F4]">
      <div className="text-center px-6">
        <p className="text-8xl font-black text-orange-500 mb-2">404</p>
        <h2 className="text-xl font-black text-slate-800 mb-2">Page not found</h2>
        <p className="text-sm text-slate-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/editor"
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
