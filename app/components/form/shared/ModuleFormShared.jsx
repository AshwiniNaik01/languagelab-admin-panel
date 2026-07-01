"use client";

import { useEffect, useState } from "react";
import { getTopics, getSubTopics } from "../../../services/editorPanel";
import { ChevronDown, Trash2, X } from "lucide-react";
import Button from "../../ui/Button";
import RichTextEditor from "./RichTextEditor";

/* ── Shared styles ────────────────────────────────────────────────────────── */
export const inp = `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400
  outline-none transition-all duration-200 text-sm
  border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200`;

export const inpErr = `w-full px-4 py-3 rounded-xl border bg-white text-gray-700 placeholder:text-gray-400
  outline-none transition-all duration-200 text-sm
  border-red-500 focus:ring-2 focus:ring-red-200`;

export const lbl    = "block mb-2 text-sm font-medium text-gray-700";
export const errTxt = "mt-1 text-xs text-red-500";

export const POS_OPTIONS  = ["noun", "verb", "adjective", "adverb", "phrase"];
export const DIFF_OPTIONS = ["easy", "medium", "hard"];

/* Common question types shared across Text/Audio/Video/Exercise/Vocabulary modules */
export const Q_TYPES = ["mcq", "fill_blank", "true_false", "short_answer", "match", "reorder", "match_meaning", "spell_word"];

function errMessage(err, fallback) {
  if (!err) return null;
  return typeof err === "string" ? err : fallback;
}

/* ── Section divider ──────────────────────────────────────────────────────── */
export function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-orange-500/10" />
      <p className="text-xs font-black text-[#3C1E0A]/50 uppercase tracking-widest shrink-0">{title}</p>
      <div className="h-px flex-1 bg-orange-500/10" />
    </div>
  );
}

/* ── Topic / SubTopic ─────────────────────────────────────────────────────── */
export function useTopicSubtopic(initialData, isEdit) {
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
    setSelectedTopic(id); setSelectedSub("");
    if (!id) { setSubtopics([]); return; }
    try {
      const r = await getSubTopics(id);
      setSubtopics(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []);
    } catch { setSubtopics([]); }
  };

  return { topics, subtopics, selectedTopic, setSelectedTopic, selectedSub, setSelectedSub, loadingTopics, onTopicChange };
}

export function TopicSubtopicSection({
  isEdit, initialData,
  topics, subtopics, loadingTopics,
  selectedTopic, selectedSub,
  onTopicChange, onSubChange,
  topicClassName, subClassName,
  topicErrorNode, subErrorNode,
}) {
  if (isEdit) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">Topic</p>
          <p className="text-sm font-semibold text-gray-700">{initialData?.topic_id?.title || initialData?.topic_id || selectedTopic}</p>
        </div>
        <div className="bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">SubTopic</p>
          <p className="text-sm font-semibold text-gray-700">{initialData?.sub_topic_id?.title || initialData?.sub_topic_id || selectedSub}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={lbl}>Topic <span className="text-orange-500">*</span></label>
        <div className="relative">
          <select className={`${topicClassName} cursor-pointer pr-9 appearance-none`} value={selectedTopic} onChange={e => onTopicChange(e.target.value)} disabled={loadingTopics}>
            <option value="">— {loadingTopics ? "Loading…" : "Choose topic"} —</option>
            {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
        </div>
        {topicErrorNode}
      </div>
      <div className={!selectedTopic ? "opacity-40 pointer-events-none" : ""}>
        <label className={lbl}>SubTopic <span className="text-orange-500">*</span></label>
        <div className="relative">
          <select className={`${subClassName} cursor-pointer pr-9 appearance-none`} value={selectedSub} onChange={e => onSubChange(e.target.value)} disabled={!selectedTopic}>
            <option value="">— Choose subtopic —</option>
            {subtopics.map(st => <option key={st._id} value={st._id}>{st.title}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
        </div>
        {subErrorNode}
      </div>
    </div>
  );
}

/* ── Words editor ─────────────────────────────────────────────────────────── */
export function WordsEditor({ words, addW, rmW, updW, getError = () => null, required = false, topError }) {
  return (
    <>
      <SectionDivider title="Vocabulary Words" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {required ? (
            <>Words to learn <span className="text-orange-500 text-xs font-semibold ml-1">(required — at least 1)</span></>
          ) : (
            <>Key vocabulary words <span className="text-gray-400 font-normal">(optional)</span></>
          )}
          {words.length > 0 && <span className="ml-2 text-orange-500 font-bold">— {words.length}</span>}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={addW}>+ Add Word</Button>
      </div>
      {topError}
      {words.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-orange-200 rounded-2xl text-slate-400 text-sm">No words yet — click <span className="font-semibold text-orange-400">Add Word</span>.</div>
      ) : (
        <div className="space-y-4">
          {words.map((w, i) => {
            const wordErr    = getError(i, "word");
            const meaningErr = getError(i, "meaning");
            return (
              <div key={i} className={`rounded-2xl p-5 space-y-4 border ${(wordErr || meaningErr) ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Word {i + 1}</span>
                  {(!required || words.length > 1) && (
                    <button type="button" onClick={() => rmW(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"><Trash2 size={12} /> Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Word <span className="text-orange-500">*</span></label>
                    <input className={wordErr ? inpErr : inp} placeholder="e.g. Eloquent" value={w.word} onChange={ev => updW(i, "word", ev.target.value)} />
                    {wordErr && <p className={errTxt}>{errMessage(wordErr, "Word is required")}</p>}
                  </div>
                  <div>
                    <label className={lbl}>Meaning <span className="text-orange-500">*</span></label>
                    <input className={meaningErr ? inpErr : inp} placeholder="Definition" value={w.meaning} onChange={ev => updW(i, "meaning", ev.target.value)} />
                    {meaningErr && <p className={errTxt}>{errMessage(meaningErr, "Meaning is required")}</p>}
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
                  <label className={lbl}>Example Sentence {!required && <span className="text-gray-400 font-normal">(optional)</span>}</label>
                  <input className={inp} placeholder={required ? "e.g. His eloquent speech moved the audience." : "Optional example"} value={w.example || ""} onChange={ev => updW(i, "example", ev.target.value)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ── Questions editor ─────────────────────────────────────────────────────── */
export function QuestionsEditor({
  questions, addQ, rmQ, updQ, updOpt, addOpt, rmOpt,
  qTypes,
  getError = () => null,
  title = "Questions",
  helperLabel = "Comprehension questions",
  required = false,
  emptyMessage,
  topError,
  withNegativeMarks = false,
  withHint = false,
  withParagraphRef = false,
}) {
  const extraCols = (withNegativeMarks || withParagraphRef) ? "grid-cols-3" : "grid-cols-2";

  return (
    <>
      <SectionDivider title={title} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {helperLabel}{" "}
          {required ? (
            <span className="text-orange-500 text-xs font-semibold ml-1">(required — at least 1)</span>
          ) : (
            <span className="text-gray-400 font-normal">(optional)</span>
          )}
          {questions.length > 0 && <span className="ml-2 text-orange-500 font-bold">— {questions.length}</span>}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={addQ}>+ Add Question</Button>
      </div>
      {topError}
      {questions.length === 0 && emptyMessage}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const textErr    = getError(i, "question_text");
            const answerErr  = getError(i, "correct_answer");
            const optionsErr = getError(i, "options");
            const marksErr   = getError(i, "marks");
            const negErr     = getError(i, "negative_marks");
            const hasErr = textErr || answerErr || optionsErr;
            return (
              <div key={i} className={`rounded-2xl p-5 space-y-4 border ${hasErr ? "bg-red-50/40 border-red-200" : "bg-orange-50/40 border-orange-200"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Question {i + 1}</span>
                  {(!required || questions.length > 1) && (
                    <button type="button" onClick={() => rmQ(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"><Trash2 size={12} /> Remove</button>
                  )}
                </div>
                <div>
                  <label className={lbl}>Question Text <span className="text-orange-500">*</span></label>
                  <input className={textErr ? inpErr : inp} placeholder="Enter question…" value={q.question_text} onChange={e => updQ(i, "question_text", e.target.value)} />
                  {textErr && <p className={errTxt}>{errMessage(textErr, "Question text is required")}</p>}
                </div>
                <div className={`grid ${extraCols} gap-4`}>
                  <div>
                    <label className={lbl}>Type</label>
                    <div className="relative">
                      <select className={`${inp} cursor-pointer pr-9 appearance-none`} value={q.question_type} onChange={e => updQ(i, "question_type", e.target.value)}>
                        {qTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, " ").toUpperCase()}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Marks</label>
                    <input type="number" min={0} className={marksErr ? inpErr : inp} value={q.marks} onChange={e => updQ(i, "marks", +e.target.value)} />
                    {marksErr && <p className={errTxt}>{errMessage(marksErr, "Must be 0 or greater")}</p>}
                  </div>
                  {withNegativeMarks && (
                    <div>
                      <label className={lbl}>Negative Marks</label>
                      <input type="number" min={0} step={0.5} className={negErr ? inpErr : inp} value={q.negative_marks} onChange={e => updQ(i, "negative_marks", +e.target.value)} />
                      {negErr && <p className={errTxt}>{errMessage(negErr, "Must be 0 or greater")}</p>}
                    </div>
                  )}
                  {withParagraphRef && (
                    <div>
                      <label className={lbl}>Paragraph Ref</label>
                      <input type="number" min={1} className={inp} placeholder="Optional" value={q.paragraph_ref || ""} onChange={e => updQ(i, "paragraph_ref", e.target.value)} />
                    </div>
                  )}
                </div>
                {q.question_type === "mcq" && (
                  <div>
                    <label className={lbl}>Options</label>
                    {optionsErr && <p className={errTxt}>{errMessage(optionsErr, "At least 2 options are required")}</p>}
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
                  <input className={answerErr ? inpErr : inp} placeholder="Enter correct answer" value={q.correct_answer} onChange={e => updQ(i, "correct_answer", e.target.value)} />
                  {answerErr && <p className={errTxt}>{errMessage(answerErr, "Correct answer is required")}</p>}
                </div>
                <div className={withHint ? "grid grid-cols-2 gap-4" : ""}>
                  {withHint && (
                    <div>
                      <label className={lbl}>Hint <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input className={inp} placeholder="Give a hint" value={q.hint || ""} onChange={e => updQ(i, "hint", e.target.value)} />
                    </div>
                  )}
                  <div>
                    <label className={lbl}>Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
                    <RichTextEditor value={q.explanation || ""} onChange={(html) => updQ(i, "explanation", html)} placeholder="Why is this correct?" minHeight={100} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
