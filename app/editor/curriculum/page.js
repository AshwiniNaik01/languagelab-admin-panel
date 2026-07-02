"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as Yup from "yup";
import EditorLayout from "../../layouts/EditorLayout";
import ScrollableTable from "../../components/Table";
import { ActionButton } from "../../components/ui/ActionIconButton";
import Button from "../../components/ui/Button";
import {
  getTopics, createTopic, updateTopic, deleteTopic,
  getSubTopics, createSubTopic, updateSubTopic, deleteSubTopic,
} from "../../services/editorPanel";
import { ListTree, Plus, X, Search } from "lucide-react";

const F = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400";

const topicSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
});

const subTopicSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
});

/* ── Modal form ──────────────────────────────────────────────────────────── */
function FormModal({ title, form, setForm, onSave, onClose, saving, errors = {}, setErrors }) {
  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field] && setErrors) {
      setErrors(p => {
        const next = { ...p };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
            <input className={`${F} ${errors.title ? "border-red-500 focus:ring-red-200" : ""}`} placeholder="e.g. Business Communication" value={form.title}
              onChange={e => handleChange("title", e.target.value)} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description {title.includes("SubTopic") ? "*" : ""}</label>
            <textarea className={`${F} resize-none ${errors.description ? "border-red-500 focus:ring-red-200" : ""}`} rows={3} placeholder="Brief overview…" value={form.description}
              onChange={e => handleChange("description", e.target.value)} />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Order</label>
            <input type="number" className={F} placeholder="1" value={form.order}
              onChange={e => handleChange("order", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : title.startsWith("Edit") ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── View Modal ──────────────────────────────────────────────────────────── */
function ViewModal({ item, onClose, label = "Topic" }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-linear-to-r from-orange-500 to-amber-500">
          <h3 className="font-black text-white text-base">{label} Details</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Order</p>
            <p className="font-bold text-slate-800">#{item.order ?? "—"}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Title</p>
            <p className="font-bold text-slate-800">{item.title}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Description</p>
            <p className="font-semibold text-slate-700 text-sm">{item.description || "—"}</p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <Button variant="secondary" onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export default function CurriculumPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState(searchParams.get("tab") || "topics");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "topics" || t === "subtopics") setTab(t);
  }, [searchParams]);

  // Topics
  const [topics, setTopics] = useState([]);
  const [topicLoading, setTopicLoading] = useState(true);
  const [topicSearch, setTopicSearch] = useState("");

  // SubTopics
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [subtopics, setSubtopics] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subSearch, setSubSearch] = useState("");

  // Modals
  const [modal, setModal] = useState(null); // "addTopic"|"editTopic"|"viewTopic"|"addSub"|"editSub"|"viewSub"
  const [target, setTarget] = useState(null);
  const [topicForm, setTopicForm] = useState({ title: "", description: "", order: "" });
  const [subForm, setSubForm] = useState({ title: "", description: "", order: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  /* load topics */
  useEffect(() => {
    (async () => {
      setTopicLoading(true);
      try {
        const r = await getTopics();
        const l = r.data?.data || r.data || [];
        setTopics(Array.isArray(l) ? l : []);
      } catch { /* non-blocking */ }
      finally { setTopicLoading(false); }
    })();
  }, []);

  /* load subtopics */
  const loadSubs = async (id) => {
    setSelectedTopicId(id);
    setSubtopics([]);
    setSubSearch("");
    if (!id) return;
    setSubLoading(true);
    try {
      const r = await getSubTopics(id);
      const l = r.data?.data || r.data || [];
      setSubtopics(Array.isArray(l) ? l : []);
    } catch { /* non-blocking */ }
    finally { setSubLoading(false); }
  };

  /* filtered */
  const filteredTopics = useMemo(() => {
    const q = topicSearch.toLowerCase();
    return q ? topics.filter(t => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)) : topics;
  }, [topics, topicSearch]);

  const filteredSubs = useMemo(() => {
    const q = subSearch.toLowerCase();
    return q ? subtopics.filter(s => s.title.toLowerCase().includes(q)) : subtopics;
  }, [subtopics, subSearch]);

  /* open/close modal helpers */
  const openModal = (type, item = null) => {
    setModal(type);
    setTarget(item);
    if (item) {
      if (type === "editTopic") setTopicForm({ title: item.title, description: item.description || "", order: item.order ?? "" });
      if (type === "editSub")   setSubForm({ title: item.title, description: item.description || "", order: item.order ?? "" });
    } else {
      setTopicForm({ title: "", description: "", order: "" });
      setSubForm({ title: "", description: "", order: "" });
    }
  };
  const closeModal = () => { setModal(null); setTarget(null); setErrors({}); };

  /* CRUD — topics */
  const saveTopic = async () => {
    try {
      await topicSchema.validate(topicForm, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      if (err.inner) err.inner.forEach(e => { validationErrors[e.path] = e.message; });
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      const p = { title: topicForm.title, description: topicForm.description, order: +topicForm.order || 1 };
      if (target) {
        await updateTopic(target._id, p);
        setTopics(prev => prev.map(t => t._id === target._id ? { ...t, ...p } : t));
      } else {
        const r = await createTopic(p);
        setTopics(prev => [...prev, r.data?.data || r.data]);
      }
      closeModal();
      Swal.fire({ icon: "success", title: target ? "Topic Updated" : "Topic Created", timer: 1200, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
    finally { setSaving(false); }
  };

  const handleDeleteTopic = async (t) => {
    const r = await Swal.fire({ title: `Delete "${t.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try {
      await deleteTopic(t._id);
      setTopics(prev => prev.filter(x => x._id !== t._id));
      if (selectedTopicId === t._id) { setSelectedTopicId(""); setSubtopics([]); }
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
  };

  /* CRUD — subtopics */
  const saveSub = async () => {
    try {
      await subTopicSchema.validate(subForm, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      if (err.inner) err.inner.forEach(e => { validationErrors[e.path] = e.message; });
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      const p = { topic_id: selectedTopicId, title: subForm.title, description: subForm.description, order: +subForm.order || 1 };
      if (target) {
        await updateSubTopic(target._id, p);
        setSubtopics(prev => prev.map(s => s._id === target._id ? { ...s, ...p } : s));
      } else {
        const r = await createSubTopic(p);
        setSubtopics(prev => [...prev, r.data?.data || r.data]);
      }
      closeModal();
      Swal.fire({ icon: "success", title: target ? "SubTopic Updated" : "SubTopic Created", timer: 1200, showConfirmButton: false });
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
    finally { setSaving(false); }
  };

  const handleDeleteSub = async (s) => {
    const r = await Swal.fire({ title: `Delete "${s.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try {
      await deleteSubTopic(s._id);
      setSubtopics(prev => prev.filter(x => x._id !== s._id));
    } catch (e) { Swal.fire({ icon: "error", title: "Failed", text: e?.response?.data?.message || e.message }); }
  };

  /* table columns */
  const topicColumns = [
    {
      header: "Order",
      accessor: (row) => (
        <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 font-black text-sm flex items-center justify-center">
          {row.order ?? "—"}
        </span>
      ),
    },
    {
      header: "Title",
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-sm">{row.title}</p>
          {row.description && <p className="text-xs text-slate-400 truncate max-w-xs">{row.description}</p>}
        </div>
      ),
    },
    {
      header: "SubTopics",
      accessor: (row) => (
        <button
          onClick={() => { router.push("/editor/curriculum?tab=subtopics"); loadSubs(row._id); }}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all cursor-pointer"
        >
          <ListTree size={12} /> View Subtopics
        </button>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <ActionButton
          onView={() => router.push(`/editor/topics/${row._id}`)}
          onEdit={() => router.push(`/editor/topics/${row._id}/edit`)}
          onDelete={() => handleDeleteTopic(row)}
        />
      ),
    },
  ];

  const subColumns = [
    {
      header: "Order",
      accessor: (row) => (
        <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 font-black text-sm flex items-center justify-center">
          {row.order ?? "—"}
        </span>
      ),
    },
    {
      header: "Title",
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-sm">{row.title}</p>
          {row.description && <p className="text-xs text-slate-400 truncate max-w-xs">{row.description}</p>}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <ActionButton
          onView={() => router.push(`/editor/subtopics/${row._id}`)}
          onEdit={() => router.push(`/editor/subtopics/${row._id}/edit`)}
          onDelete={() => handleDeleteSub(row)}
        />
      ),
    },
  ];

  return (
    <EditorLayout>
      <div className="space-y-5">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {tab === "topics" ? "Topics" : "SubTopics"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {tab === "topics" ? "Manage topics for your courses." : "Manage subtopics under a selected topic."}
          </p>
        </div>

        {/* ── TOPICS TAB ─────────────────────────────────────────────── */}
        {tab === "topics" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder={`Search ${topics.length} topics…`}
                  value={topicSearch}
                  onChange={e => setTopicSearch(e.target.value)}
                />
                {topicSearch && (
                  <button onClick={() => setTopicSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X size={14} />
                  </button>
                )}
              </div>
              <Button onClick={() => router.push("/editor/topics/new")}>
                <Plus size={15} className="mr-1" /> Add Topic
              </Button>
            </div>

            <ScrollableTable
              columns={topicColumns}
              data={filteredTopics}
              loading={topicLoading}
              emptyMessage="No topics yet. Click 'Add Topic' to create one."
              maxHeight="calc(100vh - 320px)"
            />
          </div>
        )}

        {/* ── SUBTOPICS TAB ──────────────────────────────────────────── */}
        {tab === "subtopics" && (
          <div className="space-y-4">
            {/* Topic selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Topic</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 cursor-pointer"
                value={selectedTopicId}
                onChange={e => loadSubs(e.target.value)}
              >
                <option value="">— choose a topic —</option>
                {topics.map(t => (
                  <option key={t._id} value={t._id}>{t.order ? `#${t.order} ` : ""}{t.title}</option>
                ))}
              </select>
            </div>

            {selectedTopicId && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      placeholder="Search subtopics…"
                      value={subSearch}
                      onChange={e => setSubSearch(e.target.value)}
                    />
                    {subSearch && (
                      <button onClick={() => setSubSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <Button onClick={() => router.push(`/editor/subtopics/new?topic_id=${selectedTopicId}`)}>
                    <Plus size={15} className="mr-1" /> Add SubTopic
                  </Button>
                </div>

                <ScrollableTable
                  columns={subColumns}
                  data={filteredSubs}
                  loading={subLoading}
                  emptyMessage="No subtopics yet. Click 'Add SubTopic' to create one."
                  maxHeight="calc(100vh - 380px)"
                />
              </>
            )}

            {!selectedTopicId && (
              <div className="text-center py-16 text-slate-400">
                <ListTree size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold">Select a topic above to manage its subtopics.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────── */}
      {(modal === "addTopic" || modal === "editTopic") && (
        <FormModal
          title={modal === "editTopic" ? "Edit Topic" : "Add New Topic"}
          form={topicForm}
          setForm={setTopicForm}
          onSave={saveTopic}
          onClose={closeModal}
          saving={saving}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {(modal === "addSub" || modal === "editSub") && (
        <FormModal
          title={modal === "editSub" ? "Edit SubTopic" : "Add New SubTopic"}
          form={subForm}
          setForm={setSubForm}
          onSave={saveSub}
          onClose={closeModal}
          saving={saving}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {modal === "viewTopic" && target && (
        <ViewModal item={target} onClose={closeModal} label="Topic" />
      )}

      {modal === "viewSub" && target && (
        <ViewModal item={target} onClose={closeModal} label="SubTopic" />
      )}
    </EditorLayout>
  );
}
