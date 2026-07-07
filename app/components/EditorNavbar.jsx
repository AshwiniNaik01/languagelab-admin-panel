"use client";

import { UserCircle2, ChevronDown, Menu, Sparkles, BookOpen } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { usePathname, useSearchParams } from "next/navigation";


export default function EditorNavbar() {

  const { toggleSidebar } = useSidebar();
 const pathname = usePathname();
const searchParams = useSearchParams();


const getPageInfo = () => {

  const tab = searchParams.get("tab");


  // Curriculum page tabs
  if (pathname === "/editor/curriculum") {

    const curriculumTabs = {
      topics: {
        title: "Topics",
        description: "Manage course topics",
      },

      subtopics: {
        title: "SubTopics",
        description: "Manage topic sub-sections",
      },

      modules: {
        title: "Modules",
        description: "Manage learning modules",
      },

      materials: {
        title: "Materials",
        description: "Manage course materials",
      },

      exercises: {
        title: "Exercises",
        description: "Manage assessments",
      },
    };


    return curriculumTabs[tab] || {
      title: "Curriculum",
      description: "Manage curriculum",
    };
  }


  // Normal pages
  const path = pathname.split("/").filter(Boolean);

  const page = path[path.length - 1];


  if (!page || page === "editor") {
    return {
      title: "Dashboard",
      description: "Manage your content workspace",
    };
  }


  const title = page
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());


  return {
    title,
    description: `Manage ${title.toLowerCase()}`,
  };
};


const pageInfo = getPageInfo();
  return (
    <header className="h-20 bg-gradient-to-r from-[#FFF8F4]/95 to-[#FFF2EA]/95 backdrop-blur-md border-b border-orange-500/20 px-4 flex items-center justify-between z-10 shrink-0 shadow-lg shadow-orange-950/5">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <div className="border-r border-orange-500/20 pr-2 mr-0 flex items-center h-10">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl hover:bg-orange-500/10 text-orange-700 hover:text-orange-600 transition duration-300 active:scale-95 shrink-0 border border-orange-500/20 shadow-sm bg-[#FFF8F4]"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Branding */}
        <div className="hidden sm:flex items-center gap-1">
          <div className="bg-orange-500/10 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-orange-500/10">
            <Sparkles size={12} className="animate-pulse" />
            Content Studio
          </div>

          <span className="text-orange-900/40 font-light text-xl">/</span>

          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-orange-600" />
            <span className="text-[#3C1E0A] font-black text-sm uppercase tracking-widest">
              Editor Workspace
            </span>
          </div>
          <span className="text-orange-900/40 font-light text-xl">
  /
</span>


<div className="hidden md:block ml-2">
  <h2 className="text-sm font-black text-[#3C1E0A]">
    {pageInfo.title}
  </h2>

  <p className="text-[10px] font-bold text-orange-600/75">
    {pageInfo.description}
  </p>
</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3.5 pl-4 border-l border-orange-500/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
          <UserCircle2 size={24} className="text-white" />
        </div>

        <div className="text-left">
          <h3 className="font-black text-sm text-[#3C1E0A] tracking-tight">
            Content Editor
          </h3>

          <p className="text-[10px] font-bold text-orange-600/75 uppercase tracking-widest">
            Course Manager
          </p>
        </div>

        <ChevronDown size={14} className="text-orange-900/50" />
      </div>
    </header>
  );
}