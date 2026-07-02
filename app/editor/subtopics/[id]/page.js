"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../../layouts/EditorLayout";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { ArrowLeft, BookMarked, AlignLeft, ListOrdered, Layers, Pencil } from "lucide-react";
import { getSubTopic, getTopic } from "../../../services/editorPanel";

export default function SubTopicViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [subtopic, setSubtopic] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubTopic(id)
      .then(async (res) => {
        const sub = res.data?.data || res.data;
        setSubtopic(sub);
        if (sub?.topic_id) {
          getTopic(sub.topic_id)
            .then((r) => setTopic(r.data?.data || r.data))
            .catch(() => {});
        }
      })
      .catch((err) =>
        Swal.fire({ icon: "error", title: "Failed to load subtopic", text: err?.response?.data?.message || err.message })
      )
      .finally(() => setLoading(false));
  }, [id]);

  const backUrl = subtopic?.topic_id
    ? `/editor/curriculum?tab=subtopics&topic_id=${subtopic.topic_id}`
    : "/editor/curriculum?tab=subtopics";

  if (loading) {
    return (
      <EditorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
        </div>
      </EditorLayout>
    );
  }

  if (!subtopic) {
    return (
      <EditorLayout>
        <div className="text-center py-20 text-slate-400 font-semibold">
          SubTopic not found.
          <br />
          <button
            onClick={() => router.push("/editor/curriculum?tab=subtopics")}
            className="mt-4 text-orange-500 font-bold hover:underline"
          >
            ← Back to SubTopics
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
            { label: topic?.title || "Topic", href: `/editor/topics/${subtopic.topic_id}` },
            { label: subtopic.title },
          ]}
        />

        {/* Page header */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push(backUrl)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
            <Layers size={26} className="text-white" strokeWidth={2} />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-950">{subtopic.title}</h2>
            {topic && (
              <p className="text-sm text-orange-600 font-bold mt-0.5">
                Topic: {topic.title}
              </p>
            )}
          </div>

          <button
            onClick={() => router.push(`/editor/subtopics/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-colors shadow-sm"
          >
            <Pencil size={14} strokeWidth={2.5} />
            Edit SubTopic
          </button>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Info card */}
          <div className="lg:col-span-2 bg-white border border-orange-500/20 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black mb-4">
              SubTopic Details
            </p>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Title</p>
                <p className="font-bold text-slate-800">{subtopic.title}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Description</p>
                <p className="font-semibold text-slate-700 leading-relaxed">{subtopic.description || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Order</p>
                <p className="font-bold text-slate-800">#{subtopic.order ?? "—"}</p>
              </div>
              {topic && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Parent Topic</p>
                  <button
                    onClick={() => router.push(`/editor/topics/${subtopic.topic_id}`)}
                    className="font-bold text-orange-600 hover:underline text-sm"
                  >
                    {topic.title}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-teal-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <ListOrdered size={20} className="text-teal-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Order</p>
                <p className="text-2xl font-black text-slate-950">#{subtopic.order ?? "—"}</p>
              </div>
            </div>

            <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <BookMarked size={20} className="text-orange-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Parent Topic</p>
                <p className="text-sm font-black text-slate-950 mt-0.5 truncate max-w-[120px]">
                  {topic?.title || "—"}
                </p>
              </div>
            </div>

            <div className="bg-white border border-orange-500/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <AlignLeft size={20} className="text-orange-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Has Description</p>
                <p className="text-sm font-black text-slate-950 mt-0.5">{subtopic.description ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditorLayout>
  );
}
