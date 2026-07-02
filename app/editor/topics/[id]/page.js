"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../layouts/EditorLayout";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { ArrowLeft, BookMarked, AlignLeft, ListOrdered, ListTree, Pencil } from "lucide-react";
import { getTopic, getSubTopics } from "../../../services/editorPanel";

export default function TopicViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [topic, setTopic] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    getTopic(id)
      .then((res) => setTopic(res.data?.data || res.data))
      .catch((err) =>
        Swal.fire({ icon: "error", title: "Failed to load topic", text: err?.response?.data?.message || err.message })
      )
      .finally(() => setLoading(false));

    getSubTopics(id)
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setSubtopics(Array.isArray(list) ? list : []);
      })
      .catch(() => setSubtopics([]))
      .finally(() => setSubLoading(false));
  }, [id]);

  if (loading) {
    return (
      <EditorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
        </div>
      </EditorLayout>
    );
  }

  if (!topic) {
    return (
      <EditorLayout>
        <div className="text-center py-20 text-slate-400 font-semibold">
          Topic not found.
          <br />
          <button
            onClick={() => router.push("/editor/curriculum?tab=topics")}
            className="mt-4 text-orange-500 font-bold hover:underline"
          >
            ← Back to Topics
          </button>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/editor/curriculum?tab=topics" },
            { label: topic.title },
          ]}
        />

        {/* Page header */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push("/editor/curriculum?tab=topics")}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center shrink-0 shadow-sm">
            <BookMarked size={26} className="text-white" strokeWidth={2} />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-950">{topic.title}</h2>
            <p className="text-sm text-orange-600 font-bold mt-0.5">Order #{topic.order ?? "—"}</p>
          </div>

          <button
            onClick={() => router.push(`/editor/topics/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-colors shadow-sm"
          >
            <Pencil size={14} strokeWidth={2.5} />
            Edit Topic
          </button>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Info card */}
          <div className="lg:col-span-2 bg-white border border-orange-500/20 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black mb-4">
              Topic Details
            </p>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Title</p>
                <p className="font-bold text-slate-800">{topic.title}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Description</p>
                <p className="font-semibold text-slate-700 leading-relaxed">{topic.description || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Order</p>
                <p className="font-bold text-slate-800">#{topic.order ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <ListOrdered size={20} className="text-orange-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Order</p>
                <p className="text-2xl font-black text-slate-950">#{topic.order ?? "—"}</p>
              </div>
            </div>

            <div className="bg-white border border-teal-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <ListTree size={20} className="text-teal-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">SubTopics</p>
                <p className="text-2xl font-black text-teal-700">{subtopics.length}</p>
              </div>
            </div>

            <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <AlignLeft size={20} className="text-orange-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Has Description</p>
                <p className="text-sm font-black text-slate-950 mt-0.5">{topic.description ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SubTopics section */}
        <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-500/10 flex items-center justify-between">
            <p className="font-black text-slate-950">SubTopics</p>
            <span className="text-xs font-bold text-orange-600">
              {subtopics.length} subtopic{subtopics.length !== 1 ? "s" : ""}
            </span>
          </div>

          {subLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-orange-500 border-r-2" />
            </div>
          ) : subtopics.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">
              No subtopics added yet.
            </div>
          ) : (
            <div className="divide-y divide-orange-500/5">
              <div className="grid grid-cols-[3rem_1fr_1fr] gap-4 px-6 py-3 bg-orange-50/60 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <span>Order</span>
                <span>Title</span>
                <span>Description</span>
              </div>
              {[...subtopics]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((sub) => (
                  <div
                    key={sub._id}
                    className="grid grid-cols-[3rem_1fr_1fr] gap-4 px-6 py-4 items-center hover:bg-orange-50/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center font-black text-teal-700 text-sm">
                      {sub.order ?? "—"}
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{sub.title}</p>
                    <p className="text-xs text-slate-500 truncate">{sub.description || "—"}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </EditorLayout>
  );
}
