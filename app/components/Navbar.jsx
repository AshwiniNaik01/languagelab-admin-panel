"use client";

import {
  Search,
  Settings,
  UserCircle2,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

      {/* Search Bar */}
      <div className="relative w-[520px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search colleges, licenses, courses, content..."
          className="
            w-full
            pl-12
            pr-4
            py-3
            rounded-xl
            border
            border-orange-100
            focus:outline-none
            focus:ring-2
            focus:ring-orange-300
          "
        />

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8">

        {/* Settings */}
        <button className="text-gray-600 hover:text-orange-500 transition">
          <Settings size={22} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">

            <UserCircle2
              size={26}
              className="text-orange-500"
            />

          </div>

          <div>

            <h3 className="font-semibold text-gray-800">
              Super Admin
            </h3>

            <p className="text-sm text-gray-500">
              Platform Administrator
            </p>
            

          </div>

          <ChevronDown
            size={18}
            className="text-gray-500"
          />

        </div>

      </div>

    </header>
  );
}