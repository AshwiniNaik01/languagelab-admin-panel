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
  UserCircle2,
  LogOut,
  Activity,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  ListCollapse,
  MonitorCheck,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const [openSections, setOpenSections] = useState({
    institutes: false,
    licenses: false,
    editors: false,
    courses: false,
  });

  useEffect(() => {
    if (isCollapsed) return;
    setOpenSections({
      institutes: pathname.startsWith("/institutes"),
      licenses: pathname.startsWith("/licenses"),
      editors: pathname.startsWith("/editors"),
      courses: pathname.startsWith("/courses"),
    });
  }, [pathname, isCollapsed]);

  const toggleSection = (section) => {
    if (isCollapsed) return;
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isLinkActive = (href) => pathname === href;

  const accordionBtn = (section, icon, label) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black text-orange-355 uppercase tracking-widest bg-orange-950/40 hover:bg-orange-950/60 transition-all duration-300 ${
        isCollapsed ? "justify-center px-0" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </div>
      {!isCollapsed &&
        (openSections[section] ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        ))}
    </button>
  );

  const subLink = (href, icon, label) => (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
        pathname === href
          ? "bg-orange-500 text-[#3C1E0A] font-black"
          : "text-orange-200/80 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <aside
      className={`bg-[#2A1204] border-r border-orange-500/30 flex flex-col h-screen shrink-0 text-[#FFF8F4] font-sans shadow-2xl shadow-orange-500/5 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
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

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-none space-y-3 select-none">

        {/* Dashboard */}
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : ""
          } ${
            isLinkActive("/")
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] shadow-lg shadow-orange-500/20"
              : "text-orange-200/80 hover:text-white hover:bg-white/5"
          }`}
        >
          <House size={16} />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* Institutes */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          {accordionBtn("institutes", <Building2 size={15} />, "Institutes")}
          {!isCollapsed && openSections.institutes && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              {subLink("/institutes", <ListCollapse size={13} />, "Manage Institutes")}
              {subLink("/institutes/new", <PlusCircle size={13} />, "Add Institute")}
            </div>
          )}
        </div>

        {/* Licenses */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          {accordionBtn("licenses", <FileBadge2 size={15} />, "Licenses")}
          {!isCollapsed && openSections.licenses && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              {subLink("/licenses", <ListCollapse size={13} />, "Manage Licenses")}
            </div>
          )}
        </div>

        {/* Editors */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          {accordionBtn("editors", <Users size={15} />, "Editors")}
          {!isCollapsed && openSections.editors && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              {subLink("/editors", <ListCollapse size={13} />, "Manage Editors")}
              {subLink("/editors/new", <PlusCircle size={13} />, "Register Editor")}
            </div>
          )}
        </div>

        {/* Courses */}
        <div className="border border-orange-500/10 rounded-2xl overflow-hidden bg-white/5">
          {accordionBtn("courses", <FolderOpen size={15} />, "Courses")}
          {!isCollapsed && openSections.courses && (
            <div className="p-1.5 space-y-1 bg-[#2A1204] border-t border-orange-500/10">
              {subLink("/courses", <ListCollapse size={13} />, "Manage Courses")}
              {subLink("/courses/new", <PlusCircle size={13} />, "Add Course")}
            </div>
          )}
        </div>

        {/* Sessions — standalone */}
        <Link
          href="/sessions"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : ""
          } ${
            isLinkActive("/sessions")
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A] shadow-lg shadow-orange-500/20"
              : "text-orange-200/80 hover:text-white hover:bg-white/5"
          }`}
        >
          <MonitorCheck size={16} />
          {!isCollapsed && <span>Sessions</span>}
        </Link>

      </nav>

      {/* Profile & Logout footer */}
      <div className="p-4 border-t border-orange-500/20 space-y-1 bg-orange-950/10">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
            isCollapsed ? "justify-center px-0" : ""
          } ${
            isLinkActive("/profile")
              ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-[#3C1E0A]"
              : "text-orange-200 hover:text-white hover:bg-white/5"
          }`}
        >
          <UserCircle2 size={16} />
          {!isCollapsed && <span>Profile</span>}
        </Link>
        <button
          onClick={() => {
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
