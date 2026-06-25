"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../layouts/EditorLayout";
import ScrollableTable from "../Table";
import { ActionButton } from "../ui/ActionIconButton";
import Button from "../ui/Button";
import {
  getTopics, getSubTopics, getModules, deleteModule,
  createTextModule, createExerciseModule, createVocabularyModule,
  createVideoModule, createAudioModule,
} from "../../services/editorPanel";
import {
  Video, Music, FileText, Dumbbell, BookMarked,
  Plus, X, Check, ChevronDown,
} from "lucide-react";

const TYPE_META = {
  text:       { label: "Text",       icon: FileText,   color: "bg-blue-500",   light: "bg-blue-50",   text: "text-blue-700"   },
  video:      { label: "Video",      icon: Video,      color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-700" },
  audio:      { label: "Audio",      icon: Music,      color: "bg-teal-500",   light: "bg-teal-50",   text: "text-teal-700"   },
  exercise:   { label: "Exercise",   icon: Dumbbell,   color: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-700"  },
  vocabulary: { label: "Vocabulary", icon: BookMarked, color: "bg-pink-500",   light: "bg-pink-50",   text: "text-pink-700"   },
};

const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 transition-all";

/* ── Per-type create forms ───────────────────────────────────────────────── */
function TextForm({ topicId, subtopicId, onDone, onCancel }) {
  const [f, setF] = useState({ title: "", order: 1, body: "", level: "" });
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.title || !f.body) { Swal.fire({ icon: "warning", title: "Title and body required" }); return; }
    setSaving(true);
    try { await createTextModule({ topic_id: topicId, sub_topic_id: subtopicId, title: f.title, order: +f.order || 1, content: { body: f.body, level: f.level || "B1" } }); onDone(); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} placeholder="Module title" value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Level</label><input className={inp} placeholder="B1" value={f.level} onChange={e => setF(p => ({ ...p, level: e.target.value }))} /></div>
      </div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1">Content Body *</label><textarea className={`${inp} resize-none`} rows={4} placeholder="Write content here…" value={f.body} onChange={e => setF(p => ({ ...p, body: e.target.value }))} /></div>
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function VideoForm({ topicId, subtopicId, onDone, onCancel }) {
  const [title, setTitle] = useState(""); const [order, setOrder] = useState(1); const [file, setFile] = useState(null); const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!title || !file) { Swal.fire({ icon: "warning", title: "Title and video file required" }); return; }
    setSaving(true);
    try { const fd = new FormData(); fd.append("topic_id", topicId); fd.append("sub_topic_id", subtopicId); fd.append("title", title); fd.append("order", order); fd.append("videoFile", file); await createVideoModule(fd); onDone(); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} placeholder="Video title" value={title} onChange={e => setTitle(e.target.value)} /></div><div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={order} onChange={e => setOrder(e.target.value)} /></div></div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1">Video File * (.mp4, .webm)</label><input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 border border-slate-300 rounded-xl px-3 py-2" /></div>
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function AudioForm({ topicId, subtopicId, onDone, onCancel }) {
  const [title, setTitle] = useState(""); const [order, setOrder] = useState(1); const [file, setFile] = useState(null); const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!title || !file) { Swal.fire({ icon: "warning", title: "Title and audio file required" }); return; }
    setSaving(true);
    try { const fd = new FormData(); fd.append("topic_id", topicId); fd.append("sub_topic_id", subtopicId); fd.append("title", title); fd.append("order", order); fd.append("audioFile", file); await createAudioModule(fd); onDone(); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} placeholder="Audio title" value={title} onChange={e => setTitle(e.target.value)} /></div><div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={order} onChange={e => setOrder(e.target.value)} /></div></div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1">Audio File * (.mp3, .wav)</label><input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 border border-slate-300 rounded-xl px-3 py-2" /></div>
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function ExerciseForm({ topicId, subtopicId, onDone, onCancel }) {
  const [f, setF] = useState({ title: "", order: 1, exercise_type: "mcq", difficulty: "medium" });
  const [questions, setQ] = useState([{ question_text: "", options: ["", ""], correct_answer: "", marks: 1 }]);
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.title) { Swal.fire({ icon: "warning", title: "Title required" }); return; }
    setSaving(true);
    try { await createExerciseModule({ topic_id: topicId, sub_topic_id: subtopicId, title: f.title, order: +f.order || 1, exercise_type: f.exercise_type, difficulty: f.difficulty, shuffle_questions: true, max_attempts: 5, questions }); onDone(); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3 max-h-60 overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="Quiz title" /></div><div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Type</label><select className={`${inp} cursor-pointer`} value={f.exercise_type} onChange={e => setF(p => ({ ...p, exercise_type: e.target.value }))}>{["mcq","fill_blank","true_false"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label><select className={`${inp} cursor-pointer`} value={f.difficulty} onChange={e => setF(p => ({ ...p, difficulty: e.target.value }))}>{["easy","medium","hard"].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
      </div>
      <div className="border-t border-slate-200 pt-3">
        <div className="flex justify-between mb-2"><p className="text-xs font-bold text-slate-600">Questions</p><button type="button" onClick={() => setQ(p => [...p, { question_text: "", options: ["",""], correct_answer: "", marks: 1 }])} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add</button></div>
        {questions.map((q, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 space-y-2">
            <input className={inp} placeholder={`Question ${i+1}`} value={q.question_text} onChange={e => setQ(p => p.map((q2,idx) => idx===i ? {...q2, question_text: e.target.value} : q2))} />
            {q.options.map((o, oi) => <input key={oi} className={inp} placeholder={`Option ${oi+1}`} value={o} onChange={e => setQ(p => p.map((q2,idx) => idx===i ? {...q2, options: q2.options.map((op,opidx) => opidx===oi ? e.target.value : op)} : q2))} />)}
            <input className={inp} placeholder="Correct answer" value={q.correct_answer} onChange={e => setQ(p => p.map((q2,idx) => idx===i ? {...q2, correct_answer: e.target.value} : q2))} />
          </div>
        ))}
      </div>
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function VocabForm({ topicId, subtopicId, onDone, onCancel }) {
  const [f, setF] = useState({ title: "", order: 1 });
  const [words, setW] = useState([{ word: "", meaning: "", example: "" }]);
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.title || words.some(w => !w.word || !w.meaning)) { Swal.fire({ icon: "warning", title: "Title, word and meaning required" }); return; }
    setSaving(true);
    try { await createVocabularyModule({ topic_id: topicId, sub_topic_id: subtopicId, title: f.title, order: +f.order || 1, max_attempts: 5, words }); onDone(); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3 max-h-60 overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="Vocabulary set title" /></div><div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div></div>
      <div className="border-t border-slate-200 pt-3">
        <div className="flex justify-between mb-2"><p className="text-xs font-bold text-slate-600">Words</p><button type="button" onClick={() => setW(p => [...p, { word: "", meaning: "", example: "" }])} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add</button></div>
        {words.map((w, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 grid grid-cols-3 gap-2">
            <input className={inp} placeholder="Word *" value={w.word} onChange={e => setW(p => p.map((w2,idx) => idx===i ? {...w2, word: e.target.value} : w2))} />
            <input className={inp} placeholder="Meaning *" value={w.meaning} onChange={e => setW(p => p.map((w2,idx) => idx===i ? {...w2, meaning: e.target.value} : w2))} />
            <input className={inp} placeholder="Example" value={w.example} onChange={e => setW(p => p.map((w2,idx) => idx===i ? {...w2, example: e.target.value} : w2))} />
          </div>
        ))}
      </div>
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function FormBtns({ saving, onCancel }) {
  return (
    <div className="flex gap-3 pt-3 border-t border-slate-200">
      <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
        <Check size={15} /> {saving ? "Creating…" : "Create Module"}
      </button>
      <button type="button" onClick={onCancel} className="px-5 py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
    </div>
  );
}

/* ── View Modal ──────────────────────────────────────────────────────────── */
function ViewModal({ mod, meta, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`flex items-center justify-between px-6 py-4 ${meta.color}`}>
          <div className="flex items-center gap-3">
            <meta.icon size={18} className="text-white" />
            <p className="font-black text-white">{mod.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer font-black">✕</button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Order</p>
              <p className="font-bold text-slate-800">#{mod.order ?? "—"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Type</p>
              <p className={`font-bold text-sm capitalize ${meta.text}`}>{meta.label}</p>
            </div>
          </div>
          {mod.content?.body && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Content</p>
              <p className="text-sm text-slate-700 line-clamp-4">{mod.content.body}</p>
            </div>
          )}
          {mod.words?.length > 0 && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Words ({mod.words.length})</p>
              {mod.words.slice(0, 3).map((w, i) => <p key={i} className="text-xs text-slate-700 font-semibold">{w.word} — {w.meaning}</p>)}
              {mod.words.length > 3 && <p className="text-xs text-slate-400 mt-1">+{mod.words.length - 3} more</p>}
            </div>
          )}
          {mod.questions?.length > 0 && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Questions ({mod.questions.length})</p>
              <p className="text-xs text-slate-600 font-semibold">{mod.questions[0]?.question_text}</p>
            </div>
          )}
        </div>
        <div className="px-6 pb-5">
          <Button variant="secondary" onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared page used by each module type ────────────────────────────────── */
export default function ModuleTypePage({ type }) {
  const meta       = TYPE_META[type];
  const searchParams = useSearchParams();

  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingMods, setLoadingMods] = useState(false);
  const [showForm, setShowForm] = useState(searchParams.get("add") === "1");
  const [viewingMod, setViewingMod] = useState(null);

  useEffect(() => {
    setShowForm(searchParams.get("add") === "1");
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try { const r = await getTopics(); setTopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
      catch { } finally { setLoadingTopics(false); }
    })();
  }, []);

  const onTopicChange = async (id) => {
    setSelectedTopic(id); setSelectedSubtopic(""); setModules([]);
    if (!id) { setSubtopics([]); return; }
    try { const r = await getSubTopics(id); setSubtopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
    catch { setSubtopics([]); }
  };

  const onSubtopicChange = async (id) => {
    setSelectedSubtopic(id); setModules([]);
    if (!id) return;
    setLoadingMods(true);
    try { const r = await getModules(type, id); setModules(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
    catch { setModules([]); } finally { setLoadingMods(false); }
  };

  const handleDelete = async (mod) => {
    const r = await Swal.fire({ title: `Delete "${mod.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try { await deleteModule(type, mod._id); setModules(p => p.filter(m => m._id !== mod._id)); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
  };

  const handleCreated = async () => {
    setShowForm(false);
    if (selectedSubtopic) {
      const r = await getModules(type, selectedSubtopic);
      setModules(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
    }
    Swal.fire({ icon: "success", title: "Module Created", timer: 1200, showConfirmButton: false });
  };

  const columns = [
    {
      header: "Module",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${meta.color}`}>
            <meta.icon size={15} />
          </span>
          <div>
            <p className="font-bold text-slate-900 text-sm">{row.title}</p>
            <p className="text-[11px] text-slate-400">Order #{row.order ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: () => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${meta.light} ${meta.text}`}>
          {meta.label}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <ActionButton onView={() => setViewingMod(row)} onDelete={() => handleDelete(row)} />
      ),
    },
  ];

  const Form = { text: TextForm, video: VideoForm, audio: AudioForm, exercise: ExerciseForm, vocabulary: VocabForm }[type];

  return (
    <EditorLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 ${meta.color}`}>
            <meta.icon size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{meta.label} Modules</h2>
            <p className="text-sm text-slate-500">Manage {meta.label.toLowerCase()} content modules.</p>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Topic</label>
            <div className="relative">
              <select className={`${inp} cursor-pointer pr-8`} value={selectedTopic} onChange={e => onTopicChange(e.target.value)}>
                <option value="">— Choose topic —</option>
                {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {loadingTopics && <p className="text-[10px] text-slate-400 mt-1">Loading topics…</p>}
          </div>

          <div className={`bg-white border border-slate-200 rounded-2xl p-4 transition-all ${!selectedTopic ? "opacity-40" : ""}`}>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select SubTopic</label>
            <div className="relative">
              <select className={`${inp} cursor-pointer pr-8`} value={selectedSubtopic} onChange={e => onSubtopicChange(e.target.value)} disabled={!selectedTopic}>
                <option value="">— Choose subtopic —</option>
                {subtopics.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-slate-800">
            {meta.label} Modules
            <span className="ml-2 text-slate-400 font-normal">({modules.length})</span>
          </p>
          <Button onClick={() => setShowForm(true)} disabled={!selectedSubtopic} title={!selectedSubtopic ? "Select a subtopic first" : ""}>
            <Plus size={14} className="mr-1" /> Add {meta.label} Module
          </Button>
        </div>

        {/* Table — always visible */}
        <ScrollableTable
          columns={columns}
          data={modules}
          loading={loadingMods}
          emptyMessage={
            !selectedSubtopic
              ? "Select a topic and subtopic above to view modules."
              : `No ${meta.label.toLowerCase()} modules yet. Click 'Add ${meta.label} Module' to create one.`
          }
          maxHeight="calc(100vh - 380px)"
        />
      </div>

      {/* ── Add Module Modal ───────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className={`flex items-center justify-between px-6 py-4 ${meta.color}`}>
              <div className="flex items-center gap-3">
                <meta.icon size={18} className="text-white" />
                <p className="font-black text-white">Add {meta.label} Module</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer font-black">✕</button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <Form
                topicId={selectedTopic}
                subtopicId={selectedSubtopic}
                onDone={handleCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {viewingMod && <ViewModal mod={viewingMod} meta={meta} onClose={() => setViewingMod(null)} />}
    </EditorLayout>
  );
}
