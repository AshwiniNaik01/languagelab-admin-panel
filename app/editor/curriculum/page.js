"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import EditorLayout from "../../layouts/EditorLayout";
import {
  getTopics, createTopic, updateTopic, deleteTopic,
  getSubTopics, createSubTopic, updateSubTopic, deleteSubTopic,
} from "../../services/editorPanel";
import { Search, Plus, Pencil, Trash2, X, BookOpen, ListTree } from "lucide-react";

const F = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400";

/* ── small modal ─────────────────────────────────────────── */
function Drawer({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── form fields ─────────────────────────────────────────── */
function TopicFields({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
        <input className={F} placeholder="e.g. Business Communication" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
        <textarea className={`${F} resize-none`} rows={3} placeholder="Brief overview…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Order</label>
        <input type="number" className={F} placeholder="1" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
      </div>
    </div>
  );
}

function SubFields({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
        <input className={F} placeholder="e.g. Writing Formal Emails" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
        <textarea className={`${F} resize-none`} rows={3} placeholder="What this subtopic covers…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Order</label>
        <input type="number" className={F} placeholder="1" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
      </div>
    </div>
  );
}

/* ── main ────────────────────────────────────────────────── */
export default function CurriculumPage() {
  const [tab, setTab]     = useState("topics"); // "topics" | "subtopics"
  const [topics, setTopics]   = useState([]);
  const [loading, setLoading] = useState(true);

  // subtopics tab state
  const [subTopicId, setSubTopicId] = useState("");
  const [subtopics, setSubtopics]   = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  // search
  const [topicSearch, setTopicSearch] = useState("");
  const [subSearch,   setSubSearch]   = useState("");

  // drawers
  const [drawer, setDrawer]       = useState(null); // "addTopic"|"editTopic"|"addSub"|"editSub"
  const [editTarget, setEditTarget] = useState(null);
  const [topicForm, setTopicForm]   = useState({ title: "", description: "", order: "" });
  const [subForm,   setSubForm]     = useState({ title: "", description: "", order: "" });
  const [saving, setSaving]         = useState(false);

  /* load */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const r = await getTopics(); const l = r.data?.data || r.data || []; setTopics(Array.isArray(l) ? l : []); }
      catch { /* non-blocking */ } finally { setLoading(false); }
    })();
  }, []);

  const loadSubs = async (id) => {
    setSubTopicId(id); setSubtopics([]);
    if (!id) return;
    setSubLoading(true);
    try { const r = await getSubTopics(id); const l = r.data?.data || r.data || []; setSubtopics(Array.isArray(l) ? l : []); }
    catch { /* non-blocking */ } finally { setSubLoading(false); }
  };

  /* filtered */
  const filteredTopics = useMemo(() => {
    const q = topicSearch.toLowerCase();
    return q ? topics.filter(t => t.title.toLowerCase().includes(q) || (t.description||"").toLowerCase().includes(q)) : topics;
  }, [topics, topicSearch]);

  const filteredSubs = useMemo(() => {
    const q = subSearch.toLowerCase();
    return q ? subtopics.filter(s => s.title.toLowerCase().includes(q)) : subtopics;
  }, [subtopics, subSearch]);

  /* drawer helpers */
  const openDrawer = (d, target = null) => { setDrawer(d); setEditTarget(target); if (target) { if (d === "editTopic") setTopicForm({ title: target.title, description: target.description || "", order: target.order ?? "" }); if (d === "editSub") setSubForm({ title: target.title, description: target.description || "", order: target.order ?? "" }); } else { setTopicForm({ title: "", description: "", order: "" }); setSubForm({ title: "", description: "", order: "" }); } };
  const closeDrawer = () => { setDrawer(null); setEditTarget(null); };

  /* CRUD */
  const saveTopic = async () => {
    if (!topicForm.title.trim()) { Swal.fire({ icon: "warning", title: "Title required" }); return; }
    setSaving(true);
    try {
      const p = { title: topicForm.title, description: topicForm.description, order: +topicForm.order || 1 };
      if (editTarget) { await updateTopic(editTarget._id, p); setTopics(prev => prev.map(t => t._id === editTarget._id ? { ...t, ...p } : t)); }
      else { const r = await createTopic(p); setTopics(prev => [...prev, r.data?.data || r.data]); }
      closeDrawer();
      Swal.fire({ icon: "success", title: editTarget ? "Updated" : "Topic Created", timer: 1200, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
    finally { setSaving(false); }
  };

  const deleteTopic_ = async (t) => {
    const r = await Swal.fire({ title: `Delete "${t.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try { await deleteTopic(t._id); setTopics(prev => prev.filter(x => x._id !== t._id)); if (subTopicId === t._id) { setSubTopicId(""); setSubtopics([]); } }
    catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
  };

  const saveSub = async () => {
    if (!subForm.title.trim()) { Swal.fire({ icon: "warning", title: "Title required" }); return; }
    setSaving(true);
    try {
      const p = { topic_id: subTopicId, title: subForm.title, description: subForm.description, order: +subForm.order || 1 };
      if (editTarget) { await updateSubTopic(editTarget._id, p); setSubtopics(prev => prev.map(s => s._id === editTarget._id ? { ...s, ...p } : s)); }
      else { const r = await createSubTopic(p); setSubtopics(prev => [...prev, r.data?.data || r.data]); }
      closeDrawer();
      Swal.fire({ icon: "success", title: editTarget ? "Updated" : "SubTopic Added", timer: 1200, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
    finally { setSaving(false); }
  };

  const deleteSub = async (s) => {
    const r = await Swal.fire({ title: `Delete "${s.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try { await deleteSubTopic(s._id); setSubtopics(prev => prev.filter(x => x._id !== s._id)); }
    catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
  };

  /* ── render ─────────────────────────────────────────────── */
  return (
    <EditorLayout>
      <div className="space-y-5">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900">Curriculum</h2>
          <p className="text-sm text-slate-500 mt-1">Manage topics and subtopics for your courses.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setTab("topics")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === "topics" ? "bg-white shadow text-orange-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <BookOpen size={16} /> Topics
            <span className="text-xs font-black text-slate-400">({topics.length})</span>
          </button>
          <button
            onClick={() => setTab("subtopics")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === "subtopics" ? "bg-white shadow text-teal-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <ListTree size={16} /> SubTopics
          </button>
        </div>

        {/* ── TOPICS TAB ─────────────────────────────────── */}
        {tab === "topics" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className={`${F} pl-10`} placeholder={`Search ${topics.length} topics…`} value={topicSearch} onChange={e => setTopicSearch(e.target.value)} />
                {topicSearch && <button onClick={() => setTopicSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"><X size={14} /></button>}
              </div>
              <button onClick={() => openDrawer("addTopic")} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer shrink-0">
                <Plus size={16} /> Add Topic
              </button>
            </div>

            {topicSearch && <p className="text-xs text-slate-400">{filteredTopics.length} of {topics.length} topics</p>}

            {loading ? (
              <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-r-2" /></div>
            ) : filteredTopics.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <BookOpen size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold">{topicSearch ? `No topics match "${topicSearch}"` : "No topics yet."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTopics.map((t, i) => (
                  <div key={t._id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-black text-sm flex items-center justify-center shrink-0">
                        {t.order ?? i + 1}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openDrawer("editTopic", t)} className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 cursor-pointer transition"><Pencil size={13} /></button>
                        <button onClick={() => deleteTopic_(t)} className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer transition"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">{t.title}</h3>
                    {t.description && <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>}
                    <button
                      onClick={() => { setTab("subtopics"); loadSubs(t._id); }}
                      className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer transition"
                    >
                      View subtopics →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SUBTOPICS TAB ──────────────────────────────── */}
        {tab === "subtopics" && (
          <div className="space-y-4">
            {/* Topic picker */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Topic</label>
              <select
                className={`${F} cursor-pointer`}
                value={subTopicId}
                onChange={e => loadSubs(e.target.value)}
              >
                <option value="">— choose a topic —</option>
                {topics.map(t => <option key={t._id} value={t._id}>{t.order ? `#${t.order} ` : ""}{t.title}</option>)}
              </select>
            </div>

            {subTopicId && (
              <>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className={`${F} pl-10`} placeholder="Search subtopics…" value={subSearch} onChange={e => setSubSearch(e.target.value)} />
                    {subSearch && <button onClick={() => setSubSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"><X size={14} /></button>}
                  </div>
                  <button onClick={() => openDrawer("addSub")} className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold rounded-xl transition cursor-pointer shrink-0">
                    <Plus size={16} /> Add SubTopic
                  </button>
                </div>

                {subLoading ? (
                  <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 border-r-2" /></div>
                ) : filteredSubs.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <ListTree size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold">{subSearch ? `No subtopics match "${subSearch}"` : "No subtopics yet. Click 'Add SubTopic'."}</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {filteredSubs.map((s, i) => (
                      <div key={s._id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group ${i < filteredSubs.length - 1 ? "border-b border-slate-100" : ""}`}>
                        <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 font-black text-xs flex items-center justify-center shrink-0">{s.order ?? i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm">{s.title}</p>
                          {s.description && <p className="text-xs text-slate-400 truncate">{s.description}</p>}
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openDrawer("editSub", s)} className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 cursor-pointer transition"><Pencil size={13} /></button>
                          <button onClick={() => deleteSub(s)} className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer transition"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {!subTopicId && (
              <div className="text-center py-16 text-slate-400">
                <ListTree size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold">Select a topic above to manage its subtopics.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DRAWERS ───────────────────────────────────────── */}
      {drawer === "addTopic" && (
        <Drawer title="Add New Topic" onClose={closeDrawer}>
          <TopicFields form={topicForm} setForm={setTopicForm} />
          <div className="mt-6 flex gap-3">
            <button onClick={saveTopic} disabled={saving} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50">{saving ? "Saving…" : "Create Topic"}</button>
            <button onClick={closeDrawer} className="px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
          </div>
        </Drawer>
      )}

      {drawer === "editTopic" && (
        <Drawer title="Edit Topic" onClose={closeDrawer}>
          <TopicFields form={topicForm} setForm={setTopicForm} />
          <div className="mt-6 flex gap-3">
            <button onClick={saveTopic} disabled={saving} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50">{saving ? "Saving…" : "Update Topic"}</button>
            <button onClick={closeDrawer} className="px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
          </div>
        </Drawer>
      )}

      {drawer === "addSub" && (
        <Drawer title="Add SubTopic" onClose={closeDrawer}>
          <SubFields form={subForm} setForm={setSubForm} />
          <div className="mt-6 flex gap-3">
            <button onClick={saveSub} disabled={saving} className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50">{saving ? "Saving…" : "Add SubTopic"}</button>
            <button onClick={closeDrawer} className="px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
          </div>
        </Drawer>
      )}

      {drawer === "editSub" && (
        <Drawer title="Edit SubTopic" onClose={closeDrawer}>
          <SubFields form={subForm} setForm={setSubForm} />
          <div className="mt-6 flex gap-3">
            <button onClick={saveSub} disabled={saving} className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50">{saving ? "Saving…" : "Update SubTopic"}</button>
            <button onClick={closeDrawer} className="px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
          </div>
        </Drawer>
      )}
    </EditorLayout>
  );
}
