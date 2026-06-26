"use client";

import { useEffect, useState } from "react";
import { getTopics, getSubTopics } from "../../services/editorPanel";
import { ChevronDown, Trash2, X } from "lucide-react";
import Button from "../ui/Button";

const Q_TYPES      = ["mcq", "fill_blank", "true_false", "short_answer"];
const POS_OPTIONS  = ["noun", "verb", "adjective", "adverb", "phrase"];
const DIFF_OPTIONS = ["easy", "medium", "hard"];

const inp = `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400
  outline-none transition-all duration-200 text-sm
  border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`;

const inpErr = `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400
  outline-none transition-all duration-200 text-sm
  border-red-500 focus:ring-2 focus:ring-red-200`;

const lbl   = "block mb-2 text-sm font-medium text-gray-700";
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

export default function VideoModuleForm({ onSubmit, onCancel, saving = false }) {
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
  const [title,        setTitle]        = useState("");
  const [order,        setOrder]        = useState(1);
  const [format,       setFormat]       = useState("mp4");
  const [durationSec,  setDurationSec]  = useState("");
  const [transcript,   setTranscript]   = useState("");
  const [videoFile,    setVideoFile]    = useState(null);
  const [totalMarks,   setTotalMarks]   = useState("");
  const [timeLimitSec, setTimeLimitSec] = useState("");
  const [maxAttempts,  setMaxAttempts]  = useState(3);

  /* ── Words ─────────────────────────────────────────────────────────────── */
  const [words, setWords] = useState([]);
  const blankW  = ()        => ({ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" });
  const addW    = ()        => setWords(p => [...p, blankW()]);
  const rmW     = (i)       => setWords(p => p.filter((_, idx) => idx !== i));
  const updW    = (i, k, v) => setWords(p => p.map((w, idx) => idx === i ? { ...w, [k]: v } : w));

  /* ── Questions ─────────────────────────────────────────────────────────── */
  const [questions, setQuestions] = useState([]);
  const blankQ  = ()          => ({ question_text: "", question_type: "mcq", options: ["", ""], correct_answer: "", explanation: "", hint: "", marks: 1 });
  const addQ    = ()          => setQuestions(p => [...p, blankQ()]);
  const rmQ     = (i)         => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updQ    = (i, k, v)   => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const updOpt  = (qi, oi, v) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));
  const addOpt  = (qi)        => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const rmOpt   = (qi, oi)    => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));

  /* ── Validation helpers ────────────────────────────────────────────────── */
  const v = {
    topic:       !selectedTopic,
    sub:         !selectedSub,
    title:       !title.trim(),
    file:        !videoFile,
    order:       +order < 0,
    maxAttempts: +maxAttempts < 1,
    duration:    durationSec !== "" && +durationSec <= 0,
    totalMarks:  totalMarks !== "" && +totalMarks < 0,
    timeLimit:   timeLimitSec !== "" && +timeLimitSec <= 0,
  };
  const qv = questions.map(q => ({
    text:    !q.question_text.trim(),
    answer:  !q.correct_answer.trim(),
    options: q.question_type === "mcq" && q.options.filter(Boolean).length < 2,
  }));
  const wv = words.map(w => ({
    word:    !w.word.trim(),
    meaning: !w.meaning.trim(),
  }));

  const isValid = () =>
    !Object.values(v).some(Boolean) &&
    qv.every(q => !q.text && !q.answer && !q.options) &&
    wv.every(w => !w.word && !w.meaning);

  /* ── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid()) return;

    const fd = new FormData();
    fd.append("topic_id",     selectedTopic);
    fd.append("sub_topic_id", selectedSub);
    fd.append("title",        title.trim());
    fd.append("order",        +order);
    fd.append("video", JSON.stringify({
      format,
      ...(durationSec && { duration_sec: +durationSec }),
      ...(transcript   && { transcript }),
    }));
    const validWords = words.filter(w => w.word && w.meaning);
    const validQs    = questions.filter(q => q.question_text.trim() && q.correct_answer.trim());
    if (validWords.length > 0) fd.append("words",     JSON.stringify(validWords));
    if (validQs.length    > 0) fd.append("questions", JSON.stringify(validQs));
    if (totalMarks)   fd.append("total_marks",    +totalMarks);
    if (timeLimitSec) fd.append("time_limit_sec", +timeLimitSec);
    fd.append("max_attempts", +maxAttempts);
    fd.append("videoFile", videoFile);
    onSubmit(fd);
  };

  const fc = (invalid) => invalid ? inpErr : inp;
  const s  = submitted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-8 rounded-3xl border border-orange-500/20 shadow-xl">
      <h3 className="text-xl font-black text-[#3C1E0A] border-b border-orange-500/10 pb-4">Create Video Module</h3>

      {/* ── Topic & SubTopic ─────────────────────────────────────────────── */}
      <SectionDivider title="Topic & SubTopic" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Topic <span className="text-orange-500">*</span></label>
          <div className="relative">
            <select className={`${fc(s && v.topic)} cursor-pointer pr-9 appearance-none`} value={selectedTopic} onChange={e => onTopicChange(e.target.value)} disabled={loadingTopics}>
              <option value="">— {loadingTopics ? "Loading…" : "Choose topic"} —</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
          {err(s && v.topic, "Please select a topic")}
        </div>
        <div className={!selectedTopic ? "opacity-40 pointer-events-none" : ""}>
          <label className={lbl}>SubTopic <span className="text-orange-500">*</span></label>
          <div className="relative">
            <select className={`${fc(s && v.sub)} cursor-pointer pr-9 appearance-none`} value={selectedSub} onChange={e => setSelectedSub(e.target.value)} disabled={!selectedTopic}>
              <option value="">— Choose subtopic —</option>
              {subtopics.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
          {err(s && v.sub, "Please select a subtopic")}
        </div>
      </div>

      {/* ── Basic Info ───────────────────────────────────────────────────── */}
      <SectionDivider title="Basic Info" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className={lbl}>Title <span className="text-orange-500">*</span></label>
          <input className={fc(s && v.title)} placeholder="Video module title" value={title} onChange={e => setTitle(e.target.value)} />
          {err(s && v.title, "Title is required")}
        </div>
        <div>
          <label className={lbl}>Order</label>
          <input type="number" min={0} className={fc(s && v.order)} value={order} onChange={e => setOrder(e.target.value)} />
          {err(s && v.order, "Order must be 0 or greater")}
        </div>
      </div>

      {/* ── Video Settings ───────────────────────────────────────────────── */}
      <SectionDivider title="Video Settings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={lbl}>Format</label>
          <div className="relative">
            <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={format} onChange={e => setFormat(e.target.value)}>
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={lbl}>Duration (sec)</label>
          <input type="number" min={1} className={fc(s && v.duration)} placeholder="e.g. 300 (optional)" value={durationSec} onChange={e => setDurationSec(e.target.value)} />
          {err(s && v.duration, "Duration must be greater than 0")}
        </div>
      </div>
      <div>
        <label className={lbl}>Transcript <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea className={`${inp} resize-none`} rows={4} placeholder="Full transcript of the video…" value={transcript} onChange={e => setTranscript(e.target.value)} />
      </div>
      <div>
        <label className={lbl}>Video File <span className="text-orange-500">*</span> <span className="text-gray-400 font-normal text-xs">(.mp4, .webm)</span></label>
        <input
          type="file" accept="video/*"
          onChange={e => setVideoFile(e.target.files[0])}
          className={`w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 rounded-xl px-3 py-2 ${s && v.file ? "border-2 border-red-500" : "border border-orange-300"}`}
        />
        {err(s && v.file, "Video file is required")}
      </div>

      {/* ── Settings ─────────────────────────────────────────────────────── */}
      <SectionDivider title="Settings" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={lbl}>Max Attempts</label>
          <input type="number" min={1} className={fc(s && v.maxAttempts)} value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} />
          {err(s && v.maxAttempts, "Must be at least 1")}
        </div>
        <div>
          <label className={lbl}>Total Marks</label>
          <input type="number" min={0} className={fc(s && v.totalMarks)} placeholder="Optional" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} />
          {err(s && v.totalMarks, "Must be 0 or greater")}
        </div>
        <div>
          <label className={lbl}>Time Limit (sec)</label>
          <input type="number" min={1} className={fc(s && v.timeLimit)} placeholder="Optional" value={timeLimitSec} onChange={e => setTimeLimitSec(e.target.value)} />
          {err(s && v.timeLimit, "Must be greater than 0")}
        </div>
      </div>

      {/* ── Words ────────────────────────────────────────────────────────── */}
      <SectionDivider title="Vocabulary Words" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Key vocabulary words <span className="text-gray-400 font-normal">(optional)</span>
          {words.length > 0 && <span className="ml-2 text-orange-500 font-bold">— {words.length}</span>}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={addW}>+ Add Word</Button>
      </div>
      {words.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">
          No words yet — click <span className="font-semibold text-orange-400">Add Word</span> to include vocabulary.
        </div>
      ) : (
        <div className="space-y-4">
          {words.map((w, i) => (
            <div key={i} className={`rounded-2xl p-5 space-y-4 border ${s && (wv[i]?.word || wv[i]?.meaning) ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Word {i + 1}</span>
                <button type="button" onClick={() => rmW(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"><Trash2 size={12} /> Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Word <span className="text-orange-500">*</span></label>
                  <input className={fc(s && wv[i]?.word)} placeholder="e.g. Eloquent" value={w.word} onChange={e => updW(i, "word", e.target.value)} />
                  {err(s && wv[i]?.word, "Word is required")}
                </div>
                <div>
                  <label className={lbl}>Meaning <span className="text-orange-500">*</span></label>
                  <input className={fc(s && wv[i]?.meaning)} placeholder="Definition" value={w.meaning} onChange={e => updW(i, "meaning", e.target.value)} />
                  {err(s && wv[i]?.meaning, "Meaning is required")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Pronunciation</label>
                  <input className={inp} placeholder="e.g. EL-oh-kwent" value={w.pronunciation || ""} onChange={e => updW(i, "pronunciation", e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Part of Speech</label>
                  <div className="relative">
                    <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={w.part_of_speech} onChange={e => updW(i, "part_of_speech", e.target.value)}>
                      {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Difficulty</label>
                  <div className="relative">
                    <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={w.difficulty} onChange={e => updW(i, "difficulty", e.target.value)}>
                      {DIFF_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className={lbl}>Example Sentence</label>
                <input className={inp} placeholder="e.g. His eloquent speech moved the audience." value={w.example || ""} onChange={e => updW(i, "example", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}

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
        <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">
          No questions yet — click <span className="font-semibold text-orange-400">Add Question</span> to include comprehension checks.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className={`rounded-2xl p-5 space-y-4 border ${s && (qv[i]?.text || qv[i]?.answer || qv[i]?.options) ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Question {i + 1}</span>
                <button type="button" onClick={() => rmQ(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"><Trash2 size={12} /> Remove</button>
              </div>
              <div>
                <label className={lbl}>Question Text <span className="text-orange-500">*</span></label>
                <input className={fc(s && qv[i]?.text)} placeholder="Enter question…" value={q.question_text} onChange={e => updQ(i, "question_text", e.target.value)} />
                {err(s && qv[i]?.text, "Question text is required")}
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <input type="number" min={0} className={inp} value={q.marks} onChange={e => updQ(i, "marks", +e.target.value)} />
                </div>
              </div>
              {q.question_type === "mcq" && (
                <div>
                  <label className={lbl}>Options</label>
                  {err(s && qv[i]?.options, "At least 2 options are required")}
                  <div className="space-y-2 mt-1">
                    {q.options.map((o, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black flex items-center justify-center shrink-0">{String.fromCharCode(65 + oi)}</span>
                        <input className={inp} placeholder={`Option ${oi + 1}`} value={o} onChange={e => updOpt(i, oi, e.target.value)} />
                        {q.options.length > 2 && (
                          <button type="button" onClick={() => rmOpt(i, oi)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0"><X size={14} /></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addOpt(i)} className="text-xs text-orange-500 font-semibold cursor-pointer hover:text-orange-700 mt-1">+ Add Option</button>
                  </div>
                </div>
              )}
              <div>
                <label className={lbl}>Correct Answer <span className="text-orange-500">*</span></label>
                <input className={fc(s && qv[i]?.answer)} placeholder="Enter correct answer" value={q.correct_answer} onChange={e => updQ(i, "correct_answer", e.target.value)} />
                {err(s && qv[i]?.answer, "Correct answer is required")}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Hint <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className={inp} placeholder="Give a hint" value={q.hint || ""} onChange={e => updQ(i, "hint", e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className={inp} placeholder="Why is this correct?" value={q.explanation || ""} onChange={e => updQ(i, "explanation", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 border-t border-orange-500/10">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create Video Module"}</Button>
      </div>
    </form>
  );
}
