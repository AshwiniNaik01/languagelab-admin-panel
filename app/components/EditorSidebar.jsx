"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  House, BookOpen, PlusCircle, ListCollapse,
  FolderOpen, ListTree, LogOut, ChevronDown, ChevronUp,
  User, Layers, FileText, Video, Music, Dumbbell, BookMarked,
} from "lucide-react";

const MODULE_TYPES = [
  { key: "text",       label: "Text",       icon: FileText   },
  { key: "video",      label: "Video",      icon: Video      },
  { key: "audio",      label: "Audio",      icon: Music      },
  { key: "exercise",   label: "Exercise",   icon: Dumbbell   },
  { key: "vocabulary", label: "Vocabulary", icon: BookMarked },
];

export default function EditorSidebar() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();

  // URL-derived section (no setState in effects — derived directly)
  const urlSection = useMemo(() => {
    if (isCollapsed) return "";
    if (pathname.startsWith("/editor/courses"))    return "courses";
    if (pathname.startsWith("/editor/curriculum")) return "curriculum";
    if (pathname.startsWith("/editor/modules"))    return "modules";
    return "";
  }, [pathname, isCollapsed]);

  // Manual toggle — null means "follow URL"
  const [manualSection, setManualSection] = useState(null);
  const openSection = manualSection ?? urlSection;

  const toggleSection = (section) => {
    if (isCollapsed) return;
    setManualSection(prev => {
      const current = prev ?? urlSection;
      return current === section ? "" : section;
    });
  };

  const isActive = (href) => {
    const [hPath, hQuery] = href.split("?");
    if (hQuery) {
      const params = new URLSearchParams(hQuery);
      const tab = params.get("tab");
      const add = params.get("add");
      if (tab) return pathname === hPath && searchParams.get("tab") === tab;
      if (add) return pathname === hPath && searchParams.get("add") === add;
    }
    if (href === "/editor") return pathname === href;
    if (pathname.startsWith("/editor/curriculum") || pathname.startsWith("/editor/modules")) {
      return pathname === hPath;
    }
    return pathname === href || pathname.startsWith(href);
  };

  const linkCls = (href) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
      isActive(href)
        ? "bg-orange-500 text-[#3C1E0A] font-black"
        : "text-orange-200/80 hover:bg-white/5 hover:text-white"
    }`;

  const sectionBtn = `w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-300 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-950/60 transition-all duration-200 cursor-pointer`;

  return (
    <aside className={`bg-[#2A1204] border-r border-orange-500/30 flex flex-col h-screen shrink-0 text-[#FFF8F4] shadow-2xl transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>

      {/* Logo */}
      <div className="p-6 border-b border-orange-500/20">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-2.5 rounded-2xl shadow-lg shrink-0">
            <BookOpen className="text-[#3C1E0A]" size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-black text-white leading-none">Lab<span className="text-orange-500">Editor</span></h1>
              <p className="text-[9px] font-black text-orange-400/80 mt-1 uppercase tracking-widest">Instructor Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-3 select-none">

        {/* Dashboard */}
        <Link
          href="/editor"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${isCollapsed ? "justify-center" : ""} ${
            pathname === "/editor"
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] shadow-lg"
              : "text-orange-200/80 hover:text-white hover:bg-white/5"
          }`}
        >
          <House size={16} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* Courses */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button onClick={() => toggleSection("courses")} className={sectionBtn}>
            <div className="flex items-center gap-2">
              <BookOpen size={15} />
              {!isCollapsed && <span>Courses</span>}
            </div>
            {!isCollapsed && (openSection === "courses" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
          {!isCollapsed && openSection === "courses" && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link href="/editor/courses"     className={linkCls("/editor/courses")}><ListCollapse size={14} /> Manage Courses</Link>
              <Link href="/editor/courses/new" className={linkCls("/editor/courses/new")}><PlusCircle size={14} /> Add Course</Link>
            </div>
          )}
        </div>

        {/* Topics */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button onClick={() => toggleSection("curriculum")} className={sectionBtn}>
            <div className="flex items-center gap-2">
              <FolderOpen size={15} />
              {!isCollapsed && <span>Topics</span>}
            </div>
            {!isCollapsed && (openSection === "curriculum" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
          {!isCollapsed && openSection === "curriculum" && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link href="/editor/curriculum?tab=topics"    className={linkCls("/editor/curriculum?tab=topics")}><BookOpen size={14} /> Topics</Link>
              <Link href="/editor/curriculum?tab=subtopics" className={linkCls("/editor/curriculum?tab=subtopics")}><ListTree size={14} /> SubTopics</Link>
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button onClick={() => toggleSection("modules")} className={sectionBtn}>
            <div className="flex items-center gap-2">
              <Layers size={15} />
              {!isCollapsed && <span>Modules</span>}
            </div>
            {!isCollapsed && (openSection === "modules" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>
          {!isCollapsed && openSection === "modules" && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              {MODULE_TYPES.map(({ key, label, icon: Icon }) => (
                <Link key={key} href={`/editor/modules/${key}`} className={linkCls(`/editor/modules/${key}`)}>
                  <Icon size={13} /> {label} Modules
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <Link
          href="/editor/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${isCollapsed ? "justify-center" : ""} ${
            pathname.startsWith("/editor/profile")
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] shadow-lg"
              : "text-orange-200/80 hover:text-white hover:bg-white/5"
          }`}
        >
          <User size={16} />
          {!isCollapsed && <span>Profile</span>}
        </Link>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-orange-500/20">
        <button
          onClick={() => {
            localStorage.removeItem("editor_token");
            document.cookie = "editor_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/admin-login";
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-orange-400 hover:bg-red-500/10 transition-all cursor-pointer ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
