"use client";

import { useEffect, useState } from "react";
import EditorLayout from "../layouts/EditorLayout";
import Link from "next/link";
import { BookOpen, FolderOpen, ListTree, PlusCircle } from "lucide-react";
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

  const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-950 mt-0.5">{loading ? "—" : value}</p>
        {sub && <p className="text-xs text-orange-500 font-semibold mt-0.5">{sub}</p>}
      </div>
    </div>
  );

  const QuickLink = ({ href, icon: Icon, label, desc }) => (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-2xl border border-orange-100 hover:bg-orange-50/60 hover:border-orange-300 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-black text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </Link>
  );

  return (
    <EditorLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-950">Dashboard</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Welcome back. Manage your courses, topics and subtopics from here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={BookOpen}  label="My Courses" value={stats.courses} sub="via /editor/course" color="bg-orange-100 text-orange-600" />
          <StatCard icon={ListTree}  label="My Topics"  value={stats.topics}  sub="via /topic"         color="bg-teal-100 text-teal-600" />
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-black text-[#3C1E0A] border-b border-orange-100 pb-3 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink href="/editor/courses"     icon={BookOpen}   label="Manage Courses"      desc="View, edit & delete courses" />
            <QuickLink href="/editor/courses/new" icon={PlusCircle} label="Add New Course"      desc="Create a new course template" />
            <QuickLink href="/editor/curriculum"  icon={ListTree}   label="Topics & SubTopics"  desc="Manage topics and subtopics" />
            <QuickLink href="/editor/profile"     icon={FolderOpen} label="My Profile"          desc="Update profile & password" />
          </div>
        </div>

      </div>
    </EditorLayout>
  );
}
