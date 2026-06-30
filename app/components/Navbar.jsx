"use client";

import { UserCircle2, ChevronDown, Menu, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "./SidebarContext";

export default function Navbar() {
  const pathname = usePathname();
  const isEditorRoute = pathname.startsWith("/teacher");
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-20 bg-gradient-to-r from-[#FFF8F4]/95 to-[#FFF2EA]/95 backdrop-blur-md border-b border-orange-500/20 px-8 flex items-center justify-between z-10 shrink-0 shadow-lg shadow-orange-950/5">
      {/* Left section: Hamburger toggle & Premium branding/greeting */}
      <div className="flex items-center gap-6">
        {/* Hamburger menu toggle wrapper */}
        <div className="border-r border-orange-500/20 pr-5 mr-1 flex items-center h-10">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl hover:bg-orange-500/10 text-orange-700 hover:text-orange-600 transition duration-300 active:scale-95 shrink-0 border border-orange-500/20 shadow-sm bg-[#FFF8F4]"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Brand/Welcome Tag */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="bg-orange-500/10 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-orange-500/10">
            <Sparkles size={12} className="animate-pulse" />
            System Live
          </div>
          <span className="text-orange-900/40 font-light text-xl">/</span>
          <span className="text-[#3C1E0A] font-black text-sm uppercase tracking-widest">
            {isEditorRoute ? "Instructor Console" : "Master Panel"}
          </span>
        </div>
      </div>

      {/* Right Profile Section */}
      <div className="flex items-center gap-6">
        <Link
          href="/profile"
          className="flex items-center gap-3.5 pl-4 border-l border-orange-500/10 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <UserCircle2 size={24} className="text-white" />
          </div>

          <div className="text-left">
            <h3 className="font-black text-sm text-[#3C1E0A] tracking-tight">
              {isEditorRoute ? "Instructor Account" : "Super Admin"}
            </h3>
            <p className="text-[10px] font-bold text-orange-600/75 uppercase tracking-widest">
              {isEditorRoute ? "Curator" : "Root Admin"}
            </p>
          </div>
          <ChevronDown size={14} className="text-orange-900/50" />
        </Link>
      </div>
    </header>
  );
}
