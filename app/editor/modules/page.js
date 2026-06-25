"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditorLayout from "../../layouts/EditorLayout";
import {
  getTopics, getSubTopics, getModules, deleteModule,
  createTextModule, createExerciseModule, createVocabularyModule,
  createVideoModule, createAudioModule,
} from "../../services/editorPanel";
import { Video, Music, FileText, Dumbbell, BookMarked, Trash2, Plus, X, Check, ChevronDown } from "lucide-react";

const TYPES = [
  { key: "text",       label: "Text",       icon: FileText,   color: "bg-blue-500",   border: "border-blue-400",   light: "bg-blue-50" },
  { key: "video",      label: "Video",      icon: Video,      color: "bg-purple-500", border: "border-purple-400", light: "bg-purple-50" },
  { key: "audio",      label: "Audio",      icon: Music,      color: "bg-teal-500",   border: "border-teal-400",   light: "bg-teal-50" },
  { key: "exercise",   label: "Exercise",   icon: Dumbbell,   color: "bg-amber-500",  border: "border-amber-400",  light: "bg-amber-50" },
  { key: "vocabulary", label: "Vocabulary", icon: BookMarked, color: "bg-pink-500",   border: "border-pink-400",   light: "bg-pink-50" },
];

const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 transition-all";
const sel = `${inp} cursor-pointer`;

/* ── Simple module create forms ─────────────────────────────────────────────── */
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
      <Buttons saving={saving} onCancel={onCancel} />
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
      <Buttons saving={saving} onCancel={onCancel} />
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
      <Buttons saving={saving} onCancel={onCancel} />
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
    <form onSubmit={submit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="Quiz title" /></div><div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Type</label><select className={sel} value={f.exercise_type} onChange={e => setF(p => ({ ...p, exercise_type: e.target.value }))}>{["mcq","fill_blank","true_false"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label><select className={sel} value={f.difficulty} onChange={e => setF(p => ({ ...p, difficulty: e.target.value }))}>{["easy","medium","hard"].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
      </div>
      <div className="border-t border-slate-200 pt-3">
        <div className="flex justify-between items-center mb-2"><p className="text-xs font-bold text-slate-600">Questions</p><button type="button" onClick={() => setQ(p => [...p, { question_text: "", options: ["",""], correct_answer: "", marks: 1 }])} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Question</button></div>
        {questions.map((q, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 space-y-2">
            <input className={inp} placeholder={`Question ${i+1} *`} value={q.question_text} onChange={e => setQ(p => p.map((q2, idx) => idx === i ? { ...q2, question_text: e.target.value } : q2))} />
            {q.options.map((o, oi) => <input key={oi} className={inp} placeholder={`Option ${oi+1}`} value={o} onChange={e => setQ(p => p.map((q2, idx) => idx === i ? { ...q2, options: q2.options.map((op, opidx) => opidx === oi ? e.target.value : op) } : q2))} />)}
            <input className={inp} placeholder="Correct answer *" value={q.correct_answer} onChange={e => setQ(p => p.map((q2, idx) => idx === i ? { ...q2, correct_answer: e.target.value } : q2))} />
          </div>
        ))}
      </div>
      <Buttons saving={saving} onCancel={onCancel} />
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
    <form onSubmit={submit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="Vocabulary set title" /></div><div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div></div>
      <div className="border-t border-slate-200 pt-3">
        <div className="flex justify-between items-center mb-2"><p className="text-xs font-bold text-slate-600">Words</p><button type="button" onClick={() => setW(p => [...p, { word: "", meaning: "", example: "" }])} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Word</button></div>
        {words.map((w, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 grid grid-cols-3 gap-2">
            <input className={inp} placeholder="Word *" value={w.word} onChange={e => setW(p => p.map((w2, idx) => idx === i ? { ...w2, word: e.target.value } : w2))} />
            <input className={inp} placeholder="Meaning *" value={w.meaning} onChange={e => setW(p => p.map((w2, idx) => idx === i ? { ...w2, meaning: e.target.value } : w2))} />
            <input className={inp} placeholder="Example" value={w.example} onChange={e => setW(p => p.map((w2, idx) => idx === i ? { ...w2, example: e.target.value } : w2))} />
          </div>
        ))}
      </div>
      <Buttons saving={saving} onCancel={onCancel} />
    </form>
  );
}

function Buttons({ saving, onCancel }) {
  return (
    <div className="flex gap-3 pt-2 border-t border-slate-200">
      <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
        <Check size={15} /> {saving ? "Creating…" : "Create Module"}
      </button>
      <button type="button" onClick={onCancel} className="px-5 py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">
        Cancel
      </button>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function ModulesPage() {
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [activeType, setActiveType] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingMods, setLoadingMods] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const res = await getTopics(); const list = res.data?.data || res.data || []; setTopics(Array.isArray(list) ? list : []); }
      catch { /* non-blocking */ } finally { setLoadingTopics(false); }
    };
    load();
  }, []);

  const onTopicChange = async (topicId) => {
    setSelectedTopic(topicId); setSelectedSubtopic(""); setActiveType(""); setModules([]);
    if (!topicId) { setSubtopics([]); return; }
    try { const res = await getSubTopics(topicId); const list = res.data?.data || res.data || []; setSubtopics(Array.isArray(list) ? list : []); }
    catch { setSubtopics([]); }
  };

  const onSubtopicChange = (subtopicId) => {
    setSelectedSubtopic(subtopicId); setActiveType(""); setModules([]);
  };

  const onTypeSelect = async (typeKey) => {
    setActiveType(typeKey); setShowForm(false);
    if (!selectedSubtopic) return;
    setLoadingMods(true);
    try { const res = await getModules(typeKey, selectedSubtopic); const list = res.data?.data || res.data || []; setModules(Array.isArray(list) ? list : []); }
    catch { setModules([]); } finally { setLoadingMods(false); }
  };

  const handleDelete = async (mod) => {
    const r = await Swal.fire({ title: `Delete "${mod.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try { await deleteModule(activeType, mod._id); setModules(p => p.filter(m => m._id !== mod._id)); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
  };

  const handleCreated = async () => {
    setShowForm(false);
    if (selectedSubtopic && activeType) {
      const res = await getModules(activeType, selectedSubtopic);
      const list = res.data?.data || res.data || [];
      setModules(Array.isArray(list) ? list : []);
    }
    Swal.fire({ icon: "success", title: "Module Created", timer: 1200, showConfirmButton: false });
  };

  const topicObj = topics.find(t => t._id === selectedTopic);
  const subtopicObj = subtopics.find(s => s._id === selectedSubtopic);
  const typeObj = TYPES.find(t => t.key === activeType);
  const step = !selectedTopic ? 1 : !selectedSubtopic ? 2 : !activeType ? 3 : 4;

  return (
    <EditorLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Modules</h2>
          <p className="text-sm text-slate-500 mt-1">Follow the 3 steps below to add content modules.</p>
        </div>

        {/* Step 1 — Topic */}
        <div className={`bg-white border-2 rounded-2xl p-5 transition-all ${step >= 1 ? "border-orange-400" : "border-slate-200 opacity-50"}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">1</span>
            <p className="font-bold text-slate-800">Select a Topic</p>
            {topicObj && <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">✓ {topicObj.title}</span>}
          </div>
          <div className="relative">
            <select className={sel} value={selectedTopic} onChange={e => onTopicChange(e.target.value)}>
              <option value="">— Choose a topic —</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {loadingTopics && <p className="text-xs text-slate-400 mt-1">Loading topics…</p>}
        </div>

        {/* Step 2 — SubTopic */}
        <div className={`bg-white border-2 rounded-2xl p-5 transition-all ${step >= 2 ? "border-teal-400" : "border-slate-200 opacity-40"}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center ${step >= 2 ? "bg-teal-500" : "bg-slate-300"}`}>2</span>
            <p className="font-bold text-slate-800">Select a SubTopic</p>
            {subtopicObj && <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">✓ {subtopicObj.title}</span>}
          </div>
          <div className="relative">
            <select className={sel} value={selectedSubtopic} onChange={e => onSubtopicChange(e.target.value)} disabled={!selectedTopic}>
              <option value="">— Choose a subtopic —</option>
              {subtopics.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {selectedTopic && subtopics.length === 0 && <p className="text-xs text-slate-400 mt-1">No subtopics found for this topic.</p>}
        </div>

        {/* Step 3 — Module Type */}
        <div className={`bg-white border-2 rounded-2xl p-5 transition-all ${step >= 3 ? "border-purple-400" : "border-slate-200 opacity-40"}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center ${step >= 3 ? "bg-purple-500" : "bg-slate-300"}`}>3</span>
            <p className="font-bold text-slate-800">Choose Module Type</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {TYPES.map(({ key, label, icon: Icon, color, border, light }) => (
              <button
                key={key}
                onClick={() => selectedSubtopic && onTypeSelect(key)}
                disabled={!selectedSubtopic}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  activeType === key ? `${light} ${border}` : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${color}`}><Icon size={18} /></span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4 — Modules List */}
        {activeType && selectedSubtopic && (
          <div className="bg-white border-2 border-green-400 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center">4</span>
                <p className="font-bold text-slate-800">{typeObj?.label} Modules <span className="text-slate-400 font-normal">({modules.length})</span></p>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer"
                >
                  <Plus size={15} /> Add {typeObj?.label}
                </button>
              )}
            </div>

            {/* Create form */}
            {showForm && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-slate-700">New {typeObj?.label} Module</p>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
                </div>
                {activeType === "text"       && <TextForm     topicId={selectedTopic} subtopicId={selectedSubtopic} onDone={handleCreated} onCancel={() => setShowForm(false)} />}
                {activeType === "video"      && <VideoForm    topicId={selectedTopic} subtopicId={selectedSubtopic} onDone={handleCreated} onCancel={() => setShowForm(false)} />}
                {activeType === "audio"      && <AudioForm    topicId={selectedTopic} subtopicId={selectedSubtopic} onDone={handleCreated} onCancel={() => setShowForm(false)} />}
                {activeType === "exercise"   && <ExerciseForm topicId={selectedTopic} subtopicId={selectedSubtopic} onDone={handleCreated} onCancel={() => setShowForm(false)} />}
                {activeType === "vocabulary" && <VocabForm    topicId={selectedTopic} subtopicId={selectedSubtopic} onDone={handleCreated} onCancel={() => setShowForm(false)} />}
              </div>
            )}

            {loadingMods ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-7 w-7 border-t-2 border-orange-500 border-r-2" /></div>
            ) : modules.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-2">{["📄","🎬","🎧","🏋️","📖"][TYPES.findIndex(t=>t.key===activeType)]}</p>
                <p className="text-sm font-semibold">No {typeObj?.label?.toLowerCase()} modules yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {modules.map((mod, idx) => (
                  <div key={mod._id || idx} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${typeObj?.color}`}>
                      {typeObj && <typeObj.icon size={14} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{mod.title}</p>
                      <p className="text-[11px] text-slate-400">Order #{mod.order ?? idx + 1}</p>
                    </div>
                    <button onClick={() => handleDelete(mod)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
