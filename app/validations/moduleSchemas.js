import * as Yup from "yup";

/* ── Shared sub-schemas ──────────────────────────────────────────────────── */

const textQuestionSchema = Yup.object({
  question_text:  Yup.string().trim().required("Question text is required"),
  question_type:  Yup.string().oneOf(["mcq", "fill_blank", "true_false", "short_answer"]),
  options:        Yup.array().of(Yup.string()).when("question_type", {
    is: "mcq",
    then: (s) => s.min(2, "At least 2 options are required"),
    otherwise: (s) => s,
  }),
  correct_answer: Yup.string().trim().required("Correct answer is required"),
  explanation:    Yup.string(),
  paragraph_ref:  Yup.number().integer().positive().nullable(),
  marks:          Yup.number().min(0, "Marks must be 0 or greater"),
});

const mediaQuestionSchema = Yup.object({
  question_text:  Yup.string().trim().required("Question text is required"),
  question_type:  Yup.string().oneOf(["mcq", "fill_blank", "true_false", "short_answer"]),
  options:        Yup.array().of(Yup.string()).when("question_type", {
    is: "mcq",
    then: (s) => s.min(2, "At least 2 options are required"),
    otherwise: (s) => s,
  }),
  correct_answer: Yup.string().trim().required("Correct answer is required"),
  explanation:    Yup.string(),
  marks:          Yup.number().min(0, "Marks must be 0 or greater"),
});

const exerciseQuestionSchema = Yup.object({
  question_text:   Yup.string().trim().required("Question text is required"),
  question_type:   Yup.string().oneOf(["mcq", "fill_blank", "true_false", "match", "reorder"]),
  options:         Yup.array().of(Yup.string()).when("question_type", {
    is: "mcq",
    then: (s) => s.min(2, "At least 2 options are required"),
    otherwise: (s) => s,
  }),
  correct_answer:  Yup.string().trim().required("Correct answer is required"),
  explanation:     Yup.string(),
  hint:            Yup.string(),
  marks:           Yup.number().min(0, "Marks must be 0 or greater"),
  negative_marks:  Yup.number().min(0, "Negative marks must be 0 or greater"),
});

const vocabQuestionSchema = Yup.object({
  question_text:  Yup.string().trim().required("Question text is required"),
  question_type:  Yup.string().oneOf(["mcq", "fill_blank", "match_meaning", "spell_word"]),
  options:        Yup.array().of(Yup.string()).when("question_type", {
    is: "mcq",
    then: (s) => s.min(2, "At least 2 options are required"),
    otherwise: (s) => s,
  }),
  correct_answer: Yup.string().trim().required("Correct answer is required"),
  marks:          Yup.number().min(0, "Marks must be 0 or greater"),
});

const wordSchema = Yup.object({
  word:           Yup.string().trim().required("Word is required"),
  meaning:        Yup.string().trim().required("Meaning is required"),
  pronunciation:  Yup.string(),
  part_of_speech: Yup.string().oneOf(["noun", "verb", "adjective", "adverb", "phrase"]),
  example:        Yup.string(),
  difficulty:     Yup.string().oneOf(["easy", "medium", "hard"]),
});

/* ── Text Module ─────────────────────────────────────────────────────────── */
export const textModuleSchema = Yup.object({
  topic_id:     Yup.string().required("Please select a topic"),
  sub_topic_id: Yup.string().required("Please select a subtopic"),
  title:        Yup.string().trim().min(2, "Title must be at least 2 characters").max(200, "Title too long").required("Title is required"),
  description:  Yup.string().max(500, "Description too long"),
  order:        Yup.number().integer().min(0, "Order must be 0 or greater"),
  content: Yup.object({
    body:          Yup.string().trim().required("Content body is required"),
    word_count:    Yup.number().integer().min(0, "Must be 0 or greater").nullable(),
    read_time_min: Yup.number().min(0, "Must be 0 or greater").nullable(),
    level:         Yup.string(),
    source:        Yup.string(),
  }).required(),
  total_marks:    Yup.number().min(0, "Must be 0 or greater").nullable(),
  time_limit_sec: Yup.number().integer().min(0, "Must be 0 or greater").nullable(),
  max_attempts:   Yup.number().integer().min(1, "Must be at least 1"),
  questions:      Yup.array().of(textQuestionSchema),
});

/* ── Video Module ────────────────────────────────────────────────────────── */
export const videoModuleSchema = Yup.object({
  topic_id:     Yup.string().required("Please select a topic"),
  sub_topic_id: Yup.string().required("Please select a subtopic"),
  title:        Yup.string().trim().min(2, "Title must be at least 2 characters").max(200, "Title too long").required("Title is required"),
  description:  Yup.string().max(500, "Description too long"),
  order:        Yup.number().integer().min(0, "Order must be 0 or greater"),
  videoFile:    Yup.mixed().required("Video file is required"),
  total_marks:    Yup.number().min(0, "Must be 0 or greater").nullable(),
  time_limit_sec: Yup.number().integer().min(0, "Must be 0 or greater").nullable(),
  max_attempts:   Yup.number().integer().min(1, "Must be at least 1"),
  words:     Yup.array().of(wordSchema),
  questions: Yup.array().of(mediaQuestionSchema),
});

/* ── Audio Module ────────────────────────────────────────────────────────── */
export const audioModuleSchema = Yup.object({
  topic_id:     Yup.string().required("Please select a topic"),
  sub_topic_id: Yup.string().required("Please select a subtopic"),
  title:        Yup.string().trim().min(2, "Title must be at least 2 characters").max(200, "Title too long").required("Title is required"),
  description:  Yup.string().max(500, "Description too long"),
  order:        Yup.number().integer().min(0, "Order must be 0 or greater"),
  audioFile:    Yup.mixed().required("Audio file is required"),
  allow_replay: Yup.boolean(),
  replay_limit: Yup.number().integer().min(0, "Must be 0 or greater"),
  total_marks:    Yup.number().min(0, "Must be 0 or greater").nullable(),
  time_limit_sec: Yup.number().integer().min(0, "Must be 0 or greater").nullable(),
  max_attempts:   Yup.number().integer().min(1, "Must be at least 1"),
  words:     Yup.array().of(wordSchema),
  questions: Yup.array().of(mediaQuestionSchema),
});

/* ── Exercise Module ─────────────────────────────────────────────────────── */
export const exerciseModuleSchema = Yup.object({
  topic_id:     Yup.string().required("Please select a topic"),
  sub_topic_id: Yup.string().required("Please select a subtopic"),
  title:        Yup.string().trim().min(2, "Title must be at least 2 characters").max(200, "Title too long").required("Title is required"),
  description:  Yup.string().max(500, "Description too long"),
  order:        Yup.number().integer().min(0, "Order must be 0 or greater"),
  exercise_type: Yup.string()
    .oneOf(["mcq", "fill_blank", "true_false", "match", "reorder"])
    .required("Exercise type is required"),
  difficulty:        Yup.string().oneOf(["easy", "medium", "hard"]),
  shuffle_questions: Yup.boolean(),
  shuffle_options:   Yup.boolean(),
  show_explanation:  Yup.boolean(),
  total_marks:    Yup.number().min(0, "Must be 0 or greater").nullable(),
  time_limit_sec: Yup.number().integer().min(0, "Must be 0 or greater").nullable(),
  max_attempts:   Yup.number().integer().min(1, "Must be at least 1"),
  questions: Yup.array().of(exerciseQuestionSchema).min(1, "At least one question is required").required(),
});

/* ── Vocabulary Module ───────────────────────────────────────────────────── */
export const vocabularyModuleSchema = Yup.object({
  topic_id:     Yup.string().required("Please select a topic"),
  sub_topic_id: Yup.string().required("Please select a subtopic"),
  title:        Yup.string().trim().min(2, "Title must be at least 2 characters").max(200, "Title too long").required("Title is required"),
  description:  Yup.string().max(500, "Description too long"),
  order:        Yup.number().integer().min(0, "Order must be 0 or greater"),
  max_attempts: Yup.number().integer().min(1, "Must be at least 1"),
  words:     Yup.array().of(wordSchema).min(1, "At least one word is required").required(),
  questions: Yup.array().of(vocabQuestionSchema),
});

/* ── Helper: flatten Yup errors → { "path.key": "message" } ─────────────── */
export function parseYupErrors(err) {
  const map = {};
  if (err?.inner?.length) {
    err.inner.forEach((e) => { if (e.path) map[e.path] = e.message; });
  } else if (err?.path) {
    map[err.path] = err.message;
  }
  return map;
}
