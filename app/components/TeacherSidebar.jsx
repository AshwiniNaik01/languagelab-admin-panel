"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  FolderOpen,
  ClipboardList,
  Gamepad2,
  Settings,
  LogOut,
  ArrowLeftRight
} from "lucide-react";

export default function TeacherSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/teacher", label: "Overview", icon: House },
    { href: "/teacher/curriculum", label: "Topics & Modules", icon: FolderOpen },
    { href: "/teacher/assessments", label: "Assessments Builder", icon: ClipboardList },
    { href: "/teacher/games", label: "Vocabulary Games", icon: Gamepad2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-orange-100 flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2.5 rounded-xl shadow-md shadow-orange-600/20">
            <ClipboardList className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-none">
              Lab<span className="text-orange-500">Teacher</span>
            </h1>
            <p className="text-[10px] font-medium text-orange-400 mt-1 uppercase tracking-wider">
              Instructor Portal
            </p>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/teacher" && pathname.startsWith(link.href));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Switch role & Logout */}
      <div className="p-4 border-t border-orange-50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all duration-200"
        >
          <ArrowLeftRight size={18} />
          SuperAdmin View
        </Link>
        <button
          onClick={() => alert("Simulating Instructor Logout...")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50/80 transition-all duration-200 text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
