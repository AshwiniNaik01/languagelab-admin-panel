"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  House,
  Building2,
  FileBadge2,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  Activity,
  UserCheck,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  ListCollapse
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  
  // Track open accordion sections for each model
  const [openSections, setOpenSections] = useState({
    Institutes: false,
    licenses: false,
    editors: false,
    students: false,
    curriculum: false
  });

  // Automatically keep accordion sections open when corresponding sub-paths are active
  useEffect(() => {
    if (isCollapsed) return;
    
    const isInstitutesActive = pathname.startsWith("/institutes");
    const isLicensesActive = pathname.startsWith("/licenses");
    const isEditorsActive = pathname.startsWith("/editors");
    const isStudentsActive = pathname.startsWith("/students");
    const isCurriculumActive = pathname.startsWith("/content") || pathname.startsWith("/sessions");

    setOpenSections({
      Institutes: isInstitutesActive,
      licenses: isLicensesActive,
      editors: isEditorsActive,
      students: isStudentsActive,
      curriculum: isCurriculumActive
    });
  }, [pathname, isCollapsed]);

  const toggleSection = (section) => {
    if (isCollapsed) return;
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isLinkActive = (href) => {
    return pathname === href;
  };


  return (
    <aside 
      className={`bg-[#2A1204] border-r border-orange-500/30 flex flex-col h-screen shrink-0 text-[#FFF8F4] font-sans shadow-2xl shadow-orange-500/5 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header Profile / Logo */}
      <div className="p-6 border-b border-orange-500/20 bg-gradient-to-b from-orange-950/20 to-transparent">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20 shrink-0">
            <FolderOpen className="text-[#3C1E0A]" size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-none">
                Language<span className="text-orange-500 font-extrabold">Lab</span>
              </h1>
              <p className="text-[9px] font-black text-orange-450/80 mt-1 uppercase tracking-widest">
                Control Center
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accordion Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-none space-y-3 select-none">
        
        {/* Dashboard Link */}
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : ""
          } ${
            isLinkActive("/") 
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] shadow-lg shadow-orange-500/20 scale-102" 
              : "text-orange-200/80 hover:text-white hover:bg-white/5"
          }`}
        >
          <House size={16} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* 1. COLLEGES Accordion */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("Institutes")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 size={15} />
              {!isCollapsed && <span>Institutes</span>}
            </div>
            {!isCollapsed && (openSections.Institutes ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSections.Institutes && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
             <Link
  href="/institutes"
  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
    pathname === "/institutes"
      ? "bg-orange-500 text-[#3C1E0A] font-black"
      : "text-orange-200/80 hover:bg-white/5"
  }`}
>
  <ListCollapse size={13} />
  Manage Institutes
</Link>

<Link
  href="/institutes/new"
  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
    pathname === "/institutes/new"
      ? "bg-orange-500 text-[#3C1E0A] font-black"
      : "text-orange-200/80 hover:bg-white/5"
  }`}
>
  <PlusCircle size={13} />
  Add Institute
</Link>
            </div>
          )}
        </div>

        {/* 2. LICENSES Accordion */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("licenses")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <FileBadge2 size={15} />
              {!isCollapsed && <span>Licenses</span>}
            </div>
            {!isCollapsed && (openSections.licenses ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSections.licenses && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link
                href="/licenses"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/licenses" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <ListCollapse size={13} />
                Manage Licenses
              </Link>
              <Link
                href="/licenses/new"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/licenses/new" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <PlusCircle size={13} />
                Issue License
              </Link>
            </div>
          )}
        </div>

        {/* 3. TEACHERS Accordion */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("editors")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={15} />
              {!isCollapsed && <span>Editors</span>}
            </div>
            {!isCollapsed && (openSections.editors ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSections.editors && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link
                href="/editors"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/editors" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <ListCollapse size={13} />
                Manage Editors
              </Link>
              <Link
                href="/editors/new"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/editors/new" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <PlusCircle size={13} />
                Register Editor
              </Link>
            </div>
          )}
        </div>

        {/* 4. STUDENTS Accordion */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("students")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCheck size={15} />
              {!isCollapsed && <span>Students</span>}
            </div>
            {!isCollapsed && (openSections.students ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSections.students && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link
                href="/students"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/students" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <ListCollapse size={13} />
                Manage Students
              </Link>
              <Link
                href="/students/new"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/students/new" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <PlusCircle size={13} />
                Register Student
              </Link>
            </div>
          )}
        </div>

        {/* 5. CURRICULUM Accordion */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          <button
            onClick={() => toggleSection("curriculum")}
            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-955/60 transition-all duration-300 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen size={15} />
              {!isCollapsed && <span>Curriculum</span>}
            </div>
            {!isCollapsed && (openSections.curriculum ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </button>

          {!isCollapsed && openSections.curriculum && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              <Link
                href="/content"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/content" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <FolderOpen size={13} />
                Materials
              </Link>

              <Link
                href="/sessions"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  pathname === "/sessions" ? "bg-orange-500 text-[#3C1E0A] font-black" : "text-orange-200/80 hover:bg-white/5"
                }`}
              >
                <Activity size={13} />
                Sessions
              </Link>
            </div>
          )}
        </div>

      </nav>

      {/* Settings & Logout footer */}
      <div className="p-4 border-t border-orange-500/20 space-y-1 bg-orange-950/10">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-orange-200 hover:text-white hover:bg-white/5 transition-all duration-200 ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <Settings size={16} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/admin-login";
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-orange-400 hover:bg-red-500/10 transition-all duration-200 text-left cursor-pointer ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}