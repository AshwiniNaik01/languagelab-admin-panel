"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  House,
  FolderOpen,
  ClipboardList,
  Gamepad2,
  LogOut,
  ChevronDown,
  ChevronUp,
  BookOpen,
  PlusCircle,
  ListCollapse
} from "lucide-react";

export default function EditorSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
const [openSection, setOpenSection] = useState("courses");

  // Keep accordion open if it contains the active tab link
  useEffect(() => {
  if (isCollapsed) return;

  if (pathname.startsWith("/editor/courses")) {
    setOpenSection("courses");
  } else if (pathname.startsWith("/editor/curriculum")) {
    setOpenSection("curriculum");
  } else if (
    pathname.startsWith("/editor/assessments") ||
    pathname.startsWith("/editor/games")
  ) {
    setOpenSection("evaluation");
  }
}, [pathname, isCollapsed]);

const toggleSection = (section) => {
  if (isCollapsed) return;
  setOpenSection(openSection === section ? "" : section);
};

const isLinkActive = (href) => {
  return (
    pathname === href ||
    (href !== "/editor" && pathname.startsWith(href))
  );
};
  return (
    <aside 
      className={`bg-[#2A1204] border-r border-orange-500/30 flex flex-col h-screen shrink-0 text-[#FFF8F4] font-sans shadow-2xl shadow-orange-500/5 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header Logo */}
      <div className="p-6 border-b border-orange-500/20 bg-gradient-to-b from-orange-950/20 to-transparent">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20 shrink-0">
            <ClipboardList className="text-[#3C1E0A]" size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-none">
                Lab<span className="text-orange-500">Editor</span>
              </h1>
              <p className="text-[9px] font-black text-orange-450/80 mt-1 uppercase tracking-widest">
                Instructor Portal
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accordion Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-none space-y-3 select-none">
        
        {/* Overview */}
        <Link
          href="/editor"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : ""
          } ${
            pathname === "/editor" 
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] shadow-lg shadow-orange-500/20 scale-102" 
              : "text-orange-200/80 hover:text-white hover:bg-white/5"
          }`}
        >
          <House size={16} />
          {!isCollapsed && <span>Overview</span>}
        </Link>

        {/* Section: Courses */}
<div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
  <button
    onClick={() => toggleSection("courses")}
    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
      isCollapsed ? "justify-center px-0" : ""
    }`}
  >
    <div className="flex items-center gap-2">
      <BookOpen size={15} />
      {!isCollapsed && <span>Courses</span>}
    </div>

    {!isCollapsed &&
      (openSection === "courses" ? (
        <ChevronUp size={14} />
      ) : (
        <ChevronDown size={14} />
      ))}
  </button>

  {!isCollapsed && openSection === "courses" && (
    <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">

      <Link
        href="/editor/courses"
        className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
          isLinkActive("/editor/courses")
            ? "bg-orange-500 text-[#3C1E0A] font-black"
            : "text-orange-200/80 hover:bg-white/5 hover:text-white"
        }`}
      >
        <ListCollapse size={14} />
        Manage Courses
      </Link>

      <Link
        href="/editor/courses/new"
        className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
          pathname === "/editor/courses/new"
            ? "bg-orange-500 text-[#3C1E0A] font-black"
            : "text-orange-200/80 hover:bg-white/5 hover:text-white"
        }`}
      >
        <PlusCircle size={14} />
        Add Course
      </Link>

    </div>
  )}
</div>

        {/* Section: Curriculum Materials */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("curriculum")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen size={15} />
              {!isCollapsed && <span>Course Materials</span>}
            </div>
            {!isCollapsed && (openSection === "curriculum" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSection === "curriculum" && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link
                href="/editor/curriculum"
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isLinkActive("/editor/curriculum") ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FolderOpen size={14} />
                Topics & Modules
              </Link>
            </div>
          )}
        </div>

        {/* Section: Evaluation */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("evaluation")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-955/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList size={15} />
              {!isCollapsed && <span>Evaluation</span>}
            </div>
            {!isCollapsed && (openSection === "evaluation" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSection === "evaluation" && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link
                href="/editor/assessments"
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isLinkActive("/editor/assessments") ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <ClipboardList size={14} />
                Assessments
              </Link>

              <Link
                href="/editor/games"
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isLinkActive("/editor/games") ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Gamepad2 size={14} />
                Vocab Games
              </Link>
            </div>
          )}
        </div>

      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-orange-500/20 bg-orange-950/10">
        <button
          onClick={() => {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("lab_topics");
            localStorage.removeItem("lab_subtopics");
            window.location.href = "/admin-login";
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-orange-400 hover:bg-red-500/10 transition-all duration-200 text-left cursor-pointer ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Logout Panel</span>}
        </button>
      </div>
    </aside>
  );
}
