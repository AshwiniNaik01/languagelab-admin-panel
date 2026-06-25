"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import EditorLayout from "../../layouts/EditorLayout";
import ScrollableTable from "../Table";
import { ActionButton } from "../ui/ActionIconButton";
import Button from "../ui/Button";
import {
  getTopics, getSubTopics, getModules, deleteModule,
  createTextModule, createExerciseModule, createVocabularyModule,
  createVideoModule, createAudioModule,
} from "../../services/editorPanel";
import {
  Video, Music, FileText, Dumbbell, BookMarked,
  Plus, Check, ChevronDown, Trash2, X,
} from "lucide-react";

const TYPE_META = {
  text:       { label: "Text",       icon: FileText,   color: "bg-blue-500",   light: "bg-blue-50",   text: "text-blue-700"   },
  video:      { label: "Video",      icon: Video,      color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-700" },
  audio:      { label: "Audio",      icon: Music,      color: "bg-teal-500",   light: "bg-teal-50",   text: "text-teal-700"   },
  exercise:   { label: "Exercise",   icon: Dumbbell,   color: "bg-amber-500",  light: "bg-amber-50",  text: "text-amber-700"  },
  vocabulary: { label: "Vocabulary", icon: BookMarked, color: "bg-pink-500",   light: "bg-pink-50",   text: "text-pink-700"   },
};

const CEFR_LEVELS      = ["A1", "A2", "B1", "B2", "C1", "C2"];
const Q_TYPES_TEXT     = ["mcq", "fill_blank", "true_false", "short_answer"];
const Q_TYPES_EXERCISE = ["mcq", "fill_blank", "true_false", "match", "reorder"];
const Q_TYPES_VOCAB    = ["mcq", "fill_blank", "match_meaning", "spell_word"];
const Q_TYPES_MEDIA    = ["mcq", "fill_blank", "true_false", "short_answer"];
const POS_OPTIONS      = ["noun", "verb", "adjective", "adverb", "phrase"];
const DIFF_OPTIONS     = ["easy", "medium", "hard"];

const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-gray-800 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 transition-all";

/* ── Shared: Questions section ───────────────────────────────────────────── */
function QuestionsSection({ questions, setQuestions, qtypes, withNegativeMarks = false, withParagraphRef = false }) {
  const blank = () => ({
    question_text: "", question_type: qtypes[0], options: ["", ""],
    correct_answer: "", explanation: "", hint: "", marks: 1, negative_marks: 0,
  });
  const addQ   = () => setQuestions(p => [...p, blank()]);
  const rmQ    = (i) => setQuestions(p => p.filter((_, idx) => idx !== i));
  const updQ   = (i, k, v) => setQuestions(p => p.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const updOpt = (qi, oi, v) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, odx) => odx === oi ? v : o) } : q));
  const addOpt = (qi) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: [...q.options, ""] } : q));
  const rmOpt  = (qi, oi) => setQuestions(p => p.map((q, idx) => idx === qi ? { ...q, options: q.options.filter((_, odx) => odx !== oi) } : q));

  return (
    <div className="border-t border-slate-200 pt-3">
      <div className="flex justify-between mb-2">
        <p className="text-xs font-bold text-slate-600">Questions <span className="font-normal text-slate-400">(optional)</span></p>
        <button type="button" onClick={addQ} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Question</button>
      </div>
      {questions.map((q, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Q{i + 1}</span>
            <button type="button" onClick={() => rmQ(i)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 size={13} /></button>
          </div>
          <input className={inp} placeholder="Question text *" value={q.question_text} onChange={e => updQ(i, "question_text", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Type</label>
              <select className={`${inp} cursor-pointer`} value={q.question_type} onChange={e => updQ(i, "question_type", e.target.value)}>
                {qtypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Marks</label>
              <input type="number" min={0} className={inp} value={q.marks} onChange={e => updQ(i, "marks", +e.target.value)} />
            </div>
          </div>
          {q.question_type === "mcq" && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Options</label>
              {q.options.map((o, oi) => (
                <div key={oi} className="flex gap-1 mb-1 items-center">
                  <input className={inp} placeholder={`Option ${oi + 1}`} value={o} onChange={e => updOpt(i, oi, e.target.value)} />
                  {q.options.length > 2 && <button type="button" onClick={() => rmOpt(i, oi)} className="text-red-400 cursor-pointer shrink-0"><X size={13} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addOpt(i)} className="text-xs text-orange-600 cursor-pointer">+ Option</button>
            </div>
          )}
          <input className={inp} placeholder="Correct answer *" value={q.correct_answer} onChange={e => updQ(i, "correct_answer", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} placeholder="Hint (optional)" value={q.hint || ""} onChange={e => updQ(i, "hint", e.target.value)} />
            <input className={inp} placeholder="Explanation (optional)" value={q.explanation || ""} onChange={e => updQ(i, "explanation", e.target.value)} />
          </div>
          {withNegativeMarks && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Negative Marks</label>
              <input type="number" min={0} step={0.5} className={inp} value={q.negative_marks || 0} onChange={e => updQ(i, "negative_marks", +e.target.value)} />
            </div>
          )}
          {withParagraphRef && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Paragraph Ref (paragraph number this question refers to)</label>
              <input type="number" min={1} className={inp} placeholder="Optional" value={q.paragraph_ref || ""} onChange={e => updQ(i, "paragraph_ref", e.target.value ? +e.target.value : undefined)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Shared: Words section ───────────────────────────────────────────────── */
function WordsSection({ words, setWords, withDetails = false }) {
  const blank = () => ({ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" });
  const addW  = () => setWords(p => [...p, blank()]);
  const rmW   = (i) => setWords(p => p.filter((_, idx) => idx !== i));
  const updW  = (i, k, v) => setWords(p => p.map((w, idx) => idx === i ? { ...w, [k]: v } : w));

  return (
    <div className="border-t border-slate-200 pt-3">
      <div className="flex justify-between mb-2">
        <p className="text-xs font-bold text-slate-600">Words <span className="font-normal text-slate-400">(optional)</span></p>
        <button type="button" onClick={addW} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Word</button>
      </div>
      {words.map((w, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Word {i + 1}</span>
            {words.length > 1 && <button type="button" onClick={() => rmW(i)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 size={13} /></button>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} placeholder="Word *" value={w.word} onChange={e => updW(i, "word", e.target.value)} />
            <input className={inp} placeholder="Meaning *" value={w.meaning} onChange={e => updW(i, "meaning", e.target.value)} />
          </div>
          {withDetails && (
            <div className="grid grid-cols-2 gap-2">
              <input className={inp} placeholder="Pronunciation (e.g. sɪnˈsɪəli)" value={w.pronunciation || ""} onChange={e => updW(i, "pronunciation", e.target.value)} />
              <select className={`${inp} cursor-pointer`} value={w.part_of_speech || "noun"} onChange={e => updW(i, "part_of_speech", e.target.value)}>
                {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} placeholder="Example sentence (optional)" value={w.example || ""} onChange={e => updW(i, "example", e.target.value)} />
            {withDetails && (
              <select className={`${inp} cursor-pointer`} value={w.difficulty || "easy"} onChange={e => updW(i, "difficulty", e.target.value)}>
                {DIFF_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Per-type create forms ───────────────────────────────────────────────── */
function TextForm({ topicId, subtopicId, onDone, onCancel }) {
  const [f, setF] = useState({
    title: "", description: "", order: 1,
    body: "", level: "B1", word_count: "", read_time_min: "", source: "",
    total_marks: "", time_limit_sec: "", max_attempts: 3,
  });
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) { Swal.fire({ icon: "warning", title: "Title is required" }); return; }
    if (!f.body.trim())  { Swal.fire({ icon: "warning", title: "Content body is required" }); return; }
    const validQs = questions.filter(q => q.question_text.trim() && q.correct_answer.trim());
    setSaving(true);
    try {
      await createTextModule({
        topic_id:     topicId,
        sub_topic_id: subtopicId,
        title:        f.title.trim(),
        order:        +f.order || 0,
        ...(f.description.trim()  && { description:   f.description.trim() }),
        ...(f.total_marks         && { total_marks:   +f.total_marks }),
        ...(f.time_limit_sec      && { time_limit_sec:+f.time_limit_sec }),
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
      onDone();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Title <span className="text-red-500">*</span></label>
        <input className={inp} placeholder="Module title" value={f.title} onChange={set("title")} />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
        <input className={inp} placeholder="Short description (optional)" value={f.description} onChange={set("description")} />
      </div>

      {/* Order + Level */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Order</label>
          <input type="number" min={0} className={inp} value={f.order} onChange={set("order")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">CEFR Level</label>
          <select className={`${inp} cursor-pointer`} value={f.level} onChange={set("level")}>
            {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Word Count + Read Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Word Count</label>
          <input type="number" min={0} className={inp} placeholder="e.g. 150" value={f.word_count} onChange={set("word_count")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Read Time (min)</label>
          <input type="number" min={1} className={inp} placeholder="e.g. 3" value={f.read_time_min} onChange={set("read_time_min")} />
        </div>
      </div>

      {/* Source */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Source</label>
        <input className={inp} placeholder="e.g. Oxford English Grammar (optional)" value={f.source} onChange={set("source")} />
      </div>

      {/* Content Body */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Content Body <span className="text-red-500">*</span></label>
        <textarea className={`${inp} resize-none`} rows={5} placeholder="Write lesson text here…" value={f.body} onChange={set("body")} />
      </div>

      {/* Total Marks + Time Limit + Max Attempts */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Total Marks</label>
          <input type="number" min={0} className={inp} placeholder="Optional" value={f.total_marks} onChange={set("total_marks")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Time Limit (sec)</label>
          <input type="number" min={0} className={inp} placeholder="Optional" value={f.time_limit_sec} onChange={set("time_limit_sec")} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Max Attempts</label>
          <input type="number" min={1} className={inp} value={f.max_attempts} onChange={set("max_attempts")} />
        </div>
      </div>

      {/* Questions */}
      <QuestionsSection questions={questions} setQuestions={setQuestions} qtypes={Q_TYPES_TEXT} withParagraphRef />

      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function VideoForm({ topicId, subtopicId, onDone, onCancel }) {
  const [title, setTitle] = useState(""); const [order, setOrder] = useState(1);
  const [format, setFormat] = useState("mp4"); const [durationSec, setDurationSec] = useState("");
  const [transcript, setTranscript] = useState(""); const [file, setFile] = useState(null);
  const [words, setWords] = useState([]); const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !file) { Swal.fire({ icon: "warning", title: "Title and video file are required" }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("topic_id", topicId); fd.append("sub_topic_id", subtopicId);
      fd.append("title", title); fd.append("order", order);
      fd.append("video", JSON.stringify({ format, ...(durationSec && { duration_sec: +durationSec }), ...(transcript && { transcript }) }));
      const validWords = words.filter(w => w.word && w.meaning);
      const validQs    = questions.filter(q => q.question_text && q.correct_answer);
      if (validWords.length > 0) fd.append("words",     JSON.stringify(validWords));
      if (validQs.length    > 0) fd.append("questions", JSON.stringify(validQs));
      fd.append("videoFile", file);
      await createVideoModule(fd); onDone();
    } catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} placeholder="Video title" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" min={1} className={inp} value={order} onChange={e => setOrder(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Format</label>
          <select className={`${inp} cursor-pointer`} value={format} onChange={e => setFormat(e.target.value)}>
            <option value="mp4">MP4</option><option value="webm">WebM</option>
          </select>
        </div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Duration (sec)</label><input type="number" min={0} className={inp} placeholder="Optional" value={durationSec} onChange={e => setDurationSec(e.target.value)} /></div>
      </div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1">Transcript (optional)</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Full transcript of the video…" value={transcript} onChange={e => setTranscript(e.target.value)} /></div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Video File * (.mp4, .webm)</label>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 border border-slate-300 rounded-xl px-3 py-2" />
      </div>
      <WordsSection words={words} setWords={setWords} />
      <QuestionsSection questions={questions} setQuestions={setQuestions} qtypes={Q_TYPES_MEDIA} />
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function AudioForm({ topicId, subtopicId, onDone, onCancel }) {
  const [title, setTitle] = useState(""); const [order, setOrder] = useState(1);
  const [audioType, setAudioType] = useState("mp3"); const [speed, setSpeed] = useState("normal");
  const [durationSec, setDurationSec] = useState(""); const [transcript, setTranscript] = useState("");
  const [allowReplay, setAllowReplay] = useState(true); const [replayLimit, setReplayLimit] = useState(3);
  const [file, setFile] = useState(null);
  const [words, setWords] = useState([]); const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !file) { Swal.fire({ icon: "warning", title: "Title and audio file are required" }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("topic_id", topicId); fd.append("sub_topic_id", subtopicId);
      fd.append("title", title); fd.append("order", order);
      fd.append("allow_replay", allowReplay); fd.append("replay_limit", replayLimit);
      fd.append("audio", JSON.stringify({ type: audioType, speed, ...(durationSec && { duration_sec: +durationSec }), ...(transcript && { transcript }) }));
      const validWords = words.filter(w => w.word && w.meaning);
      const validQs    = questions.filter(q => q.question_text && q.correct_answer);
      if (validWords.length > 0) fd.append("words",     JSON.stringify(validWords));
      if (validQs.length    > 0) fd.append("questions", JSON.stringify(validQs));
      fd.append("audioFile", file);
      await createAudioModule(fd); onDone();
    } catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} placeholder="Audio title" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" min={1} className={inp} value={order} onChange={e => setOrder(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
          <select className={`${inp} cursor-pointer`} value={audioType} onChange={e => setAudioType(e.target.value)}>
            <option value="mp3">MP3</option><option value="wav">WAV</option><option value="ogg">OGG</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Speed</label>
          <select className={`${inp} cursor-pointer`} value={speed} onChange={e => setSpeed(e.target.value)}>
            <option value="slow">Slow</option><option value="normal">Normal</option><option value="fast">Fast</option>
          </select>
        </div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Duration (sec)</label><input type="number" min={0} className={inp} placeholder="Optional" value={durationSec} onChange={e => setDurationSec(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer">
          <input type="checkbox" checked={allowReplay} onChange={e => setAllowReplay(e.target.checked)} className="w-4 h-4 accent-orange-500 cursor-pointer" />
          <span className="text-xs font-semibold text-slate-600">Allow Replay</span>
        </label>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Replay Limit</label>
          <input type="number" min={1} className={inp} value={replayLimit} disabled={!allowReplay} onChange={e => setReplayLimit(e.target.value)} />
        </div>
      </div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1">Transcript (optional)</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Full transcript of the audio…" value={transcript} onChange={e => setTranscript(e.target.value)} /></div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Audio File * (.mp3, .wav, .ogg)</label>
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 border border-slate-300 rounded-xl px-3 py-2" />
      </div>
      <WordsSection words={words} setWords={setWords} />
      <QuestionsSection questions={questions} setQuestions={setQuestions} qtypes={Q_TYPES_MEDIA} />
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function ExerciseForm({ topicId, subtopicId, onDone, onCancel }) {
  const [f, setF] = useState({
    title: "", order: 1, exercise_type: "mcq", difficulty: "medium",
    shuffle_questions: true, shuffle_options: true, show_explanation: true, max_attempts: 5,
  });
  const [questions, setQuestions] = useState([{
    question_text: "", question_type: "mcq", options: ["", ""],
    correct_answer: "", explanation: "", hint: "", marks: 1, negative_marks: 0,
  }]);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title) { Swal.fire({ icon: "warning", title: "Title required" }); return; }
    setSaving(true);
    try {
      await createExerciseModule({
        topic_id: topicId, sub_topic_id: subtopicId,
        title: f.title, order: +f.order || 1,
        exercise_type: f.exercise_type, difficulty: f.difficulty,
        shuffle_questions: f.shuffle_questions, shuffle_options: f.shuffle_options,
        show_explanation: f.show_explanation, max_attempts: +f.max_attempts || 5,
        questions: questions.filter(q => q.question_text),
      });
      onDone();
    } catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };

  const tog = (k) => setF(p => ({ ...p, [k]: !p[k] }));

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="Quiz title" /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" min={1} className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Exercise Type</label>
          <select className={`${inp} cursor-pointer`} value={f.exercise_type} onChange={e => setF(p => ({ ...p, exercise_type: e.target.value }))}>
            {["mcq","fill_blank","true_false","match","reorder"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label>
          <select className={`${inp} cursor-pointer`} value={f.difficulty} onChange={e => setF(p => ({ ...p, difficulty: e.target.value }))}>
            {["easy","medium","hard"].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Max Attempts</label><input type="number" min={1} className={inp} value={f.max_attempts} onChange={e => setF(p => ({ ...p, max_attempts: e.target.value }))} /></div>
        <div className="flex flex-col gap-1.5 pt-1">
          {[["shuffle_questions","Shuffle Questions"],["shuffle_options","Shuffle Options"],["show_explanation","Show Explanation"]].map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input type="checkbox" checked={f[k]} onChange={() => tog(k)} className="w-3.5 h-3.5 accent-orange-500 cursor-pointer" />
              {label}
            </label>
          ))}
        </div>
      </div>
      <QuestionsSection questions={questions} setQuestions={setQuestions} qtypes={Q_TYPES_EXERCISE} withNegativeMarks={true} />
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function VocabForm({ topicId, subtopicId, onDone, onCancel }) {
  const [f, setF] = useState({ title: "", order: 1, max_attempts: 5 });
  const [words, setWords] = useState([{ word: "", pronunciation: "", part_of_speech: "noun", meaning: "", example: "", difficulty: "easy" }]);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title || words.some(w => !w.word || !w.meaning)) { Swal.fire({ icon: "warning", title: "Title, word and meaning are required" }); return; }
    setSaving(true);
    try {
      const validQs = questions.filter(q => q.question_text && q.correct_answer);
      await createVocabularyModule({
        topic_id: topicId, sub_topic_id: subtopicId,
        title: f.title, order: +f.order || 1, max_attempts: +f.max_attempts || 5,
        words,
        ...(validQs.length > 0 && { questions: validQs }),
      });
      onDone();
    } catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label><input className={inp} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="Vocabulary set title" /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1">Order</label><input type="number" min={1} className={inp} value={f.order} onChange={e => setF(p => ({ ...p, order: e.target.value }))} /></div>
      </div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1">Max Attempts</label><input type="number" min={1} className={inp} value={f.max_attempts} onChange={e => setF(p => ({ ...p, max_attempts: e.target.value }))} /></div>
      <WordsSection words={words} setWords={setWords} withDetails={true} />
      <QuestionsSection questions={questions} setQuestions={setQuestions} qtypes={Q_TYPES_VOCAB} />
      <FormBtns saving={saving} onCancel={onCancel} />
    </form>
  );
}

function FormBtns({ saving, onCancel }) {
  return (
    <div className="flex gap-3 pt-3 border-t border-slate-200">
      <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
        <Check size={15} /> {saving ? "Creating…" : "Create Module"}
      </button>
      <button type="button" onClick={onCancel} className="px-5 py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer">Cancel</button>
    </div>
  );
}

/* ── View Modal ──────────────────────────────────────────────────────────── */
function ViewModal({ mod, meta, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`flex items-center justify-between px-6 py-4 ${meta.color}`}>
          <div className="flex items-center gap-3">
            <meta.icon size={18} className="text-white" />
            <p className="font-black text-white">{mod.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer font-black">✕</button>
        </div>
        <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Order</p>
              <p className="font-bold text-slate-800">#{mod.order ?? "—"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Type</p>
              <p className={`font-bold text-sm capitalize ${meta.text}`}>{meta.label}</p>
            </div>
          </div>
          {mod.content?.level && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">CEFR Level</p>
              <p className="font-bold text-slate-800">{mod.content.level}</p>
            </div>
          )}
          {mod.content?.body && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Content</p>
              <p className="text-sm text-slate-700 line-clamp-4">{mod.content.body}</p>
            </div>
          )}
          {mod.words?.length > 0 && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Words ({mod.words.length})</p>
              {mod.words.slice(0, 3).map((w, i) => <p key={i} className="text-xs text-slate-700 font-semibold">{w.word} — {w.meaning}</p>)}
              {mod.words.length > 3 && <p className="text-xs text-slate-400 mt-1">+{mod.words.length - 3} more</p>}
            </div>
          )}
          {mod.questions?.length > 0 && (
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Questions ({mod.questions.length})</p>
              <p className="text-xs text-slate-600 font-semibold">{mod.questions[0]?.question_text}</p>
            </div>
          )}
        </div>
        <div className="px-6 pb-5">
          <Button variant="secondary" onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared page used by each module type ────────────────────────────────── */
export default function ModuleTypePage({ type }) {
  const meta         = TYPE_META[type];
  const searchParams = useSearchParams();

  const [topics, setTopics]               = useState([]);
  const [subtopics, setSubtopics]         = useState([]);
  const [modules, setModules]             = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingMods, setLoadingMods]     = useState(false);
  const [showForm, setShowForm]           = useState(searchParams.get("add") === "1");
  const [viewingMod, setViewingMod]       = useState(null);

  useEffect(() => { setShowForm(searchParams.get("add") === "1"); }, [searchParams]);

  useEffect(() => {
    (async () => {
      try { const r = await getTopics(); setTopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
      catch { } finally { setLoadingTopics(false); }
    })();
  }, []);

  const onTopicChange = async (id) => {
    setSelectedTopic(id); setSelectedSubtopic(""); setModules([]);
    if (!id) { setSubtopics([]); return; }
    try { const r = await getSubTopics(id); setSubtopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
    catch { setSubtopics([]); }
  };

  const onSubtopicChange = async (id) => {
    setSelectedSubtopic(id); setModules([]);
    if (!id) return;
    setLoadingMods(true);
    try { const r = await getModules(type, id); setModules(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
    catch { setModules([]); } finally { setLoadingMods(false); }
  };

  const handleDelete = async (mod) => {
    const r = await Swal.fire({ title: `Delete "${mod.title}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Delete" });
    if (!r.isConfirmed) return;
    try { await deleteModule(type, mod._id); setModules(p => p.filter(m => m._id !== mod._id)); }
    catch (err) { Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message }); }
  };

  const handleCreated = async () => {
    setShowForm(false);
    if (selectedSubtopic) {
      const r = await getModules(type, selectedSubtopic);
      setModules(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
    }
    Swal.fire({ icon: "success", title: "Module Created", timer: 1200, showConfirmButton: false });
  };

  const columns = [
    {
      header: "Module",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${meta.color}`}><meta.icon size={15} /></span>
          <div>
            <p className="font-bold text-slate-900 text-sm">{row.title}</p>
            <p className="text-[11px] text-slate-400">Order #{row.order ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: () => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${meta.light} ${meta.text}`}>{meta.label}</span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => <ActionButton onView={() => setViewingMod(row)} onDelete={() => handleDelete(row)} />,
    },
  ];

  const Form = { text: TextForm, video: VideoForm, audio: AudioForm, exercise: ExerciseForm, vocabulary: VocabForm }[type];

  return (
    <EditorLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 ${meta.color}`}><meta.icon size={20} /></div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{meta.label} Modules</h2>
            <p className="text-sm text-slate-500">Manage {meta.label.toLowerCase()} content modules.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Topic</label>
            <div className="relative">
              <select className={`${inp} cursor-pointer pr-8`} value={selectedTopic} onChange={e => onTopicChange(e.target.value)}>
                <option value="">— Choose topic —</option>
                {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {loadingTopics && <p className="text-[10px] text-slate-400 mt-1">Loading topics…</p>}
          </div>
          <div className={`bg-white border border-slate-200 rounded-2xl p-4 transition-all ${!selectedTopic ? "opacity-40" : ""}`}>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select SubTopic</label>
            <div className="relative">
              <select className={`${inp} cursor-pointer pr-8`} value={selectedSubtopic} onChange={e => onSubtopicChange(e.target.value)} disabled={!selectedTopic}>
                <option value="">— Choose subtopic —</option>
                {subtopics.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-slate-800">{meta.label} Modules <span className="ml-2 text-slate-400 font-normal">({modules.length})</span></p>
          <Button onClick={() => setShowForm(true)} disabled={!selectedSubtopic} title={!selectedSubtopic ? "Select a subtopic first" : ""}>
            <Plus size={14} className="mr-1" /> Add {meta.label} Module
          </Button>
        </div>

        <ScrollableTable
          columns={columns} data={modules} loading={loadingMods}
          emptyMessage={!selectedSubtopic ? "Select a topic and subtopic above to view modules." : `No ${meta.label.toLowerCase()} modules yet. Click 'Add ${meta.label} Module' to create one.`}
          maxHeight="calc(100vh - 380px)"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className={`flex items-center justify-between px-6 py-4 ${meta.color}`}>
              <div className="flex items-center gap-3">
                <meta.icon size={18} className="text-white" />
                <p className="font-black text-white">Add {meta.label} Module</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer font-black">✕</button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <Form topicId={selectedTopic} subtopicId={selectedSubtopic} onDone={handleCreated} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      {viewingMod && <ViewModal mod={viewingMod} meta={meta} onClose={() => setViewingMod(null)} />}
    </EditorLayout>
  );
}
