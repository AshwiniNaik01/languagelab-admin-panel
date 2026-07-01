"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import { videoModuleSchema, parseYupErrors } from "../../validations/moduleSchemas";
import {
  inp, inpErr, lbl, errTxt, Q_TYPES,
  SectionDivider, useTopicSubtopic, TopicSubtopicSection, WordsEditor, QuestionsEditor,
} from "./shared/ModuleFormShared";
import RichTextEditor from "./shared/RichTextEditor";

export default function VideoModuleForm({ onSubmit, onCancel, saving = false, initialData = null, isEdit = false }) {
  const [errors, setErrors] = useState({});

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const ts = useTopicSubtopic(initialData, isEdit);
  const onTopicChange = async (id) => {
    await ts.onTopicChange(id);
    clr("topic_id"); clr("sub_topic_id");
  };

  /* ── Module fields ─────────────────────────────────────────────────────── */
  const [f, setF] = useState({
    title:         initialData?.title              ?? "",
    description:   initialData?.description        ?? "",
    order:         initialData?.order              ?? 0,
    format:        initialData?.video?.format      ?? "mp4",
    speed:         initialData?.video?.speed       ?? "normal",
    duration_sec:  initialData?.video?.duration_sec ?? "",
    transcript:    initialData?.video?.transcript  ?? "",
    total_marks:   initialData?.total_marks        ?? "",
    time_limit_sec: initialData?.time_limit_sec    ?? "",
    max_attempts:  initialData?.max_attempts       ?? 3,
  });
  const [videoFile, setVideoFile] = useState(null);
  const set = (k) => (e) => { setF(p => ({ ...p, [k]: e.target.value })); clr(k); };
  const setDescription = (html) => { setF(p => ({ ...p, description: html })); clr("description"); };

  /* ── Words ─────────────────────────────────────────────────────────────── */
  const [words, setWords] = useState(
    initialData?.words?.map(w => ({ word: w.word||"", pronunciation: w.pronunciation||"", part_of_speech: w.part_of_speech||"noun", meaning: w.meaning||"", example: w.example||"", difficulty: w.difficulty||"easy" })) ?? []
  );
  const blankW  = ()        => ({ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" });
  const addW    = ()        => setWords(p => [...p, blankW()]);
  const rmW     = (i)       => setWords(p => p.filter((_, idx) => idx !== i));
  const updW    = (i, k, v) => setWords(p => p.map((w, idx) => idx === i ? { ...w, [k]: v } : w));
  const wordError = (i, field) => e(`words[${i}].${field}`);

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const [questions, setQuestions] = useState(
    initialData?.questions?.map(q => ({ question_text: q.question_text||"", question_type: q.question_type||"mcq", options: q.options?.length ? q.options : ["",""], correct_answer: q.correct_answer||"", explanation: q.explanation||"", marks: q.marks??1 })) ?? []
  );
  const blankQ  = ()          => ({ question_text: "", question_type: "mcq", options: ["", ""], correct_answer: "", explanation: "", marks: 1 });
  const addQ    = ()          => setQuestions(p => [...p, blankQ()]);
  const rmQ     = (i)         => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updQ    = (i, k, v)   => { setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q)); clr(`questions[${i}].${k}`); };
  const updOpt  = (qi, oi, v) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));
  const addOpt  = (qi)        => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const rmOpt   = (qi, oi)    => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));
  const questionError = (i, field) => e(`questions[${i}].${field}`);

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  const clr    = (path) => setErrors(p => { const n = { ...p }; delete n[path]; return n; });
  const e      = (path) => errors[path];
  const fc     = (path) => e(path) ? inpErr : inp;
  const errMsg = (path) => e(path) ? <p className={errTxt}>{e(path)}</p> : null;

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const data = {
      topic_id:     ts.selectedTopic,
      sub_topic_id: ts.selectedSub,
      title:        f.title,
      description:  f.description,
      order:        f.order === "" ? 0 : +f.order,
      videoFile,
      ...(f.total_marks    !== "" && { total_marks:    +f.total_marks }),
      ...(f.time_limit_sec !== "" && { time_limit_sec: +f.time_limit_sec }),
      max_attempts: +f.max_attempts || 3,
      words:     words.filter(w => w.word && w.meaning),
      questions: questions.map(q => ({
        question_text:  q.question_text,
        question_type:  q.question_type,
        correct_answer: q.correct_answer,
        marks:          +q.marks || 1,
        options:        q.options,
        ...(q.explanation && { explanation: q.explanation }),
      })),
    };

    try {
      await videoModuleSchema.validate(data, { abortEarly: false });
      setErrors({});
    } catch (yupErr) {
      setErrors(parseYupErrors(yupErr));
      return;
    }

    const fd = new FormData();
    fd.append("topic_id",     ts.selectedTopic);
    fd.append("sub_topic_id", ts.selectedSub);
    fd.append("title",        f.title.trim());
    fd.append("order",        +f.order || 0);
    if (f.description.trim()) fd.append("description", f.description.trim());
    fd.append("video", JSON.stringify({
      format: f.format,
      speed:  f.speed,
      ...(f.duration_sec && { duration_sec: +f.duration_sec }),
      ...(f.transcript   && { transcript:    f.transcript }),
    }));
    if (f.total_marks)    fd.append("total_marks",    +f.total_marks);
    if (f.time_limit_sec) fd.append("time_limit_sec", +f.time_limit_sec);
    fd.append("max_attempts", +f.max_attempts || 3);
    const validWords = words.filter(w => w.word && w.meaning);
    const validQs    = questions.filter(q => q.question_text.trim() && q.correct_answer.trim());
    if (validWords.length > 0) fd.append("words",     JSON.stringify(validWords));
    if (validQs.length    > 0) fd.append("questions", JSON.stringify(validQs));
    fd.append("videoFile", videoFile);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {isEdit ? "Edit Video Module" : "Create Video Module"}
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
        onSubChange={(id) => { ts.setSelectedSub(id); clr("sub_topic_id"); }}
        topicClassName={fc("topic_id")}
        subClassName={fc("sub_topic_id")}
        topicErrorNode={errMsg("topic_id")}
        subErrorNode={errMsg("sub_topic_id")}
      />

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <SectionDivider title="Basic Info" />
      <div>
        <label className={lbl}>Title <span className="text-orange-500">*</span></label>
        <input className={fc("title")} placeholder="Video module title" value={f.title} onChange={set("title")} />
        {errMsg("title")}
      </div>
      <div>
        <label className={lbl}>Description</label>
        <RichTextEditor value={f.description} onChange={setDescription} placeholder="Short description (optional)" error={!!e("description")} />
        {errMsg("description")}
      </div>
      <div>
        <label className={lbl}>Order</label>
        <input type="number" min={0} className={fc("order")} value={f.order} onChange={set("order")} />
        {errMsg("order")}
      </div>

      {/* ── Video Settings ───────────────────────────────────────────────── */}
      <SectionDivider title="Video Settings" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={lbl}>Format</label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={f.format} onChange={set("format")}>
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={lbl}>Speed</label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={f.speed} onChange={set("speed")}>
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={lbl}>Duration (sec)</label>
          <input type="number" min={0} className={inp} placeholder="Optional" value={f.duration_sec} onChange={set("duration_sec")} />
        </div>
      </div>
      <div>
        <label className={lbl}>Transcript <span className="text-gray-400 font-normal">(optional)</span></label>
        <RichTextEditor
          value={f.transcript}
          onChange={(html) => { setF(p => ({ ...p, transcript: html })); clr("transcript"); }}
          placeholder="Full transcript of the video…"
          minHeight={160}
        />
      </div>
      <div>
        <label className={lbl}>Video File <span className="text-orange-500">*</span> <span className="text-gray-400 font-normal text-xs">(.mp4, .webm)</span></label>
        <input
          type="file" accept="video/*"
          onChange={e => { setVideoFile(e.target.files[0]); clr("videoFile"); }}
          className={`w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 rounded-xl px-3 py-2 ${e("videoFile") ? "border-2 border-red-500" : "border border-orange-300"}`}
        />
        {errMsg("videoFile")}
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

      {/* ── Words ────────────────────────────────────────────────────────── */}
      <WordsEditor words={words} addW={addW} rmW={rmW} updW={updW} getError={wordError} />

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <QuestionsEditor
        questions={questions}
        addQ={addQ} rmQ={rmQ} updQ={updQ} updOpt={updOpt} addOpt={addOpt} rmOpt={rmOpt}
        qTypes={Q_TYPES}
        getError={questionError}
        title="Questions"
        helperLabel="Comprehension questions"
        emptyMessage={
          <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">No questions yet — click <span className="font-semibold text-orange-400">Add Question</span>.</div>
        }
      />

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Update Video Module" : "Create Video Module")}</Button>
      </div>
    </form>
  );
}
