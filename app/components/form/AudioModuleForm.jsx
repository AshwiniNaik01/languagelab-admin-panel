"use client";

import { useEffect, useState } from "react";
import { getTopics, getSubTopics } from "../../services/editorPanel";
import { ChevronDown, Trash2, X } from "lucide-react";
import Button from "../ui/Button";
import { audioModuleSchema, parseYupErrors } from "../../validations/moduleSchemas";

const Q_TYPES      = ["mcq", "fill_blank", "true_false", "short_answer"];
const POS_OPTIONS  = ["noun", "verb", "adjective", "adverb", "phrase"];
const DIFF_OPTIONS = ["easy", "medium", "hard"];

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

export default function AudioModuleForm({ onSubmit, onCancel, saving = false, initialData = null, isEdit = false }) {
  const [errors, setErrors] = useState({});

  /* ── Topic / SubTopic ──────────────────────────────────────────────────── */
  const [topics,        setTopics]        = useState([]);
  const [subtopics,     setSubtopics]     = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(initialData?.topic_id?._id || initialData?.topic_id || "");
  const [selectedSub,   setSelectedSub]   = useState(initialData?.sub_topic_id?._id || initialData?.sub_topic_id || "");
  const [loadingTopics, setLoadingTopics] = useState(!isEdit);

  useEffect(() => {
    if (isEdit) return;
    (async () => {
      try {
        const r = await getTopics();
        setTopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
      } catch {} finally { setLoadingTopics(false); }
    })();
  }, [isEdit]);

  const onTopicChange = async (id) => {
    setSelectedTopic(id); setSelectedSub();
    clr("topic_id"); clr("sub_topic_id");
    if (!id) { setSubtopics([]); return; }
    try {
      const r = await getSubTopics(id);
      setSubtopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
    } catch { setSubtopics([]); }
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

  /* ── Words ─────────────────────────────────────────────────────────────── */
  const [words, setWords] = useState(
    initialData?.words?.map(w => ({ word: w.word||"", pronunciation: w.pronunciation||"", part_of_speech: w.part_of_speech||"noun", meaning: w.meaning||"", example: w.example||"", difficulty: w.difficulty||"easy" })) ?? []
  );
  const blankW  = ()        => ({ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" });
  const addW    = ()        => setWords(p => [...p, blankW()]);
  const rmW     = (i)       => setWords(p => p.filter((_, idx) => idx !== i));
  const updW    = (i, k, v) => setWords(p => p.map((w, idx) => idx === i ? { ...w, [k]: v } : w));

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

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  const clr    = (path) => setErrors(p => { const n = { ...p }; delete n[path]; return n; });
  const e      = (path) => errors[path];
  const fc     = (path) => e(path) ? inpErr : inp;
  const errMsg = (path) => e(path) ? <p className={errTxt}>{e(path)}</p> : null;

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const data = {
      topic_id:     selectedTopic,
      sub_topic_id: selectedSub,
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
    fd.append("topic_id",     selectedTopic);
    fd.append("sub_topic_id", selectedSub);
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
      {isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">Topic</p>
            <p className="text-sm font-semibold text-gray-700">{initialData?.topic_id?.title || selectedTopic}</p>
          </div>
          <div className="bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">SubTopic</p>
            <p className="text-sm font-semibold text-gray-700">{initialData?.sub_topic_id?.title || selectedSub}</p>
          </div>
        </div>
      )}
      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={lbl}>Topic <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select className={`${fc("topic_id")} cursor-pointer pr-9 appearance-none`} value={selectedTopic} onChange={e => onTopicChange(e.target.value)} disabled={loadingTopics}>
                <option value="">— {loadingTopics ? "Loading…" : "Choose topic"} —</option>
                {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
            </div>
            {errMsg("topic_id")}
          </div>
          <div className={!selectedTopic ? "opacity-40 pointer-events-none" : ""}>
            <label className={lbl}>SubTopic <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select className={`${fc("sub_topic_id")} cursor-pointer pr-9 appearance-none`} value={selectedSub} onChange={e => { setSelectedSub(e.target.value); clr("sub_topic_id"); }} disabled={!selectedTopic}>
                <option value="">— Choose subtopic —</option>
                {subtopics.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
            </div>
            {errMsg("sub_topic_id")}
          </div>
        </div>
      )}

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <SectionDivider title="Basic Info" />
      <div>
        <label className={lbl}>Title <span className="text-orange-500">*</span></label>
        <input className={fc("title")} placeholder="Audio module title" value={f.title} onChange={set("title")} />
        {errMsg("title")}
      </div>
      <div>
        <label className={lbl}>Description</label>
        <input className={inp} placeholder="Short description (optional)" value={f.description} onChange={set("description")} />
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
        <textarea className={`${inp} resize-none`} rows={4} placeholder="Full transcript of the audio…" value={f.transcript} onChange={set("transcript")} />
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
      <SectionDivider title="Vocabulary Words" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Key vocabulary words <span className="text-gray-400 font-normal">(optional)</span>{words.length > 0 && <span className="ml-2 text-orange-500 font-bold">— {words.length}</span>}</p>
        <Button type="button" variant="secondary" size="sm" onClick={addW}>+ Add Word</Button>
      </div>
      {words.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">No words yet — click <span className="font-semibold text-orange-400">Add Word</span>.</div>
      ) : (
        <div className="space-y-4">
          {words.map((w, i) => (
            <div key={i} className={`rounded-2xl p-5 space-y-4 border ${(e(`words[${i}].word`) || e(`words[${i}].meaning`)) ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Word {i + 1}</span>
                <button type="button" onClick={() => rmW(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"><Trash2 size={12} /> Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Word <span className="text-orange-500">*</span></label>
                  <input className={e(`words[${i}].word`) ? inpErr : inp} placeholder="e.g. Eloquent" value={w.word} onChange={ev => updW(i, "word", ev.target.value)} />
                  {e(`words[${i}].word`) && <p className={errTxt}>{e(`words[${i}].word`)}</p>}
                </div>
                <div>
                  <label className={lbl}>Meaning <span className="text-orange-500">*</span></label>
                  <input className={e(`words[${i}].meaning`) ? inpErr : inp} placeholder="Definition" value={w.meaning} onChange={ev => updW(i, "meaning", ev.target.value)} />
                  {e(`words[${i}].meaning`) && <p className={errTxt}>{e(`words[${i}].meaning`)}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Pronunciation</label>
                  <input className={inp} placeholder="e.g. EL-oh-kwent" value={w.pronunciation || ""} onChange={ev => updW(i, "pronunciation", ev.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Part of Speech</label>
                  <div className="relative">
                    <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={w.part_of_speech} onChange={ev => updW(i, "part_of_speech", ev.target.value)}>
                      {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Difficulty</label>
                  <div className="relative">
                    <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={w.difficulty} onChange={ev => updW(i, "difficulty", ev.target.value)}>
                      {DIFF_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className={lbl}>Example Sentence</label>
                <input className={inp} placeholder="Optional example" value={w.example || ""} onChange={ev => updW(i, "example", ev.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <SectionDivider title="Questions" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Comprehension questions <span className="text-gray-400 font-normal">(optional)</span>{questions.length > 0 && <span className="ml-2 text-orange-500 font-bold">— {questions.length}</span>}</p>
        <Button type="button" variant="secondary" size="sm" onClick={addQ}>+ Add Question</Button>
      </div>
      {questions.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">No questions yet — click <span className="font-semibold text-orange-400">Add Question</span>.</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const qe = (k) => e(`questions[${i}].${k}`);
            return (
              <div key={i} className={`rounded-2xl p-5 space-y-4 border ${qe("question_text") || qe("correct_answer") ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Question {i + 1}</span>
                  <button type="button" onClick={() => rmQ(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"><Trash2 size={12} /> Remove</button>
                </div>
                <div>
                  <label className={lbl}>Question Text <span className="text-orange-500">*</span></label>
                  <input className={qe("question_text") ? inpErr : inp} placeholder="Enter question…" value={q.question_text} onChange={ev => updQ(i, "question_text", ev.target.value)} />
                  {qe("question_text") && <p className={errTxt}>{qe("question_text")}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Type</label>
                    <div className="relative">
                      <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={q.question_type} onChange={ev => updQ(i, "question_type", ev.target.value)}>
                        {Q_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Marks</label>
                    <input type="number" min={0} className={inp} value={q.marks} onChange={ev => updQ(i, "marks", +ev.target.value)} />
                  </div>
                </div>
                {q.question_type === "mcq" && (
                  <div>
                    <label className={lbl}>Options</label>
                    {qe("options") && <p className={errTxt}>{qe("options")}</p>}
                    <div className="space-y-2 mt-1">
                      {q.options.map((o, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black flex items-center justify-center shrink-0">{String.fromCharCode(65 + oi)}</span>
                          <input className={inp} placeholder={`Option ${oi + 1}`} value={o} onChange={ev => updOpt(i, oi, ev.target.value)} />
                          {q.options.length > 2 && <button type="button" onClick={() => rmOpt(i, oi)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0"><X size={14} /></button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => addOpt(i)} className="text-xs text-orange-500 font-semibold cursor-pointer hover:text-orange-700 mt-1">+ Add Option</button>
                    </div>
                  </div>
                )}
                <div>
                  <label className={lbl}>Correct Answer <span className="text-orange-500">*</span></label>
                  <input className={qe("correct_answer") ? inpErr : inp} placeholder="Enter correct answer" value={q.correct_answer} onChange={ev => updQ(i, "correct_answer", ev.target.value)} />
                  {qe("correct_answer") && <p className={errTxt}>{qe("correct_answer")}</p>}
                </div>
                <div>
                  <label className={lbl}>Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className={inp} placeholder="Why is this correct?" value={q.explanation || ""} onChange={ev => updQ(i, "explanation", ev.target.value)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Update Audio Module" : "Create Audio Module")}</Button>
      </div>
    </form>
  );
}
