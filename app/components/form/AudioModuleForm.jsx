"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import { audioModuleSchema, parseYupErrors } from "../../validations/moduleSchemas";
import {
  inp, inpErr, lbl, errTxt, Q_TYPES,
  SectionDivider, useTopicSubtopic, TopicSubtopicSection, WordsEditor, QuestionsEditor,
} from "./shared/ModuleFormShared";
import RichTextEditor from "./shared/RichTextEditor";

export default function AudioModuleForm({ onSubmit, onCancel, saving = false, initialData = null, isEdit = false }) {
  const [errors, setErrors] = useState({});

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const ts = useTopicSubtopic(initialData, isEdit);
  const onTopicChange = async (id) => {
    await ts.onTopicChange(id);
    clr("topic_id"); clr("sub_topic_id");
  };

  /* ── Module fields ─────────────────────────────────────────────────────── */
  const [f, setF] = useState({
    title:         initialData?.title               ?? "",
    description:   initialData?.description         ?? "",
    order:         initialData?.order               ?? 0,
    audio_type:    initialData?.audio?.type         ?? "mp3",
    speed:         initialData?.audio?.speed        ?? "normal",
    duration_sec:  initialData?.audio?.duration_sec ?? "",
    language:      initialData?.audio?.language     ?? "",
    speaker_name:  initialData?.audio?.speaker_name ?? "",
    transcript:    initialData?.audio?.transcript   ?? "",
    allow_replay:  initialData?.allow_replay        ?? true,
    replay_limit:  initialData?.replay_limit        ?? 3,
    total_marks:   initialData?.total_marks         ?? "",
    time_limit_sec: initialData?.time_limit_sec     ?? "",
    max_attempts:  initialData?.max_attempts        ?? 3,
  });
  const [audioFile, setAudioFile] = useState(null);
  const set    = (k) => (e) => { setF(p => ({ ...p, [k]: e.target.value })); clr(k); };
  const toggle = (k) => () => setF(p => ({ ...p, [k]: !p[k] }));
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
      audioFile,
      allow_replay: f.allow_replay,
      replay_limit: +f.replay_limit,
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
      await audioModuleSchema.validate(data, { abortEarly: false });
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
    fd.append("allow_replay", f.allow_replay);
    fd.append("replay_limit", +f.replay_limit);
    fd.append("audio", JSON.stringify({
      type:  f.audio_type,
      speed: f.speed,
      ...(f.duration_sec   && { duration_sec:  +f.duration_sec }),
      ...(f.language       && { language:       f.language }),
      ...(f.speaker_name   && { speaker_name:   f.speaker_name }),
      ...(f.transcript     && { transcript:     f.transcript }),
    }));
    if (f.total_marks)    fd.append("total_marks",    +f.total_marks);
    if (f.time_limit_sec) fd.append("time_limit_sec", +f.time_limit_sec);
    fd.append("max_attempts", +f.max_attempts || 3);
    const validWords = words.filter(w => w.word && w.meaning);
    const validQs    = questions.filter(q => q.question_text.trim() && q.correct_answer.trim());
    if (validWords.length > 0) fd.append("words",     JSON.stringify(validWords));
    if (validQs.length    > 0) fd.append("questions", JSON.stringify(validQs));
    fd.append("audioFile", audioFile);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">
        {isEdit ? "Edit Audio Module" : "Create Audio Module"}
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
        <input className={fc("title")} placeholder="Audio module title" value={f.title} onChange={set("title")} />
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

      {/* ── Audio Settings ───────────────────────────────────────────────── */}
      <SectionDivider title="Audio Settings" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={lbl}>Audio Type</label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={f.audio_type} onChange={set("audio_type")}>
              <option value="mp3">MP3</option>
              <option value="wav">WAV</option>
              <option value="ogg">OGG</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={lbl}>Playback Speed</label>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Speaker Name</label>
          <input className={inp} placeholder="e.g. Native English (Female)" value={f.speaker_name} onChange={set("speaker_name")} />
        </div>
        <div>
          <label className={lbl}>Language</label>
          <input className={inp} placeholder="e.g. English" value={f.language} onChange={set("language")} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3 bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3 cursor-pointer">
          <input type="checkbox" checked={f.allow_replay} onChange={toggle("allow_replay")} className="w-4 h-4 accent-orange-500 cursor-pointer" />
          <span className="text-sm font-medium text-gray-700">Allow Replay</span>
        </label>
        <div className={!f.allow_replay ? "opacity-40 pointer-events-none" : ""}>
          <label className={lbl}>Replay Limit</label>
          <input type="number" min={0} className={fc("replay_limit")} value={f.replay_limit} disabled={!f.allow_replay} onChange={set("replay_limit")} />
          {errMsg("replay_limit")}
        </div>
      </div>
      <div>
        <label className={lbl}>Transcript <span className="text-gray-400 font-normal">(optional)</span></label>
        <RichTextEditor
          value={f.transcript}
          onChange={(html) => { setF(p => ({ ...p, transcript: html })); clr("transcript"); }}
          placeholder="Full transcript of the audio…"
          minHeight={160}
        />
      </div>
      <div>
        <label className={lbl}>Audio File <span className="text-orange-500">*</span> <span className="text-gray-400 font-normal text-xs">(.mp3, .wav, .ogg)</span></label>
        <input
          type="file" accept="audio/*"
          onChange={e => { setAudioFile(e.target.files[0]); clr("audioFile"); }}
          className={`w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 rounded-xl px-3 py-2 ${e("audioFile") ? "border-2 border-red-500" : "border border-orange-300"}`}
        />
        {errMsg("audioFile")}
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
        <Button type="submit" disabled={saving}>{saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Update Audio Module" : "Create Audio Module")}</Button>
      </div>
    </form>
  );
}
