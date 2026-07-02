"use client";

import { useEffect, useState } from "react";
import EditorLayout from "../layouts/EditorLayout";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  ListTree,
  PlusCircle,
  UserCircle,
  KeyRound,
  BookMarked,
  ArrowRight,
  Headphones,
  ClipboardCheck,
  
} from "lucide-react";
import { getEditorCourses } from "../services/editorPanel";
import { getTopics } from "../services/editorPanel";

export default function EditorDashboard() {
  const [stats, setStats] = useState({ courses: 0, topics: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, tRes] = await Promise.allSettled([getEditorCourses(), getTopics()]);
        const courses = cRes.status === "fulfilled" ? (cRes.value.data?.data || cRes.value.data || []) : [];
        const topics  = tRes.status === "fulfilled" ? (tRes.value.data?.data  || tRes.value.data  || []) : [];
        setStats({
          courses: Array.isArray(courses) ? courses.length : 0,
          topics:  Array.isArray(topics)  ? topics.length  : 0,
        });
      } catch { /* non-blocking */ } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  //   <div className="bg-white border border-orange-500/15 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:shadow-orange-200/30 transition-all duration-300 flex items-center gap-4">
  //     <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
  //       <Icon size={20} />
  //     </div>
  //     <div>
  //       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
  //       <p className="text-2xl font-black text-slate-950 mt-0.5">{loading ? "—" : value}</p>
  //       {sub && <p className="text-xs text-orange-600 font-medium mt-0.5">{sub}</p>}
  //     </div>
  //   </div>
  // );

const CreateCard = ({ href, icon: Icon, title, description }) => (
  <Link
    href={href}
    className="group flex items-center justify-between rounded-[28px] border border-orange-200 bg-gradient-to-br from-white via-[#FFF8F4] to-orange-50/70 p-6 shadow-md shadow-orange-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-200/40"
  >
    <div className="flex items-center gap-5">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-200 via-orange-100 to-amber-50 border border-orange-100 transition-all duration-300 group-hover:scale-105">
        <Icon
          size={28}
          className="text-[#3C1E0A]"
        />
      </div>

      <div>
        <h3 className="text-lg font-black text-[#3C1E0A]">
          {title}
        </h3>

        <p className="mt-1 text-sm text-[#8A6B58]">
          {description}
        </p>
      </div>
    </div>

    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-200 bg-[#FFF2E8] text-[#3C1E0A] transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500">
      <ArrowRight size={18} />
    </div>
  </Link>
);
  return (
    <EditorLayout>
      <div className="space-y-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-orange-500/5 to-amber-500/5 p-6 rounded-3xl border border-orange-500/10">

  <div>
    <h1 className="text-3xl font-black text-[#3C1E0A]">
      Welcome back, Editor 👋
    </h1>

    <p className="text-sm text-orange-950/70 font-semibold mt-1">
      What would you like to create today?
    </p>
  </div>

  <div className="bg-white border border-orange-500/20 px-4 py-2 rounded-2xl text-xs font-black text-[#3C1E0A]">
    📅 {new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}
  </div>

</div>

  {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

  <StatCard
    icon={BookOpen}
    label="Courses"
    value={stats.courses}
    sub="Published Courses"
    color="from-orange-400 to-amber-400 text-[#3C1E0A]"
  />

  <StatCard
    icon={ListTree}
    label="Topics"
    value={stats.topics}
    sub="Available Topics"
    color="from-amber-400 to-yellow-400 text-[#3C1E0A]"
  />

  <StatCard
    icon={FolderOpen}
    label="SubTopics"
    value="126"
    sub="Learning Sections"
    color="from-orange-500 to-orange-400 text-[#3C1E0A]"
  />

  <StatCard
    icon={BookMarked}
    label="Vocabulary"
    value="520"
    sub="Vocabulary Words"
    color="from-yellow-400 to-orange-400 text-[#3C1E0A]"
  />

</div> */}
<div className="rounded-[32px] border border-orange-200 bg-[#FFFDFC] p-8 shadow-lg shadow-orange-100/40">
{/* <div className="mb-8 flex items-center justify-between"> */}

  {/* <div>
    <h2 className="text-3xl font-black text-[#3C1E0A]">
      Create Learning Content
    </h2>

    <p className="mt-2 text-[#8A6B58]">
      Choose what you'd like to create.
    </p>
  </div>

  <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-600">
    CONTENT CREATION
  </div> */}

{/* </div> */}

 

  <div className="grid gap-4 md:grid-cols-2">
    <CreateCard
      href="/editor/courses/new"
      icon={BookOpen}
      title="Course"
      description="Create a new learning course"
    />

    <CreateCard
      href="/editor/curriculum"
      icon={ListTree}
      title="Topic"
      description="Add a new topic"
    />

    <CreateCard
      href="/editor/curriculum?tab=subtopics"
      icon={FolderOpen}
      title="SubTopic"
      description="Create learning sections"
    />

    <CreateCard
      href="/editor/modules/text"
      icon={BookMarked}
      title="Text Modules"
      description="Write learning content"
    />

    <CreateCard
      href="/editor/modules/video"
      icon={BookOpen}
      title="Video Modules"
      description="Add video lessons"
    />

    <CreateCard
      href="/editor/modules/vocabulary"
      icon={PlusCircle}
      title="Vocabulary Modules"
      description="Create vocabulary sets"
    />
    <CreateCard
  href="/editor/modules/audio"
  icon={Headphones}
  title="Audio Modules"
  description="Create audio lessons"
/>
<CreateCard
  href="/editor/modules/exercise"
  icon={ClipboardCheck}
  title="Exercise Modules"
  description="Create practice exercises"
/>

  </div>

</div>
</div>
</EditorLayout>
  );
}
