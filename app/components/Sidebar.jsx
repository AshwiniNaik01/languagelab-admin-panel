"use client";

import {
  House,
  Building2,
  FileBadge2,
  Users,
  FolderOpen,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">

      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">

          <div className="bg-orange-500 p-2 rounded-xl">
            <BookOpen className="text-white" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-orange-500">
              LanguageLab
            </h1>

            <p className="text-xs text-gray-500">
              Language Lab Platform
            </p>
          </div>

        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4">

        <div className="space-y-2">

          {/* Active Menu */}
          <button className="w-full flex items-center gap-3 bg-orange-500 text-white px-4 py-3 rounded-xl font-medium">
            <House size={20} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <Building2 size={20} />
            Colleges
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <FileBadge2 size={20} />
            Licenses
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <Users size={20} />
            Staff
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <FolderOpen size={20} />
            Content
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <BookOpen size={20} />
            Courses
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <ClipboardCheck size={20} />
            Assessment
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <BarChart3 size={20} />
            Analytics
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 transition">
            <Settings size={20} />
            Settings
          </button>

        </div>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">

        <button className="w-full flex items-center gap-3 text-gray-600 hover:text-orange-500 transition">

          <LogOut size={20} />
          Logout

        </button>

      </div>

    </aside>
  );
}