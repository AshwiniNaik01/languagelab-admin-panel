"use client";

import { useState } from "react";
import Button from "../ui/Button";
import {
  inp, inpErr, lbl, errTxt, Q_TYPES,
  SectionDivider, useTopicSubtopic, TopicSubtopicSection, QuestionsEditor,
} from "./shared/ModuleFormShared";
import RichTextEditor from "./shared/RichTextEditor";

const EXERCISE_TYPES = ["mcq", "fill_blank", "true_false", "match", "reorder"];
const DIFF_OPTIONS   = ["easy", "medium", "hard"];

function err(show, msg) {
  return show ? <p className={errTxt}>{msg}</p> : null;
}

export default function ExerciseModuleForm({ onSubmit, onCancel, saving = false, initialData = null, isEdit = false }) {
  const [submitted, setSubmitted] = useState(false);

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const ts = useTopicSubtopic(initialData, isEdit);

  /* ── Module fields ─────────────────────────────────────────────────────── */
  const [f, setF] = useState({
    title:             initialData?.title             ?? "",
    description:       initialData?.description       ?? "",
    order:             initialData?.order             ?? 1,
    exercise_type:     initialData?.exercise_type     ?? "mcq",
    difficulty:        initialData?.difficulty        ?? "medium",
    max_attempts:      initialData?.max_attempts      ?? 5,
    total_marks:       initialData?.total_marks       ?? "",
    time_limit_sec:    initialData?.time_limit_sec    ?? "",
    shuffle_questions: initialData?.shuffle_questions ?? true,
    shuffle_options:   initialData?.shuffle_options   ?? true,
    show_explanation:  initialData?.show_explanation  ?? true,
  });
  const set    = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  const toggle = (k) => () => setF(p => ({ ...p, [k]: !p[k] }));
  const setDescription = (html) => setF(p => ({ ...p, description: html }));

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const [questions, setQuestions] = useState(
    initialData?.questions?.map(q => ({ question_text: q.question_text||"", question_type: q.question_type||"mcq", options: q.options?.length ? q.options : ["",""], correct_answer: q.correct_answer||"", explanation: q.explanation||"", hint: q.hint||"", marks: q.marks??1, negative_marks: q.negative_marks??0 }))
    ?? [{ question_text: "", question_type: "mcq", options: ["", ""], correct_answer: "", explanation: "", hint: "", marks: 1, negative_marks: 0 }]
  );
  const blankQ  = ()          => ({ question_text: "", question_type: f.exercise_type, options: ["", ""], correct_answer: "", explanation: "", hint: "", marks: 1, negative_marks: 0 });
  const addQ    = ()          => setQuestions(p => [...p, blankQ()]);
  const rmQ     = (i)         => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updQ    = (i, k, v)   => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const updOpt  = (qi, oi, v) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));
  const addOpt  = (qi)        => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const rmOpt   = (qi, oi)    => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));

  /* ── Validation helpers ────────────────────────────────────────────────── */
  const v = {
    topic:       !ts.selectedTopic,
    sub:         !ts.selectedSub,
    title:       !f.title.trim(),
    order:       +f.order < 0,
    maxAttempts: +f.max_attempts < 1,
    totalMarks:  f.total_marks !== "" && +f.total_marks < 0,
    timeLimit:   f.time_limit_sec !== "" && +f.time_limit_sec <= 0,
    noQuestions: questions.length === 0,
  };
  const qv = questions.map(q => ({
    text:    !q.question_text.trim(),
    answer:  !q.correct_answer.trim(),
    options: q.question_type === "mcq" && q.options.filter(Boolean).length < 2,
    marks:   q.marks < 0,
    negMark: q.negative_marks < 0,
  }));

  const isValid = () =>
    !Object.values(v).some(Boolean) &&
    qv.every(q => !q.text && !q.answer && !q.options && !q.marks && !q.negMark);

  const questionErrorMessages = {
    question_text:  "Question text is required",
    correct_answer: "Correct answer is required",
    options:        "At least 2 options are required",
    marks:          "Must be 0 or greater",
    negative_marks: "Must be 0 or greater",
  };
  const questionError = (i, field) => {
    if (!submitted) return null;
    const flagMap = { question_text: qv[i]?.text, correct_answer: qv[i]?.answer, options: qv[i]?.options, marks: qv[i]?.marks, negative_marks: qv[i]?.negMark };
    return flagMap[field] ? questionErrorMessages[field] : null;
  };

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid()) return;

    onSubmit({
      topic_id:          ts.selectedTopic,
      sub_topic_id:      ts.selectedSub,
      title:             f.title.trim(),
      order:             +f.order || 1,
      exercise_type:     f.exercise_type,
      difficulty:        f.difficulty,
      max_attempts:      +f.max_attempts || 5,
      shuffle_questions: f.shuffle_questions,
      shuffle_options:   f.shuffle_options,
      show_explanation:  f.show_explanation,
      ...(f.total_marks    && { total_marks:    +f.total_marks }),
      ...(f.time_limit_sec && { time_limit_sec: +f.time_limit_sec }),
      questions: questions.filter(q => q.question_text.trim() && q.correct_answer.trim()),
    });
  };

  const fc = (invalid) => invalid ? inpErr : inp;
  const s  = submitted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {isEdit ? "Edit Exercise Module" : "Create Exercise Module"}
      </h3>

      {/* ── Topic & SubTopic ─────────────────────────────────────────────── */}
      <SectionDivider title="Topic & SubTopic" />
      <TopicSubtopicSection
        isEdit={isEdit}
        initialData={initialData}
        topics={ts.topics}
        subtopics={ts.subtopics}
        loadingTopics={ts.loadingTopics}
        selectedTopic={ts.selectedTopic}
        selectedSub={ts.selectedSub}
        onTopicChange={ts.onTopicChange}
        onSubChange={ts.setSelectedSub}
        topicClassName={fc(s && v.topic)}
        subClassName={fc(s && v.sub)}
        topicErrorNode={err(s && v.topic, "Please select a topic")}
        subErrorNode={err(s && v.sub, "Please select a subtopic")}
      />

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <SectionDivider title="Basic Info" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className={lbl}>Title <span className="text-orange-500">*</span></label>
          <input className={fc(s && v.title)} placeholder="Exercise module title" value={f.title} onChange={set("title")} />
          {err(s && v.title, "Title is required")}
        </div>
        <div>
          <label className={lbl}>Order</label>

          <input type="number" min={0} className={fc(s && v.order)} value={f.order} onChange={set("order")} />
          {err(s && v.order, "Order must be 0 or greater")}
        </div>
      </div>
      <div>
        <label className={lbl}>Description</label>
        <RichTextEditor value={f.description} onChange={setDescription} placeholder="Short description (optional)" />
      </div>

      {/* ── Exercise Settings ────────────────────────────────────────────── */}
      <SectionDivider title="Exercise Settings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Exercise Type <span className="text-orange-500">*</span></label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={f.exercise_type} onChange={set("exercise_type")}>
              {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ").toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={lbl}>Difficulty</label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={f.difficulty} onChange={set("difficulty")}>
              {DIFF_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[["shuffle_questions","Shuffle Questions"],["shuffle_options","Shuffle Options"],["show_explanation","Show Explanation After Submit"]].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3 cursor-pointer">
            <input type="checkbox" checked={f[key]} onChange={toggle(key)} className="w-4 h-4 accent-orange-500 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
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
      <QuestionsEditor
        questions={questions}
        addQ={addQ} rmQ={rmQ} updQ={updQ} updOpt={updOpt} addOpt={addOpt} rmOpt={rmOpt}
        qTypes={Q_TYPES}
        getError={questionError}
        title="Questions"
        helperLabel="Exercise questions"
        required
        withNegativeMarks
        withHint
        topError={err(s && v.noQuestions, "At least one question is required")}
      />

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Update Exercise Module" : "Create Exercise Module")}</Button>
      </div>
    </form>
  );
}
