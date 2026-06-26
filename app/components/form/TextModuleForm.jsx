"use client";

import { useEffect, useState } from "react";
import { getTopics, getSubTopics } from "../../services/editorPanel";
import { ChevronDown, Trash2, X } from "lucide-react";
import Button from "../ui/Button";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const Q_TYPES     = ["mcq", "fill_blank", "true_false", "short_answer"];

const inp = `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400
  outline-none transition-all duration-200 text-sm
  border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`;

const inpErr = `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400
  outline-none transition-all duration-200 text-sm
  border-red-500 focus:ring-2 focus:ring-red-200`;

const lbl    = "block mb-2 text-sm font-medium text-gray-700";
const errTxt = "mt-1 text-xs text-red-500";

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-orange-500/10" />
      <p className="text-xs font-black text-[#3C1E0A]/50 uppercase tracking-widest shrink-0">{title}</p>
      <div className="h-px flex-1 bg-orange-500/10" />
    </div>
  );
}

function err(show, msg) {
  return show ? <p className={errTxt}>{msg}</p> : null;
}

export default function TextModuleForm({ onSubmit, onCancel, saving = false }) {
  const [submitted, setSubmitted] = useState(false);

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const [topics,        setTopics]        = useState([]);
  const [subtopics,     setSubtopics]     = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSub,   setSelectedSub]   = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await getTopics();
        setTopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
      } catch {} finally { setLoadingTopics(false); }
    })();
  }, []);

  const onTopicChange = async (id) => {
    setSelectedTopic(id); setSelectedSub("");
    if (!id) { setSubtopics([]); return; }
    try {
      const r = await getSubTopics(id);
      setSubtopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
    } catch { setSubtopics([]); }
  };

  /* ── Module fields ─────────────────────────────────────────────────────── */
  const [f, setF] = useState({
    title: "", description: "", order: 0,
    body: "", level: "B1", word_count: "", read_time_min: "", source: "",
    total_marks: "", time_limit_sec: "", max_attempts: 3,
  });
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const [questions, setQuestions] = useState([]);
  const blankQ  = ()          => ({ question_text: "", question_type: "mcq", options: ["", ""], correct_answer: "", explanation: "", paragraph_ref: "", marks: 1 });
  const addQ    = ()          => setQuestions(p => [...p, blankQ()]);
  const rmQ     = (i)         => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updQ    = (i, k, v)   => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const updOpt  = (qi, oi, v) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));
  const addOpt  = (qi)        => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const rmOpt   = (qi, oi)    => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));

  /* ── Validation helpers ────────────────────────────────────────────────── */
  const v = {
    topic:      !selectedTopic,
    sub:        !selectedSub,
    title:      !f.title.trim(),
    body:       !f.body.trim(),
    order:      +f.order < 0,
    maxAttempts: +f.max_attempts < 1,
    wordCount:  f.word_count !== "" && +f.word_count < 0,
    readTime:   f.read_time_min !== "" && +f.read_time_min <= 0,
    totalMarks: f.total_marks !== "" && +f.total_marks < 0,
    timeLimit:  f.time_limit_sec !== "" && +f.time_limit_sec <= 0,
  };
  const qv = questions.map(q => ({
    text:    !q.question_text.trim(),
    answer:  !q.correct_answer.trim(),
    options: q.question_type === "mcq" && q.options.filter(Boolean).length < 2,
    marks:   q.marks < 0,
  }));

  const isValid = () =>
    !Object.values(v).some(Boolean) &&
    qv.every(q => !q.text && !q.answer && !q.options && !q.marks);

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid()) return;

    const validQs = questions
      .filter(q => q.question_text.trim() && q.correct_answer.trim())
      .map(q => ({
        question_text:  q.question_text.trim(),
        question_type:  q.question_type,
        correct_answer: q.correct_answer.trim(),
        marks: +q.marks || 1,
        ...(q.question_type === "mcq" && { options: q.options.filter(Boolean) }),
        ...(q.explanation?.trim()      && { explanation:    q.explanation.trim() }),
        ...(q.paragraph_ref            && { paragraph_ref:  +q.paragraph_ref }),
      }));

    onSubmit({
      topic_id:     selectedTopic,
      sub_topic_id: selectedSub,
      title:        f.title.trim(),
      order:        +f.order || 0,
      ...(f.description.trim()  && { description:    f.description.trim() }),
      ...(f.total_marks         && { total_marks:    +f.total_marks }),
      ...(f.time_limit_sec      && { time_limit_sec: +f.time_limit_sec }),
      max_attempts: +f.max_attempts || 3,
      content: {
        body:  f.body.trim(),
        level: f.level,
        ...(f.word_count    && { word_count:    +f.word_count }),
        ...(f.read_time_min && { read_time_min: +f.read_time_min }),
        ...(f.source.trim() && { source:         f.source.trim() }),
      },
      ...(validQs.length > 0 && { questions: validQs }),
    });
  };

  const fc = (invalid) => invalid ? inpErr : inp;
  const s  = submitted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">Create Text Module</h3>

      {/* ── Topic & SubTopic ─────────────────────────────────────────────── */}
      <SectionDivider title="Topic & SubTopic" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Topic <span className="ml-1 text-orange-500">*</span></label>
          <div className="relative">
            <select
              className={`${fc(s && v.topic)} cursor-pointer pr-9 appearance-none`}
              value={selectedTopic}
              onChange={e => onTopicChange(e.target.value)}
              disabled={loadingTopics}
            >
              <option value="">— {loadingTopics ? "Loading…" : "Choose topic"} —</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
          {err(s && v.topic, "Please select a topic")}
        </div>
        <div className={!selectedTopic ? "opacity-40 pointer-events-none" : ""}>
          <label className={lbl}>SubTopic <span className="ml-1 text-orange-500">*</span></label>
          <div className="relative">
            <select
              className={`${fc(s && v.sub)} cursor-pointer pr-9 appearance-none`}
              value={selectedSub}
              onChange={e => setSelectedSub(e.target.value)}
              disabled={!selectedTopic}
            >
              <option value="">— Choose subtopic —</option>
              {subtopics.map(st => <option key={st._id} value={st._id}>{st.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
          {err(s && v.sub, "Please select a subtopic")}
        </div>
      </div>

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <SectionDivider title="Basic Info" />
      <div>
        <label className={lbl}>Title <span className="ml-1 text-orange-500">*</span></label>
        <input className={fc(s && v.title)} placeholder="Module title" value={f.title} onChange={set("title")} />
        {err(s && v.title, "Title is required")}
      </div>
      <div>
        <label className={lbl}>Description</label>
        <input className={inp} placeholder="Short description (optional)" value={f.description} onChange={set("description")} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Order</label>
          <input type="number" min={0} className={fc(s && v.order)} value={f.order} onChange={set("order")} />
          {err(s && v.order, "Order must be 0 or greater")}
        </div>
        <div>
          <label className={lbl}>CEFR Level</label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={f.level} onChange={set("level")}>
              {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <SectionDivider title="Content" />
      <div>
        <label className={lbl}>Content Body <span className="ml-1 text-orange-500">*</span></label>
        <textarea className={`${fc(s && v.body)} resize-none`} rows={8} placeholder="Write the full lesson text here…" value={f.body} onChange={set("body")} />
        {err(s && v.body, "Content body is required")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={lbl}>Word Count</label>
          <input type="number" min={0} className={fc(s && v.wordCount)} placeholder="e.g. 250" value={f.word_count} onChange={set("word_count")} />
          {err(s && v.wordCount, "Must be 0 or greater")}
        </div>
        <div>
          <label className={lbl}>Read Time (min)</label>
          <input type="number" min={1} className={fc(s && v.readTime)} placeholder="e.g. 5" value={f.read_time_min} onChange={set("read_time_min")} />
          {err(s && v.readTime, "Must be greater than 0")}
        </div>
        <div>
          <label className={lbl}>Source</label>
          <input className={inp} placeholder="e.g. Oxford Grammar" value={f.source} onChange={set("source")} />
        </div>
      </div>

      {/* ── Settings ─────────────────────────────────────────────────────── */}
      <SectionDivider title="Settings" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={lbl}>Max Attempts</label>
          <input type="number" min={1} className={fc(s && v.maxAttempts)} value={f.max_attempts} onChange={set("max_attempts")} />
          {err(s && v.maxAttempts, "Must be at least 1")}
        </div>
        <div>
          <label className={lbl}>Total Marks</label>
          <input type="number" min={0} className={fc(s && v.totalMarks)} placeholder="Optional" value={f.total_marks} onChange={set("total_marks")} />
          {err(s && v.totalMarks, "Must be 0 or greater")}
        </div>
        <div>
          <label className={lbl}>Time Limit (sec)</label>
          <input type="number" min={1} className={fc(s && v.timeLimit)} placeholder="Optional" value={f.time_limit_sec} onChange={set("time_limit_sec")} />
          {err(s && v.timeLimit, "Must be greater than 0")}
        </div>
      </div>

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <SectionDivider title="Questions" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Comprehension questions <span className="text-gray-400 font-normal">(optional)</span>
          {questions.length > 0 && <span className="ml-2 text-orange-500 font-bold">— {questions.length}</span>}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={addQ}>+ Add Question</Button>
      </div>
      {questions.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">
          No questions yet — click <span className="font-semibold text-orange-400">Add Question</span> to include comprehension checks.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className={`rounded-2xl p-5 space-y-4 border ${s && (qv[i]?.text || qv[i]?.answer || qv[i]?.options) ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Question {i + 1}</span>
                <button type="button" onClick={() => rmQ(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer">
                  <Trash2 size={12} /> Remove
                </button>
              </div>
              <div>
                <label className={lbl}>Question Text <span className="ml-1 text-orange-500">*</span></label>
                <input className={fc(s && qv[i]?.text)} placeholder="Enter question…" value={q.question_text} onChange={e => updQ(i, "question_text", e.target.value)} />
                {err(s && qv[i]?.text, "Question text is required")}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Type</label>
                  <div className="relative">
                    <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={q.question_type} onChange={e => updQ(i, "question_type", e.target.value)}>
                      {Q_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Marks</label>
                  <input type="number" min={0} className={fc(s && qv[i]?.marks)} value={q.marks} onChange={e => updQ(i, "marks", +e.target.value)} />
                  {err(s && qv[i]?.marks, "Must be 0 or greater")}
                </div>
                <div>
                  <label className={lbl}>Paragraph Ref</label>
                  <input type="number" min={1} className={inp} placeholder="Optional" value={q.paragraph_ref || ""} onChange={e => updQ(i, "paragraph_ref", e.target.value)} />
                </div>
              </div>
              {q.question_type === "mcq" && (
                <div>
                  <label className={lbl}>Options</label>
                  {err(s && qv[i]?.options, "At least 2 options are required")}
                  <div className="space-y-2 mt-1">
                    {q.options.map((o, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <input className={inp} placeholder={`Option ${oi + 1}`} value={o} onChange={e => updOpt(i, oi, e.target.value)} />
                        {q.options.length > 2 && (
                          <button type="button" onClick={() => rmOpt(i, oi)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addOpt(i)} className="text-xs text-orange-500 font-semibold cursor-pointer hover:text-orange-700 mt-1">
                      + Add Option
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className={lbl}>Correct Answer <span className="ml-1 text-orange-500">*</span></label>
                <input className={fc(s && qv[i]?.answer)} placeholder="Enter correct answer" value={q.correct_answer} onChange={e => updQ(i, "correct_answer", e.target.value)} />
                {err(s && qv[i]?.answer, "Correct answer is required")}
              </div>
              <div>
                <label className={lbl}>Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
                <input className={inp} placeholder="Why is this the correct answer?" value={q.explanation || ""} onChange={e => updQ(i, "explanation", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Creating…" : "Create Text Module"}
        </Button>
      </div>
    </form>
  );
}
