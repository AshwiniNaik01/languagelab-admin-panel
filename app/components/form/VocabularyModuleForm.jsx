"use client";

import { useState } from "react";
import Button from "../ui/Button";
import {
  inp, inpErr, lbl, errTxt, Q_TYPES,
  SectionDivider, useTopicSubtopic, TopicSubtopicSection, WordsEditor, QuestionsEditor,
} from "./shared/ModuleFormShared";
import RichTextEditor from "./shared/RichTextEditor";

function err(show, msg) {
  return show ? <p className={errTxt}>{msg}</p> : null;
}

export default function VocabularyModuleForm({ onSubmit, onCancel, saving = false, initialData = null, isEdit = false }) {
  const [submitted, setSubmitted] = useState(false);

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const ts = useTopicSubtopic(initialData, isEdit);

  /* ── Module fields ─────────────────────────────────────────────────────── */
  const [f, setF] = useState({ title: initialData?.title ?? "", description: initialData?.description ?? "", order: initialData?.order ?? 1, max_attempts: initialData?.max_attempts ?? 5, total_marks: initialData?.total_marks ?? "", time_limit_sec: initialData?.time_limit_sec ?? "" });
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  const setDescription = (html) => setF(p => ({ ...p, description: html }));

  /* ── Words ─────────────────────────────────────────────────────────────── */
  const [words, setWords] = useState(
    initialData?.words?.map(w => ({ word: w.word||"", pronunciation: w.pronunciation||"", part_of_speech: w.part_of_speech||"noun", meaning: w.meaning||"", example: w.example||"", difficulty: w.difficulty||"easy" }))
    ?? [{ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" }]
  );
  const blankW  = ()        => ({ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" });
  const addW    = ()        => setWords(p => [...p, blankW()]);
  const rmW     = (i)       => setWords(p => p.filter((_, idx) => idx !== i));
  const updW    = (i, k, v) => setWords(p => p.map((w, idx) => idx === i ? { ...w, [k]: v } : w));

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const [questions, setQuestions] = useState([]);
  const blankQ  = ()          => ({ question_text: "", question_type: "mcq", options: ["", ""], correct_answer: "", explanation: "", marks: 1 });
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
    noWords:     words.length === 0,
  };
  const wv = words.map(w => ({
    word:    !w.word.trim(),
    meaning: !w.meaning.trim(),
  }));
  const qv = questions.map(q => ({
    text:    !q.question_text.trim(),
    answer:  !q.correct_answer.trim(),
    options: q.question_type === "mcq" && q.options.filter(Boolean).length < 2,
  }));

  const isValid = () =>
    !Object.values(v).some(Boolean) &&
    wv.every(w => !w.word && !w.meaning) &&
    qv.every(q => !q.text && !q.answer && !q.options);

  const wordError = (i, field) => {
    if (!submitted) return null;
    if (field === "word") return wv[i]?.word ? "Word is required" : null;
    if (field === "meaning") return wv[i]?.meaning ? "Meaning is required" : null;
    return null;
  };

  const questionErrorMessages = {
    question_text:  "Question text is required",
    correct_answer: "Correct answer is required",
    options:        "At least 2 options are required",
  };
  const questionError = (i, field) => {
    if (!submitted) return null;
    const flagMap = { question_text: qv[i]?.text, correct_answer: qv[i]?.answer, options: qv[i]?.options };
    return flagMap[field] ? questionErrorMessages[field] : null;
  };

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid()) return;

    const validQs = questions.filter(q => q.question_text.trim() && q.correct_answer.trim());
    onSubmit({
      topic_id:     ts.selectedTopic,
      sub_topic_id: ts.selectedSub,
      title:        f.title.trim(),
      order:        +f.order || 1,
      max_attempts: +f.max_attempts || 5,
      ...(f.description.trim()  && { description:    f.description.trim() }),
      ...(f.total_marks    !== "" && { total_marks:    +f.total_marks }),
      ...(f.time_limit_sec !== "" && { time_limit_sec: +f.time_limit_sec }),
      words,
      ...(validQs.length > 0 && { questions: validQs }),
    });
  };

  const fc = (invalid) => invalid ? inpErr : inp;
  const s  = submitted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {isEdit ? "Edit Vocabulary Module" : "Create Vocabulary Module"}
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
          <input className={fc(s && v.title)} placeholder="Vocabulary set title" value={f.title} onChange={set("title")} />
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
          <input type="number" min={0} className={inp} placeholder="Optional" value={f.total_marks} onChange={set("total_marks")} />
        </div>
        <div>
          <label className={lbl}>Time Limit (sec)</label>
          <input type="number" min={0} className={inp} placeholder="Optional" value={f.time_limit_sec} onChange={set("time_limit_sec")} />
        </div>
      </div>

      {/* ── Words ────────────────────────────────────────────────────────── */}
      <WordsEditor
        words={words} addW={addW} rmW={rmW} updW={updW}
        getError={wordError}
        required
        topError={err(s && v.noWords, "At least one word is required")}
      />

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <QuestionsEditor
        questions={questions}
        addQ={addQ} rmQ={rmQ} updQ={updQ} updOpt={updOpt} addOpt={addOpt} rmOpt={rmOpt}
        qTypes={Q_TYPES}
        getError={questionError}
        title="Practice Questions"
        helperLabel="Practice questions"
        emptyMessage={
          <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">
            No questions yet — click <span className="font-semibold text-orange-400">Add Question</span> to include practice checks.
          </div>
        }
      />

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Update Vocabulary Module" : "Create Vocabulary Module")}</Button>
      </div>
    </form>
  );
}
