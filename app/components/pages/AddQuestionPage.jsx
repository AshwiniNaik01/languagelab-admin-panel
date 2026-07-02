"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../layouts/EditorLayout";
import Breadcrumb from "../ui/Breadcrumb";
import Button from "../ui/Button";
import { ArrowLeft, Plus, Trash2, X, FileText, Dumbbell, BookMarked, Video, Music } from "lucide-react";
import { getModule, updateModule } from "../../services/editorPanel";
import RichTextEditor from "../form/shared/RichTextEditor";

const TYPE_META = {
  text:       { label: "Text Module",       Icon: FileText,   color: "from-blue-500 to-blue-600",     light: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  video:      { label: "Video Module",      Icon: Video,      color: "from-purple-500 to-purple-600", light: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  audio:      { label: "Audio Module",      Icon: Music,      color: "from-teal-500 to-teal-600",     light: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200"   },
  exercise:   { label: "Exercise Module",   Icon: Dumbbell,   color: "from-amber-500 to-amber-600",   light: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  vocabulary: { label: "Vocabulary Module", Icon: BookMarked, color: "from-pink-500 to-pink-600",     light: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200"   },
};

const ALL_Q_TYPES = ["mcq", "fill_blank", "true_false", "short_answer", "match", "reorder", "match_meaning", "spell_word"];

const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 transition-all";

function buildUpdatePayload(type, mod, newQuestions) {
  const topic_id    = mod.topic_id?._id    || mod.topic_id;
  const sub_topic_id = mod.sub_topic_id?._id || mod.sub_topic_id;
  const questions   = [...(mod.questions || []), ...newQuestions];

  if (type === "text") return {
    topic_id, sub_topic_id,
    title: mod.title, order: mod.order ?? 0,
    ...(mod.description && { description: mod.description }),
    content: {
      body: mod.content?.body, level: mod.content?.level,
      ...(mod.content?.word_count  != null && { word_count:    mod.content.word_count }),
      ...(mod.content?.read_time_min != null && { read_time_min: mod.content.read_time_min }),
      ...(mod.content?.source && { source: mod.content.source }),
    },
    ...(mod.total_marks    != null && { total_marks:    mod.total_marks }),
    ...(mod.time_limit_sec != null && { time_limit_sec: mod.time_limit_sec }),
    max_attempts: mod.max_attempts ?? 3,
    questions,
  };

  if (type === "exercise") return {
    topic_id, sub_topic_id,
    title: mod.title, order: mod.order ?? 1,
    exercise_type:     mod.exercise_type,
    difficulty:        mod.difficulty,
    max_attempts:      mod.max_attempts ?? 5,
    shuffle_questions: mod.shuffle_questions ?? true,
    shuffle_options:   mod.shuffle_options   ?? true,
    show_explanation:  mod.show_explanation  ?? true,
    ...(mod.total_marks    && { total_marks:    mod.total_marks }),
    ...(mod.time_limit_sec && { time_limit_sec: mod.time_limit_sec }),
    questions,
  };

  if (type === "vocabulary") return {
    topic_id, sub_topic_id,
    title: mod.title, order: mod.order ?? 1,
    max_attempts: mod.max_attempts ?? 5,
    ...(mod.description    && { description:    mod.description }),
    ...(mod.total_marks    != null && { total_marks:    mod.total_marks }),
    ...(mod.time_limit_sec != null && { time_limit_sec: mod.time_limit_sec }),
    words: mod.words || [],
    questions,
  };

  if (type === "video") return {
    topic_id, sub_topic_id,
    title: mod.title, order: mod.order ?? 1,
    ...(mod.video && { video: mod.video }),
    ...(mod.words?.length && { words: mod.words }),
    questions,
  };

  if (type === "audio") return {
    topic_id, sub_topic_id,
    title: mod.title, order: mod.order ?? 1,
    allow_replay: mod.allow_replay,
    replay_limit: mod.replay_limit,
    ...(mod.audio && { audio: mod.audio }),
    ...(mod.words?.length && { words: mod.words }),
    questions,
  };

  return null;
}

export default function AddQuestionPage({ type }) {
  const { id } = useParams();
  const router  = useRouter();
  const meta    = TYPE_META[type];
  const qtypes  = ALL_Q_TYPES;

  const [mod,     setMod]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const blankQuestion = () => ({
    question_text:  "",
    question_type:  qtypes[0],
    options:        ["", ""],
    correct_answer: "",
    explanation:    "",
    hint:           "",
    marks:          1,
    negative_marks: 0,
  });

  const [questions, setQuestions] = useState([blankQuestion()]);

  useEffect(() => {
    getModule(type, id)
      .then((r) => setMod(r.data?.data || r.data))
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Failed to load module", text: err?.response?.data?.message || err.message });
        router.push(`/editor/modules/${type}/${id}`);
      })
      .finally(() => setLoading(false));
  }, [id, type]);

  /* ── question helpers ── */
  const addQ   = () => setQuestions((p) => [...p, blankQuestion()]);
  const removeQ = (i) => setQuestions((p) => p.filter((_, idx) => idx !== i));
  const updQ   = (i, k, v) => setQuestions((p) => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const addOpt  = (qi) => setQuestions((p) => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const removeOpt = (qi, oi) => setQuestions((p) => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));
  const updOpt  = (qi, oi, v) => setQuestions((p) => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = questions.filter((q) => q.question_text.trim() && q.correct_answer.trim());
    if (!valid.length) {
      Swal.fire({ icon: "warning", title: "Add at least one complete question" });
      return;
    }
    setSaving(true);
    try {
      const payload = buildUpdatePayload(type, mod, valid);
      await updateModule(type, id, payload);
      Swal.fire({ icon: "success", title: `${valid.length} Question${valid.length > 1 ? "s" : ""} Added`, timer: 1200, showConfirmButton: false });
      router.push(`/editor/modules/${type}/${id}`);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EditorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2" />
        </div>
      </EditorLayout>
    );
  }

  const { Icon } = meta;

  return (
    <EditorLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Modules",      href: `/editor/modules/${type}` },
          { label: mod?.title,     href: `/editor/modules/${type}/${id}` },
          { label: "Add Question" },
        ]} />

        {/* Header */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push(`/editor/modules/${type}/${id}`)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>

          <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${meta.color} flex items-center justify-center shrink-0 shadow-sm`}>
            <Icon size={22} className="text-white" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-950">Add Question</h2>
            <p className="text-sm text-orange-600 font-bold mt-0.5">{mod?.title}</p>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
            <div className="flex items-center justify-between border-b border-orange-500/10 pb-4">
              <h3 className="text-xl font-black text-[#3C1E0A]">Questions</h3>
              <button
                type="button"
                onClick={addQ}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-sm font-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
              >
                <Plus size={14} strokeWidth={2.5} /> Add Question
              </button>
            </div>

            {questions.map((q, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                {/* Question header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                    Question {i + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQ(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Question text */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Question Text <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    className={`${inp} resize-none`}
                    rows={2}
                    placeholder="Enter your question here…"
                    value={q.question_text}
                    onChange={(e) => updQ(i, "question_text", e.target.value)}
                  />
                </div>

                {/* Type + Marks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Question Type</label>
                    <select
                      className={`${inp} cursor-pointer`}
                      value={q.question_type}
                      onChange={(e) => updQ(i, "question_type", e.target.value)}
                    >
                      {qtypes.map((t) => (
                        <option key={t} value={t}>{t.replace(/_/g, " ").toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Marks</label>
                    <input
                      type="number"
                      min={0}
                      className={inp}
                      value={q.marks}
                      onChange={(e) => updQ(i, "marks", +e.target.value)}
                    />
                  </div>
                </div>

                {/* MCQ Options */}
                {q.question_type === "mcq" && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {q.options.map((o, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 w-5 shrink-0">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          <input
                            className={inp}
                            placeholder={`Option ${oi + 1}`}
                            value={o}
                            onChange={(e) => updOpt(i, oi, e.target.value)}
                          />
                          {q.options.length > 2 && (
                            <button type="button" onClick={() => removeOpt(i, oi)} className="text-red-400 hover:text-red-600 shrink-0">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addOpt(i)}
                      className="mt-2 text-xs text-orange-600 font-bold hover:underline"
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                {/* Correct answer */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Correct Answer <span className="text-orange-500">*</span>
                  </label>
                  <input
                    className={inp}
                    placeholder="Correct answer"
                    value={q.correct_answer}
                    onChange={(e) => updQ(i, "correct_answer", e.target.value)}
                  />
                </div>

                {/* Hint */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Hint (optional)</label>
                  <input
                    className={inp}
                    placeholder="Give a hint..."
                    value={q.hint || ""}
                    onChange={(e) => updQ(i, "hint", e.target.value)}
                  />
                </div>

                {/* Explanation — CKEditor */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Explanation (optional)
                  </label>
                  <RichTextEditor
                    value={q.explanation || ""}
                    onChange={(val) => updQ(i, "explanation", val)}
                    placeholder="Explain the answer..."
                    minHeight={150}
                  />
                </div>

                {/* Negative marks — exercise only */}
                {type === "exercise" && (
                  <div className="max-w-xs">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Negative Marks</label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      className={inp}
                      value={q.negative_marks || 0}
                      onChange={(e) => updQ(i, "negative_marks", +e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Footer */}
            <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
              <Button type="button" variant="secondary" onClick={() => router.push(`/editor/modules/${type}/${id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : `Save ${questions.length} Question${questions.length > 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </EditorLayout>
  );
}
