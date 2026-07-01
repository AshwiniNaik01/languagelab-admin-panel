"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { textModuleSchema, parseYupErrors } from "../../validations/moduleSchemas";
import {
  inp, inpErr, lbl, errTxt, Q_TYPES,
  SectionDivider, useTopicSubtopic, TopicSubtopicSection, QuestionsEditor,
} from "./shared/ModuleFormShared";
import RichTextEditor from "./shared/RichTextEditor";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function TextModuleForm({ onSubmit, onCancel, saving = false, initialData = null, isEdit = false }) {
  const [errors, setErrors] = useState({});

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const ts = useTopicSubtopic(initialData, isEdit);
  const onTopicChange = async (id) => {
    await ts.onTopicChange(id);
    clearErr("topic_id"); clearErr("sub_topic_id");
  };

  /* ── Module fields ─────────────────────────────────────────────────────── */
  const [f, setF] = useState({
    title:         initialData?.title                  ?? "",
    description:   initialData?.description            ?? "",
    order:         initialData?.order                  ?? 0,
    body:          initialData?.content?.body          ?? "",
    level:         initialData?.content?.level         ?? "B1",
    word_count:    initialData?.content?.word_count    ?? "",
    read_time_min: initialData?.content?.read_time_min ?? "",
    source:        initialData?.content?.source        ?? "",
    total_marks:   initialData?.total_marks            ?? "",
    time_limit_sec: initialData?.time_limit_sec        ?? "",
    max_attempts:  initialData?.max_attempts           ?? 3,
  });
  const set = (k) => (e) => { setF(p => ({ ...p, [k]: e.target.value })); clearErr(k === "body" ? "content.body" : k); };
  const setDescription = (html) => { setF(p => ({ ...p, description: html })); clearErr("description"); };

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const [questions, setQuestions] = useState(
    initialData?.questions?.map(q => ({
      question_text: q.question_text || "",
      question_type: q.question_type || "mcq",
      options:       q.options?.length ? q.options : ["", ""],
      correct_answer: q.correct_answer || "",
      explanation:   q.explanation || "",
      paragraph_ref: q.paragraph_ref || "",
      marks:         q.marks ?? 1,
    })) ?? []
  );
  const blankQ  = ()          => ({ question_text: "", question_type: "mcq", options: ["", ""], correct_answer: "", explanation: "", paragraph_ref: "", marks: 1 });
  const addQ    = ()          => setQuestions(p => [...p, blankQ()]);
  const rmQ     = (i)         => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updQ    = (i, k, v)   => { setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q)); clearErr(`questions[${i}].${k}`); };
  const updOpt  = (qi, oi, v) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));
  const addOpt  = (qi)        => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const rmOpt   = (qi, oi)    => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));
  const questionError = (i, field) => e(`questions[${i}].${field}`);

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  const clearErr = (path) => setErrors(p => { const n = { ...p }; delete n[path]; return n; });
  const e        = (path) => errors[path];
  const fc       = (path) => e(path) ? inpErr : inp;
  const errMsg   = (path) => e(path) ? <p className={errTxt}>{e(path)}</p> : null;

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const data = {
      topic_id:     ts.selectedTopic,
      sub_topic_id: ts.selectedSub,
      title:        f.title,
      description:  f.description,
      order:        f.order === "" ? 0 : +f.order,
      content: {
        body:          f.body,
        level:         f.level,
        ...(f.word_count    !== "" && { word_count:    +f.word_count }),
        ...(f.read_time_min !== "" && { read_time_min: +f.read_time_min }),
        ...(f.source.trim()        && { source:         f.source.trim() }),
      },
      ...(f.total_marks    !== "" && { total_marks:    +f.total_marks }),
      ...(f.time_limit_sec !== "" && { time_limit_sec: +f.time_limit_sec }),
      max_attempts: +f.max_attempts || 3,
      questions: questions.map(q => ({
        question_text:  q.question_text,
        question_type:  q.question_type,
        correct_answer: q.correct_answer,
        marks:          +q.marks || 1,
        options:        q.options,
        ...(q.explanation  && { explanation:   q.explanation }),
        ...(q.paragraph_ref && { paragraph_ref: +q.paragraph_ref }),
      })),
    };

    try {
      await textModuleSchema.validate(data, { abortEarly: false, stripUnknown: true });
      setErrors({});
    } catch (yupErr) {
      setErrors(parseYupErrors(yupErr));
      return;
    }

    onSubmit({
      ...data,
      title:       data.title.trim(),
      description: data.description?.trim() || undefined,
      questions:   data.questions.filter(q => q.question_text?.trim() && q.correct_answer?.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {isEdit ? "Edit Text Module" : "Create Text Module"}
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
        onTopicChange={onTopicChange}
        onSubChange={(id) => { ts.setSelectedSub(id); clearErr("sub_topic_id"); }}
        topicClassName={fc("topic_id")}
        subClassName={fc("sub_topic_id")}
        topicErrorNode={errMsg("topic_id")}
        subErrorNode={errMsg("sub_topic_id")}
      />

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <SectionDivider title="Basic Info" />
      <div>
        <label className={lbl}>Title <span className="ml-1 text-orange-500">*</span></label>
        <input className={fc("title")} placeholder="Module title" value={f.title} onChange={set("title")} />
        {errMsg("title")}
      </div>
      <div>
        <label className={lbl}>Description</label>
        <RichTextEditor value={f.description} onChange={setDescription} placeholder="Short description (optional)" error={!!e("description")} />
        {errMsg("description")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Order</label>
          <input type="number" min={0} className={fc("order")} value={f.order} onChange={set("order")} />
          {errMsg("order")}
        </div>
        <div>
          <label className={lbl}>CEFR Level</label>
          <select className={`${inp} cursor-pointer`} value={f.level} onChange={set("level")}>
            {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <SectionDivider title="Content" />
      <div>
        <label className={lbl}>Content Body <span className="ml-1 text-orange-500">*</span></label>
        <RichTextEditor
          value={f.body}
          onChange={(html) => { setF(p => ({ ...p, body: html })); clearErr("content.body"); }}
          placeholder="Write the full lesson text here…"
          error={!!e("content.body")}
          minHeight={480}
        />
        {errMsg("content.body")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={lbl}>Word Count</label>
          <input type="number" min={0} className={fc("content.word_count")} placeholder="e.g. 250" value={f.word_count} onChange={e2 => { setF(p => ({ ...p, word_count: e2.target.value })); clearErr("content.word_count"); }} />
          {errMsg("content.word_count")}
        </div>
        <div>
          <label className={lbl}>Read Time (min)</label>
          <input type="number" min={0} className={fc("content.read_time_min")} placeholder="e.g. 5" value={f.read_time_min} onChange={e2 => { setF(p => ({ ...p, read_time_min: e2.target.value })); clearErr("content.read_time_min"); }} />
          {errMsg("content.read_time_min")}
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
          <input type="number" min={1} className={fc("max_attempts")} value={f.max_attempts} onChange={set("max_attempts")} />
          {errMsg("max_attempts")}
        </div>
        <div>
          <label className={lbl}>Total Marks</label>
          <input type="number" min={0} className={fc("total_marks")} placeholder="Optional" value={f.total_marks} onChange={set("total_marks")} />
          {errMsg("total_marks")}
        </div>
        <div>
          <label className={lbl}>Time Limit (sec)</label>
          <input type="number" min={0} className={fc("time_limit_sec")} placeholder="Optional" value={f.time_limit_sec} onChange={set("time_limit_sec")} />
          {errMsg("time_limit_sec")}
        </div>
      </div>

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <QuestionsEditor
        questions={questions}
        addQ={addQ} rmQ={rmQ} updQ={updQ} updOpt={updOpt} addOpt={addOpt} rmOpt={rmOpt}
        qTypes={Q_TYPES}
        getError={questionError}
        title="Questions"
        helperLabel="Comprehension questions"
        withParagraphRef
        emptyMessage={
          <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">
            No questions yet — click <span className="font-semibold text-orange-400">Add Question</span> to include comprehension checks.
          </div>
        }
      />

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Update Text Module" : "Create Text Module")}
        </Button>
      </div>
    </form>
  );
}
