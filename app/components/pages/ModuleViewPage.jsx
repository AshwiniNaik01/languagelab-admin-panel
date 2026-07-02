"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../layouts/EditorLayout";
import Breadcrumb from "../ui/Breadcrumb";
import {
  ArrowLeft, Pencil, Video, Music, FileText, Dumbbell, BookMarked,
  Hash, Clock, BarChart2, BookOpen,
} from "lucide-react";
import { getModule } from "../../services/editorPanel";

const TYPE_META = {
  text:       { label: "Text Module",       Icon: FileText,   color: "from-blue-500 to-blue-600",     light: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  video:      { label: "Video Module",      Icon: Video,      color: "from-purple-500 to-purple-600", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  audio:      { label: "Audio Module",      Icon: Music,      color: "from-teal-500 to-teal-600",     light: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200"   },
  exercise:   { label: "Exercise Module",   Icon: Dumbbell,   color: "from-amber-500 to-amber-600",   light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  vocabulary: { label: "Vocabulary Module", Icon: BookMarked, color: "from-pink-500 to-pink-600",     light: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200"   },
};

function InfoCard({ icon: Icon, label, value, colorClass = "bg-orange-50", iconColor = "text-orange-500", borderColor = "border-orange-200" }) {
  return (
    <div className={`bg-white border ${borderColor} rounded-2xl p-5 shadow-sm flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={iconColor} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{label}</p>
        <p className="font-black text-slate-950 mt-0.5">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-orange-500/10">
        <p className="font-black text-slate-950">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function RichHtml({ html }) {
  if (!html) return <p className="text-slate-400 text-sm italic">No content</p>;
  return (
    <div
      className="text-sm text-slate-700 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function ModuleViewPage({ type }) {
  const { id } = useParams();
  const router = useRouter();
  const meta = TYPE_META[type];

  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModule(type, id)
      .then((r) => setMod(r.data?.data || r.data))
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Failed to load module", text: err?.response?.data?.message || err.message });
        router.push(`/editor/modules/${type}`);
      })
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) {
    return (
      <EditorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
        </div>
      </EditorLayout>
    );
  }

  if (!mod) return null;

  const { Icon } = meta;

  return (
    <EditorLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Modules", href: `/editor/modules/${type}` },
          { label: meta.label, href: `/editor/modules/${type}` },
          { label: mod.title },
        ]} />

        {/* Header */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push(`/editor/modules/${type}`)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>

          <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${meta.color} flex items-center justify-center shrink-0 shadow-sm`}>
            <Icon size={26} className="text-white" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-slate-950">{mod.title}</h2>
              <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-full border capitalize ${meta.light} ${meta.text} ${meta.border}`}>
                {meta.label}
              </span>
            </div>
            {mod.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{mod.description}</p>
            )}
          </div>

          <button
            onClick={() => router.push(`/editor/modules/${type}/new?id=${id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-colors shadow-sm shrink-0"
          >
            <Pencil size={14} strokeWidth={2.5} /> Edit Module
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoCard icon={Hash}     label="Order"        value={`#${mod.order ?? "—"}`} />
          <InfoCard icon={BarChart2} label="Max Attempts" value={mod.max_attempts} colorClass="bg-amber-50" iconColor="text-amber-500" borderColor="border-amber-200" />
          <InfoCard icon={Clock}    label="Time Limit"   value={mod.time_limit_sec ? `${mod.time_limit_sec}s` : "—"} colorClass="bg-teal-50" iconColor="text-teal-500" borderColor="border-teal-200" />
          <InfoCard icon={BookOpen} label="Total Marks"  value={mod.total_marks > 0 ? mod.total_marks : "—"} colorClass="bg-purple-50" iconColor="text-purple-500" borderColor="border-purple-200" />
        </div>

        {/* Details card */}
        <div className="bg-white border border-orange-500/20 rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] text-orange-950/50 uppercase tracking-widest font-black mb-4">Module Details</p>
          <div className="grid grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Title</p>
              <p className="font-bold text-slate-800">{mod.title}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Type</p>
              <p className={`font-bold capitalize ${meta.text}`}>{meta.label}</p>
            </div>
            {mod.description && (
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Description</p>
                <p className="font-semibold text-slate-700">{mod.description}</p>
              </div>
            )}

            {/* ── Text specific ── */}
            {mod.content && <>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">CEFR Level</p>
                <p className="font-bold text-slate-800">{mod.content.level || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Word Count</p>
                <p className="font-bold text-slate-800">{mod.content.word_count ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Read Time (min)</p>
                <p className="font-bold text-slate-800">{mod.content.read_time_min ?? "—"}</p>
              </div>
              {mod.content.source && <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Source</p>
                <p className="font-bold text-slate-800">{mod.content.source}</p>
              </div>}
            </>}

            {/* ── Video specific ── */}
            {mod.video && <>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Format</p>
                <p className="font-bold text-slate-800">{mod.video.format?.toUpperCase() || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Duration</p>
                <p className="font-bold text-slate-800">{mod.video.duration_sec ? `${mod.video.duration_sec}s` : "—"}</p>
              </div>
            </>}

            {/* ── Audio specific ── */}
            {mod.audio && <>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Audio Type</p>
                <p className="font-bold text-slate-800">{mod.audio.type?.toUpperCase() || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Speed</p>
                <p className="font-bold text-slate-800 capitalize">{mod.audio.speed || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Allow Replay</p>
                <p className="font-bold text-slate-800">{mod.allow_replay ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Replay Limit</p>
                <p className="font-bold text-slate-800">{mod.replay_limit ?? "—"}</p>
              </div>
            </>}

            {/* ── Exercise specific ── */}
            {mod.exercise_type && <>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Exercise Type</p>
                <p className="font-bold text-slate-800 capitalize">{mod.exercise_type?.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Difficulty</p>
                <p className="font-bold text-slate-800 capitalize">{mod.difficulty || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Shuffle Questions</p>
                <p className="font-bold text-slate-800">{mod.shuffle_questions ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Show Explanation</p>
                <p className="font-bold text-slate-800">{mod.show_explanation ? "Yes" : "No"}</p>
              </div>
            </>}
          </div>
        </div>

        {/* ── Text content body ── */}
        {mod.content?.body && (
          <Section title="Content Body">
            <RichHtml html={mod.content.body} />
          </Section>
        )}

        {/* ── Video player ── */}
        {mod.video?.url && (
          <Section title="Video">
            <video controls className="w-full rounded-xl max-h-72 bg-black" src={mod.video.url} />
            {mod.video.transcript && (
              <div className="mt-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">Transcript</p>
                <RichHtml html={mod.video.transcript} />
              </div>
            )}
          </Section>
        )}

        {/* ── Audio player ── */}
        {mod.audio?.url && (
          <Section title="Audio">
            <audio controls className="w-full" src={mod.audio.url} />
            {mod.audio.transcript && (
              <div className="mt-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">Transcript</p>
                <RichHtml html={mod.audio.transcript} />
              </div>
            )}
          </Section>
        )}

        {/* ── Words ── */}
        {mod.words?.length > 0 && (
          <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-500/10 flex items-center justify-between">
              <p className="font-black text-slate-950">Words</p>
              <span className="text-xs font-bold text-orange-600">{mod.words.length} words</span>
            </div>
            <div className="divide-y divide-orange-500/5">
              {mod.words.map((w, i) => (
                <div key={i} className="px-6 py-3 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-black text-orange-700 text-sm shrink-0">{i + 1}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-sm">{w.word}</span>
                      {w.pronunciation && <span className="text-[10px] text-slate-400">/{w.pronunciation}/</span>}
                      {w.part_of_speech && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-semibold">{w.part_of_speech}</span>}
                      {w.difficulty && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold capitalize">{w.difficulty}</span>}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{w.meaning}</p>
                    {w.example && <p className="text-[11px] text-slate-400 italic mt-0.5">"{w.example}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Questions ── */}
        {mod.questions?.length > 0 && (
          <div className="bg-white border border-orange-500/20 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-orange-500/10 flex items-center justify-between">
              <p className="font-black text-slate-950">Questions</p>
              <span className="text-xs font-bold text-orange-600">{mod.questions.length} questions</span>
            </div>
            <div className="divide-y divide-orange-500/5">
              {mod.questions.map((q, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Q{i + 1}</span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{q.question_type?.replace(/_/g, " ")}</span>
                    {q.marks && <span className="text-[9px] text-slate-400 font-semibold ml-auto">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{q.question_text}</p>
                  {q.question_type === "mcq" && q.options?.some((o) => o) && (
                    <div className="mt-1.5 space-y-0.5">
                      {q.options.map((o, oi) => {
                        const isLetter = /^[A-Da-d]$/.test(q.correct_answer?.trim());
                        const correctByLetter = isLetter && oi === q.correct_answer.toUpperCase().charCodeAt(0) - 65;
                        const correctByText   = o === q.correct_answer;
                        return (
                          <p key={oi} className={`text-xs px-2 py-1 rounded ${correctByLetter || correctByText ? "bg-green-100 text-green-700 font-bold" : "text-slate-500"}`}>
                            {String.fromCharCode(65 + oi)}. {o}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-[11px] text-green-600 font-semibold mt-1">
                    {q.question_type === "mcq" && /^[A-Da-d]$/.test(q.correct_answer?.trim())
                      ? `✓ ${q.correct_answer.toUpperCase()}. ${q.options?.[q.correct_answer.toUpperCase().charCodeAt(0) - 65] || ""}`
                      : `✓ ${q.correct_answer}`
                    }
                  </p>
                  {q.explanation && <p className="text-[11px] text-slate-400 mt-0.5"><span className="font-semibold">Explanation:</span> {q.explanation}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
